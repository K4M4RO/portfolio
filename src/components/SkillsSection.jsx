import { Terminal, Database, BarChart3, FileSpreadsheet, ArrowLeftRight, Code2, BrainCircuit, Palette, ShieldCheck } from "lucide-react";

const mainSkills = [
  { name: "Python",       Icon: Terminal,        color: "blue",   border: "border-blue-500/20",   bg: "bg-blue-500/10",   text: "text-blue-400"   },
  { name: "SQL",          Icon: Database,        color: "cyan",   border: "border-cyan-500/20",   bg: "bg-cyan-500/10",   text: "text-cyan-400"   },
  { name: "Power BI",     Icon: BarChart3,       color: "yellow", border: "border-yellow-500/20", bg: "bg-yellow-500/10", text: "text-yellow-400" },
  { name: "Excel / VBA",  Icon: FileSpreadsheet, color: "green",  border: "border-green-500/20",  bg: "bg-green-500/10",  text: "text-green-400"  },
  { name: "ETL & Data Prep", Icon: ArrowLeftRight, color: "purple", border: "border-purple-500/20", bg: "bg-purple-500/10", text: "text-purple-400" },
  { name: "R / RShiny",   Icon: Code2,           color: "indigo", border: "border-indigo-500/20", bg: "bg-indigo-500/10", text: "text-indigo-400" },
];

const pythonLibs = ["Pandas", "NumPy", "Dash", "Plotly", "Selenium", "Playwright", "Beautiful Soup", "Scikit-learn", "PyTorch"];
const tools     = ["VS Code", "Spyder", "Google Colab", "Git", "Apache Hop", "Power Query"];
const softSkills = ["Apprentissage rapide", "Esprit d'équipe", "Adaptabilité", "Communication"];
const creative  = ["Premiere Pro", "Photoshop", "Illustrator"];
const languages = [
  { lang: "Français", level: "Bilingue" },
  { lang: "Anglais",  level: "Avancé"   },
  { lang: "Arabe",    level: "Bilingue" },
];

const Badge = ({ text, className = "" }) => (
  <span className={`px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm ${className}`}>
    {text}
  </span>
);

export default function SkillsSection({ lang = "FR" }) {
  const t = {
    FR: {
      title: "Compétences Techniques",
      subtitle: "Ma stack technique complète",
      ecosystem: "Écosystème Python",
      tools: "Outils & IDE",
      softSkills: "Soft Skills",
      softSkillsList: ["Apprentissage rapide", "Esprit d'équipe", "Adaptabilité", "Communication"],
      creative: "Créatif",
      languagesTitle: "Langues",
      languagesList: [
        { lang: "Français", level: "Bilingue" },
        { lang: "Anglais",  level: "Avancé"   },
        { lang: "Arabe",    level: "Bilingue" },
      ],
      standards: "Normes"
    },
    EN: {
      title: "Technical Skills",
      subtitle: "My complete tech stack",
      ecosystem: "Python Ecosystem",
      tools: "Tools & IDEs",
      softSkills: "Soft Skills",
      softSkillsList: ["Fast learning", "Team spirit", "Adaptability", "Communication"],
      creative: "Creative",
      languagesTitle: "Languages",
      languagesList: [
        { lang: "French", level: "Bilingual" },
        { lang: "English", level: "Advanced"  },
        { lang: "Arabic",  level: "Bilingual" },
      ],
      standards: "Standards"
    }
  };
  const text = t[lang] || t.FR;

  return (
    <div className="animate-fade-in">
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{text.title}</h2>
        <p className="text-slate-400">{text.subtitle}</p>
      </div>

      <div className="space-y-12 max-w-5xl mx-auto">
        {/* Main skill badges */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mainSkills.map(({ name, Icon, border, bg, text }) => (
            <div key={name} className={`flex items-center gap-4 p-4 rounded-xl border ${border} ${bg} transition-all hover:scale-[1.02]`}>
              <div className={text}><Icon className="w-5 h-5" /></div>
              <span className="font-bold text-lg text-slate-200">{name}</span>
            </div>
          ))}
        </div>

        {/* Python Ecosystem & Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-semibold text-blue-400 flex items-center gap-2 mb-6">
              <Terminal className="w-5 h-5" /> {text.ecosystem}
            </h3>
            <div className="flex flex-wrap gap-3">
              {pythonLibs.map((lib) => <Badge key={lib} text={lib} />)}
            </div>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2 mb-6">
              <Database className="w-5 h-5" /> {text.tools}
            </h3>
            <div className="flex flex-wrap gap-3">
              {tools.map((t) => <Badge key={t} text={t} />)}
            </div>
          </div>
        </div>

        {/* Soft skills / Creative / Languages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-800">
          {/* Soft skills */}
          <div>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4" /> {text.softSkills}
            </h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              {text.softSkillsList.map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> {text.standards}
              </h4>
              <span className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs">RGPD</span>
            </div>
          </div>

          {/* Creative */}
          <div>
            <h3 className="text-lg font-semibold text-pink-400 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4" /> {text.creative}
            </h3>
            <div className="flex flex-wrap gap-2">
              {creative.map((c) => (
                <span key={c} className="px-2 py-1 bg-pink-900/10 border border-pink-900/30 text-pink-300 rounded text-xs">{c}</span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{text.languagesTitle}</h3>
            <div className="space-y-2 text-sm">
              {text.languagesList.map(({ lang: l, level }) => (
                <div key={l} className="flex justify-between p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400">{l}</span>
                  <span className="text-white font-medium">{level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
