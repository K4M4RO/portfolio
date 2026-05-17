/**
 * aiDetector.js
 * Détecte si le navigateur dispose d'un GPU compatible WebGPU
 * avec suffisamment de capacité pour faire tourner un LLM local.
 *
 * @returns {Promise<"webllm" | "api">}
 */

export async function checkAICapability() {
  if (!navigator.gpu) {
    console.info("[aiDetector] WebGPU non disponible → fallback API");
    return "api";
  }

  try {
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
      console.info("[aiDetector] Aucun adaptateur GPU trouvé → fallback API");
      return "api";
    }

    // L'API WebGPU n'expose pas la VRAM totale — on délègue la gestion OOM à WebLLM
    console.info("[aiDetector] GPU compatible WebGPU détecté → WebLLM");
    return "webllm";
  } catch (error) {
    console.warn("[aiDetector] Erreur lors de la détection GPU :", error);
    return "api";
  }
}
