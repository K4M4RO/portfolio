import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { checkAICapability } from "../logic/aiDetector";
import { initWebLLM, askWebLLM, isEngineReady } from "../logic/webLLMHandler";
import { askAPI } from "../logic/apiHandler";
import projectsData from "../data/projects.json";

// ─── Sous-composants ───────────────────────────────────────────────────────────

function ModeBadge({ aiMode }) {
  const config = {
    groq:               { icon: "🟢", label: "Mode Cloud (Groq)",      cls: "bg-emerald-900/60 text-emerald-300" },
    webllm_uninitialized: { icon: "⚡", label: "IA locale disponible",  cls: "bg-amber-900/60 text-amber-300" },
    webllm_loading:     { icon: "⚡", label: "Chargement IA locale...", cls: "bg-violet-900/60 text-violet-300" },
    webllm_ready:       { icon: "⚡", label: "Mode Local (WebGPU)",     cls: "bg-violet-900/60 text-violet-300" },
  };
  const { icon, label, cls } = config[aiMode] ?? config.groq;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {icon} {label}
    </span>
  );
}

function MessageBubble({ msg, onAction }) {
  const isUser = msg.role === "user";

  let textToDisplay = msg.content;
  let actionId = null;
  if (!isUser) {
    const match = textToDisplay.match(/\[ACTION:SEE_PROJECT:([^\]]+)\]/);
    if (match) actionId = match[1];
    textToDisplay = textToDisplay.replace(/\[ACTION:SEE_PROJECT:[^\]]+\]/g, "").trim();
  }

  return (
    <div className={`flex flex-col mb-3 ${isUser ? "items-end" : "items-start"}`}>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        {!isUser && (
          <div className="mr-2 flex-shrink-0 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
            AI
          </div>
        )}
        <div
          className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-violet-600 text-white rounded-tr-sm"
              : "bg-slate-700/80 text-slate-100 rounded-tl-sm"
          }`}
        >
          {textToDisplay}
        </div>
        {isUser && (
          <div className="ml-2 flex-shrink-0 w-7 h-7 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
            Toi
          </div>
        )}
      </div>
      {actionId && (
        <div className="mt-2 ml-9">
          <button
            onClick={() => onAction && onAction(actionId)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 rounded-lg text-sm transition-colors border border-blue-600/30"
          >
            Voir le projet concerné <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start mb-3">
      <div className="mr-2 flex-shrink-0 w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold text-white">
        AI
      </div>
      <div className="bg-slate-700/80 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ progress }) {
  return (
    <div className="px-4 py-3 bg-slate-800/80 border-t border-slate-700/60">
      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
        <span className="truncate pr-2">{progress.text || "Initialisation..."}</span>
        <span className="flex-shrink-0 font-mono">{Math.round(progress.percent)}%</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function ChatBox({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bonjour ! Je suis l'assistant IA de ce portfolio. Posez-moi vos questions sur les projets, compétences ou expériences du développeur 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [messageCount, setMessageCount] = useState(() =>
    parseInt(sessionStorage.getItem("chat_message_count") || "0", 10)
  );
  // "groq" | "webllm_uninitialized" | "webllm_loading" | "webllm_ready"
  const [aiMode, setAiMode] = useState("groq");
  const [webgpuError, setWebgpuError] = useState(false);
  const [progress, setProgress] = useState({ text: "", percent: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const handleActionClick = (id) => {
    onClose?.();
    window.dispatchEvent(new CustomEvent("forceOpenProject", { detail: id.trim().toLowerCase() }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Tentative de switch vers l'IA locale ─────────────────────────────────
  const handleTrySwitchToWebLLM = async () => {
    setWebgpuError(false);

    // Engine déjà chargé dans cet onglet → switch immédiat sans re-téléchargement
    if (isEngineReady()) {
      setAiMode("webllm_ready");
      return;
    }

    const capability = await checkAICapability();
    if (capability === "api") {
      setWebgpuError(true);
    } else {
      setAiMode("webllm_uninitialized");
    }
  };

  // ── Retour à Groq ─────────────────────────────────────────────────────────
  const handleSwitchToGroq = () => {
    setAiMode("groq");
    setWebgpuError(false);
  };

  // ── Chargement et activation de l'engine WebLLM ───────────────────────────
  const handleActivateWebLLM = async () => {
    setAiMode("webllm_loading");
    setProgress({ text: "Démarrage...", percent: 0 });

    try {
      await initWebLLM((report) => {
        setProgress({
          text: report.text ?? "Chargement en cours...",
          percent: Math.round((report.progress ?? 0) * 100),
        });
      });
      setAiMode("webllm_ready");
      setProgress({ text: "", percent: 0 });
      showToast("⚡ IA locale activée avec succès !", "success");
    } catch (error) {
      console.warn("[ChatBox] Échec activation WebLLM, fallback Groq :", error.message);
      setAiMode("groq");
      setProgress({ text: "", percent: 0 });
      showToast("Impossible de charger l'IA locale. Mode Groq activé.", "warning");
    }
  };

  // ── Toast ─────────────────────────────────────────────────────────────────
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Envoi d'un message ────────────────────────────────────────────────────
  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || aiMode === "webllm_loading" || messageCount >= 50) return;

    const newCount = messageCount + 1;
    setMessageCount(newCount);
    sessionStorage.setItem("chat_message_count", newCount.toString());

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setIsLoading(true);
    inputRef.current?.focus();

    let reply = "";
    let currentMode = aiMode;

    try {
      if (currentMode === "webllm_ready") {
        try {
          reply = await askWebLLM(trimmed, projectsData);
        } catch (webllmError) {
          console.warn("[ChatBox] WebLLM crash, fallback Groq :", webllmError.message);
          setAiMode("groq");
          currentMode = "groq";
          showToast("⚠️ IA locale indisponible, basculement vers Groq.", "warning");
          reply = await askAPI(trimmed, projectsData);
        }
      } else {
        reply = await askAPI(trimmed, projectsData);
      }
    } catch (error) {
      reply = "Désolé, une erreur est survenue. Veuillez réessayer dans quelques instants.";
      console.error("[ChatBox] Erreur finale :", error);
    } finally {
      setIsLoading(false);
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isInputDisabled = isLoading || aiMode === "webllm_loading" || messageCount >= 50;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl backdrop-blur-sm">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
            ✦
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100 leading-none flex items-center gap-1.5">
              Assistant IA - Imrane
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-500/20 text-violet-300 tracking-wide uppercase">AI</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">Posez vos questions</p>
          </div>
        </div>
        <ModeBadge aiMode={aiMode} />
      </div>

      {/* ── Zone de messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onAction={handleActionClick} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── WebGPU indisponible ── */}
      {webgpuError && (
        <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-700/60">
          <p className="text-xs text-slate-400 text-center">
            WebGPU n'est pas disponible sur ce navigateur ou la configuration nécessaire n'est pas activée.
          </p>
        </div>
      )}

      {/* ── Panneau d'activation WebLLM ── */}
      {aiMode === "webllm_uninitialized" && (
        <div className="px-4 py-3 bg-slate-800/60 border-t border-slate-700/60">
          <button
            onClick={handleActivateWebLLM}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                       bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500
                       text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-violet-900/30
                       hover:shadow-violet-900/50 hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>⚡</span>
            <span>Activer l'IA locale</span>
            <span className="text-violet-300 text-xs font-normal">(~2.2 Go à télécharger)</span>
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">
            Un GPU compatible WebGPU a été détecté. L'IA s'exécutera entièrement dans votre navigateur — vos données restent sur votre appareil et ne transitent par aucun serveur.
          </p>
          <button
            onClick={handleSwitchToGroq}
            className="w-full mt-2 text-xs text-slate-500 hover:text-slate-300 transition-colors text-center py-1"
          >
            Annuler, rester sur Groq
          </button>
        </div>
      )}

      {/* ── Barre de progression WebLLM ── */}
      {aiMode === "webllm_loading" && <ProgressBar progress={progress} />}

      {/* ── Zone de saisie ── */}
      <div className="px-4 py-3 bg-slate-800/80 border-t border-slate-700/60">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              messageCount >= 50
                ? "Limite de démo atteinte (50/50). Pour continuer, contactez-moi sur LinkedIn !"
                : aiMode === "webllm_loading"
                ? "Chargement du modèle..."
                : "Posez votre question..."
            }
            disabled={isInputDisabled}
            rows={1}
            className="flex-1 resize-none bg-slate-700/60 border border-slate-600/60 rounded-xl px-3.5 py-2.5
                       text-sm text-slate-100 placeholder-slate-500 outline-none
                       focus:border-violet-500/70 focus:ring-1 focus:ring-violet-500/30
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200 max-h-32 overflow-y-auto"
            style={{ minHeight: "42px" }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isInputDisabled}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-500
                       disabled:bg-slate-700 disabled:cursor-not-allowed
                       flex items-center justify-center
                       transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            aria-label="Envoyer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>

        {/* Mode label + bouton de switch */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs mt-2 px-1">
          <span className="text-slate-500">
            {aiMode === "webllm_ready"
              ? "IA locale · Phi-3 mini (WebGPU)"
              : "IA propulsée par Groq (Llama 3.3)"}
          </span>
          {aiMode === "groq" && (
            <button
              onClick={handleTrySwitchToWebLLM}
              className="text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2 ml-2 flex-shrink-0"
            >
              ⚡ Essayer l'IA locale
            </button>
          )}
          {aiMode === "webllm_ready" && (
            <button
              onClick={handleSwitchToGroq}
              className="text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2 ml-2 flex-shrink-0"
            >
              ☁ Revenir à Groq
            </button>
          )}
          {(aiMode === "webllm_uninitialized" || aiMode === "webllm_loading") && (
            <span className="hidden sm:inline text-slate-600">Entrée pour envoyer · Maj+Entrée pour sauter une ligne</span>
          )}
        </div>
        {(aiMode === "groq" || aiMode === "webllm_ready") && (
          <p className="hidden sm:block text-right text-[10px] text-slate-600 mt-0.5 px-1">
            Entrée pour envoyer · Maj+Entrée pour sauter une ligne
          </p>
        )}
      </div>

      {/* ── Toast notifications ── */}
      {toast && (
        <div
          className={`absolute bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm
                      px-4 py-2.5 rounded-xl text-sm font-medium text-center shadow-xl
                      transition-all duration-300 z-50
                      ${toast.type === "success" ? "bg-emerald-800 text-emerald-100" : ""}
                      ${toast.type === "warning" ? "bg-amber-800 text-amber-100" : ""}
                      ${toast.type === "info"    ? "bg-slate-700 text-slate-100" : ""}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
