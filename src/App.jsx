import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import AboutSection from "./components/AboutSection";
import ChatBox from "./components/ChatBox";
import { MessageCircle, X } from "lucide-react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [lang, setLang] = useState("FR");

  // Prevent background scroll when chat is open on mobile
  useEffect(() => {
    document.body.style.overflow = isChatOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isChatOpen]);

  // Écouteur global pour forcer l'ouverture depuis le ChatBox
  useEffect(() => {
    const handleForceOpen = (e) => {
      const id = e.detail;
      console.log("Tentative d'ouverture du projet:", id);
      
      setActiveTab("projects");
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openProjectModal', { detail: id }));
      }, 300);
    };

    window.addEventListener('forceOpenProject', handleForceOpen);
    return () => window.removeEventListener('forceOpenProject', handleForceOpen);
  }, []);

  const renderSection = () => {
    switch (activeTab) {
      case "home":     return <Hero setActiveTab={setActiveTab} lang={lang} />;
      case "projects": return <ProjectsSection lang={lang} />;
      case "skills":   return <SkillsSection lang={lang} />;
      case "about":    return <AboutSection lang={lang} />;
      default:         return <Hero setActiveTab={setActiveTab} lang={lang} />;
    }
  };

  return (
    <div className="bg-slate-950 text-slate-200 min-h-screen flex flex-col selection:bg-blue-500 selection:text-white">
      {/* ── Navigation ── */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} />

      {/* ── Main content ── */}
      <main className="pt-24 pb-12 px-4 max-w-6xl mx-auto w-full flex-grow">
        {renderSection()}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 py-8 bg-slate-950 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2025 Imrane Larhrib — Portfolio Data Science</p>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-center gap-2">
            <span>Développé avec React, Vite & Tailwind CSS</span>
            <span>•</span>
            <span>Hébergé sur Vercel</span>
          </div>
        </div>
      </footer>

      {/* ── Floating ChatBox ── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {/* Chat panel */}
        {isChatOpen && (
          <div className="w-[360px] h-[520px] rounded-2xl overflow-hidden shadow-2xl chat-enter">
            <ChatBox onClose={() => setIsChatOpen(false)} />
          </div>
        )}

        {/* Toggle button */}
        <div className="relative group flex items-center justify-center">
          {/* Tooltip */}
          {!isChatOpen && (
            <div className="absolute right-full mr-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 shadow-lg">
              Posez-moi une question sur mes projets !
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-slate-800"></div>
            </div>
          )}
          
          <button
            onClick={() => setIsChatOpen((v) => !v)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 relative
              ${isChatOpen
                ? "bg-slate-700 hover:bg-slate-600"
                : "bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 shadow-violet-900/50"
              }`}
            aria-label={isChatOpen ? "Fermer le chat" : "Ouvrir l'assistant IA"}
          >
            {/* Badge AI */}
            {!isChatOpen && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 scale-110">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-fuchsia-600 text-[8px] font-bold text-white uppercase tracking-wider">AI</span>
              </span>
            )}

            {isChatOpen
              ? <X className="w-6 h-6 text-white" />
              : <MessageCircle className="w-6 h-6 text-white" />
            }
          </button>
        </div>
      </div>
    </div>
  );
}
