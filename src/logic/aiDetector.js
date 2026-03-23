/**
 * aiDetector.js
 * Détecte si le navigateur dispose d'un GPU compatible WebGPU
 * avec suffisamment de capacité pour faire tourner un LLM local.
 *
 * @returns {Promise<"webllm" | "api">}
 */

// VRAM minimale recommandée en octets (4 Go pour un modèle quantifié)
const MIN_VRAM_BYTES = 4 * 1024 * 1024 * 1024;

export async function checkAICapability() {
  // 1. Vérifier que l'API WebGPU est disponible dans le navigateur
  if (!navigator.gpu) {
    console.info("[aiDetector] WebGPU non disponible → fallback API");
    return "api";
  }

  try {
    // 2. Demander un adaptateur GPU au navigateur
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      console.info("[aiDetector] Aucun adaptateur GPU trouvé → fallback API");
      return "api";
    }

    // 3. (Optionnel) Vérifier les limites de l'adaptateur
    //    `maxBufferSize` est un bon proxy pour estimer la VRAM disponible
    const limits = adapter.limits;
    const maxBufferSize = limits?.maxBufferSize ?? 0;

    if (maxBufferSize < MIN_VRAM_BYTES) {
      console.info(
        `[aiDetector] VRAM insuffisante (${(maxBufferSize / 1e9).toFixed(1)} Go < 4 Go requis) → fallback API`
      );
      return "api";
    }

    console.info(
      `[aiDetector] GPU compatible détecté (maxBufferSize: ${(maxBufferSize / 1e9).toFixed(1)} Go) → WebLLM`
    );
    return "webllm";
  } catch (error) {
    // requestAdapter() peut lever une exception sur certains navigateurs
    console.warn("[aiDetector] Erreur lors de la détection GPU :", error);
    return "api";
  }
}
