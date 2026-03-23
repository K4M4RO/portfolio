import { useState } from "react";
import { Terminal, Users, Code2, BarChart3, Globe, Menu, X } from "lucide-react";

const navItems = {
  FR: [
    { id: "home",     label: "Accueil",      Icon: Terminal  },
    { id: "about",    label: "À propos",     Icon: Users     },
    { id: "projects", label: "Projets",      Icon: Code2     },
    { id: "skills",   label: "Compétences",  Icon: BarChart3 },
  ],
  EN: [
    { id: "home",     label: "Home",         Icon: Terminal  },
    { id: "about",    label: "About",        Icon: Users     },
    { id: "projects", label: "Projects",     Icon: Code2     },
    { id: "skills",   label: "Skills",       Icon: BarChart3 },
  ]
};

export default function Navbar({ activeTab, setActiveTab, lang = "FR", setLang }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo (Left) */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNav("home")}
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
            >
              PORTFOLIO
            </button>
          </div>

          {/* Desktop nav (Center) */}
          <div className="hidden md:flex items-center justify-center space-x-1 flex-1 px-8">
            {(navItems[lang] || navItems.FR).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                  activeTab === id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Lang Toggle (Right) */}
            <button
              onClick={() => setLang && setLang(lang === "FR" ? "EN" : "FR")}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sm font-semibold hover:border-blue-500 transition-colors"
            >
              <span>{lang}</span>
              <Globe className="w-4 h-4 text-slate-400" />
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-slate-300 hover:text-white p-1"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2">
          {(navItems[lang] || navItems.FR).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === id
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
