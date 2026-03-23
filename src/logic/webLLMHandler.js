/**
 * webLLMHandler.js
 * Gestion de l'IA locale via @mlc-ai/web-llm (WebGPU).
 *
 * Modèle choisi : "Phi-3-mini-4k-instruct-q4f16_1-MLC"
 * Raisons :
 *  - Léger (~2.2 Go en VRAM vs ~5 Go pour Llama-3-8B)
 *  - Très performant pour des tâches de Q&A sur contexte court
 *  - Format q4f16_1 : quantifié 4-bit, rapide à charger depuis le cache
 *  - Meilleur compromis qualité/débit sur GPU discret ou intégré récent
 *
 * Pattern : Singleton — l'engine est instancié une seule fois et réutilisé.
 */

import { CreateMLCEngine } from "@mlc-ai/web-llm";

const MODEL_ID = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

/** Instance singleton de l'engine WebLLM. Null jusqu'au premier appel à initWebLLM(). */
let engine = null;

/**
 * Initialise l'engine WebLLM avec le modèle Phi-3-mini.
 * Si l'engine est déjà initialisé, retourne immédiatement (idempotent).
 *
 * @param {(report: import("@mlc-ai/web-llm").InitProgressReport) => void} initProgressCallback
 *   Callback appelé à chaque étape du chargement (téléchargement, chargement VRAM, compilation).
 *   Reçoit un objet { progress: number, text: string, timeElapsed: number }.
 * @returns {Promise<void>}
 * @throws {Error} Si le chargement échoue (OOM, WebGPU indisponible, réseau, etc.)
 */
export async function initWebLLM(initProgressCallback) {
  // Idempotence : ne recharger que si l'engine n'est pas déjà prêt
  if (engine !== null) {
    console.info("[webLLMHandler] Engine déjà initialisé, réutilisation du singleton.");
    return;
  }

  try {
    console.info(`[webLLMHandler] Chargement du modèle : ${MODEL_ID}`);

    engine = await CreateMLCEngine(MODEL_ID, {
      // Le callback reçoit { progress, text, timeElapsed } à chaque étape
      initProgressCallback,
    });

    console.info("[webLLMHandler] Engine prêt ✓");
  } catch (error) {
    // Réinitialiser le singleton en cas d'échec pour permettre une nouvelle tentative
    engine = null;

    // Distinguer OOM (device lost) des autres erreurs pour le message utilisateur
    const isOOM =
      error?.message?.toLowerCase().includes("device") ||
      error?.message?.toLowerCase().includes("out of memory") ||
      error?.message?.toLowerCase().includes("lost");

    const readableMessage = isOOM
      ? "Mémoire GPU insuffisante pour charger le modèle local. Basculement sur l'API."
      : `Échec du chargement WebLLM : ${error.message}`;

    console.error("[webLLMHandler] Erreur d'initialisation :", error);

    // On relève une erreur enrichie pour que l'appelant puisse décider du fallback
    throw new Error(readableMessage);
  }
}

/**
 * Envoie un message au modèle local (engine doit être initialisé au préalable).
 *
 * @param {string} message - La question posée par l'utilisateur.
 * @param {Array<Object>} context - Le contenu de projects.json pour le contexte système.
 * @returns {Promise<string>} - Le texte généré par le modèle.
 * @throws {Error} Si l'engine n'est pas initialisé, ou en cas d'erreur d'inférence (OOM, etc.)
 */
export async function askWebLLM(message, context) {
  if (engine === null) {
    throw new Error(
      "L'engine WebLLM n'est pas initialisé. Appelez initWebLLM() avant askWebLLM()."
    );
  }

  try {
    const messages = [
      {
        role: "system",
        content:
          "Tu es l'assistant IA intégré au portfolio d'un développeur web. " +
          "Réponds aux questions des visiteurs de façon concise et professionnelle, " +
          "en te basant exclusivement sur ces informations sur les projets et compétences du développeur : " +
          JSON.stringify(context),
      },
      {
        role: "user",
        content: message,
      },
    ];

    const response = await engine.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 512,
      // stream: false par défaut — réponse complète en une fois
    });

    const reply = response.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new Error("Le modèle a retourné une réponse vide.");
    }

    return reply;
  } catch (error) {
    // Détecter les erreurs OOM pendant l'inférence (le GPU peut perdre le contexte)
    const isOOM =
      error?.message?.toLowerCase().includes("device") ||
      error?.message?.toLowerCase().includes("out of memory") ||
      error?.message?.toLowerCase().includes("lost");

    if (isOOM) {
      // Réinitialiser le singleton pour permettre un rechargement ou basculement
      engine = null;
      console.error("[webLLMHandler] OOM pendant l'inférence, engine réinitialisé :", error);
      throw new Error(
        "Mémoire GPU insuffisante pendant la génération. Basculement sur l'API."
      );
    }

    console.error("[webLLMHandler] Erreur d'inférence :", error);
    throw new Error(`Erreur WebLLM lors de la génération : ${error.message}`);
  }
}

/**
 * Indique si l'engine est actuellement initialisé et prêt à l'emploi.
 * Utile pour éviter d'appeler initWebLLM() inutilement depuis les composants.
 *
 * @returns {boolean}
 */
export function isEngineReady() {
  return engine !== null;
}
