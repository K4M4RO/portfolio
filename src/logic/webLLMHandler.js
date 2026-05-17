import { CreateMLCEngine } from "@mlc-ai/web-llm";

const MODEL_ID = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

let engine = null;

// Réduit le contexte au strict nécessaire pour tenir dans la fenêtre de 4096 tokens
function buildCompactContext(context) {
  return context.map(({ id, title, shortDesc, tags, points }) => ({
    id,
    title: title?.FR ?? title,
    desc: shortDesc?.FR ?? shortDesc,
    tech: tags,
    points: points?.FR ?? points,
  }));
}

function isOOMError(message = "") {
  const m = message.toLowerCase();
  return (
    m.includes("device") ||
    m.includes("out of memory") ||
    m.includes("lost") ||
    m.includes("instance") ||
    m.includes("no longer exists")
  );
}

export async function initWebLLM(initProgressCallback) {
  if (engine !== null) {
    console.info("[webLLMHandler] Engine déjà initialisé, réutilisation du singleton.");
    return;
  }

  // Force le GPU haute-performance (RTX plutôt qu'Intel intégré).
  // WebLLM appelle navigator.gpu.requestAdapter() en interne — on surcharge
  // temporairement pour injecter powerPreference avant la création de l'engine.
  const gpu = navigator.gpu;
  const originalRequestAdapter = gpu?.requestAdapter?.bind(gpu);
  if (originalRequestAdapter) {
    gpu.requestAdapter = (options = {}) =>
      originalRequestAdapter({ ...options, powerPreference: "high-performance" });
  }

  try {
    console.info(`[webLLMHandler] Chargement du modèle : ${MODEL_ID}`);
    engine = await CreateMLCEngine(MODEL_ID, { initProgressCallback });
    console.info("[webLLMHandler] Engine prêt");
  } catch (error) {
    engine = null;
    console.error("[webLLMHandler] Erreur d'initialisation :", error);

    if (isOOMError(error?.message)) {
      const oomError = new Error("Mémoire GPU insuffisante. Vous pouvez réessayer.");
      oomError.isOOM = true;
      throw oomError;
    }

    throw new Error(`Échec du chargement : ${error.message}`);
  } finally {
    if (originalRequestAdapter) {
      gpu.requestAdapter = originalRequestAdapter;
    }
  }
}

export async function askWebLLM(message, context) {
  if (engine === null) {
    throw new Error("Engine non initialisé. Appelez initWebLLM() d'abord.");
  }

  try {
    const compactContext = buildCompactContext(context);

    const messages = [
      {
        role: "system",
        content:
          "Tu es l'assistant IA du portfolio d'un développeur. " +
          "Réponds de façon concise et professionnelle en te basant sur ces projets : " +
          JSON.stringify(compactContext),
      },
      { role: "user", content: message },
    ];

    const response = await engine.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 512,
    });

    const reply = response.choices[0]?.message?.content?.trim();
    if (!reply) throw new Error("Réponse vide du modèle.");
    return reply;
  } catch (error) {
    if (isOOMError(error?.message)) {
      engine = null;
      console.error("[webLLMHandler] OOM pendant l'inférence :", error);
      throw new Error("Mémoire GPU insuffisante pendant la génération.");
    }

    console.error("[webLLMHandler] Erreur d'inférence :", error);
    throw new Error(`Erreur lors de la génération : ${error.message}`);
  }
}

export function isEngineReady() {
  return engine !== null;
}
