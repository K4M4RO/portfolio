import { Briefcase, GraduationCap, Mail, Phone } from "lucide-react";

export default function AboutSection({ lang = "FR" }) {
  const t = {
    FR: {
      title: "À propos de moi",
      intro: "Je suis actuellement étudiant en 2ème année de BUT Science des Données à l'IUT de Metz. Passionné par l'informatique et les statistiques, je cherche à appliquer mes compétences en traitement de données et développement.",
      expTitle: "Expériences Professionnelles",
      manager: "Manager",
      present: "Oct 2023 - Présent",
      pizzaHut: "Gestion d'équipe, comptabilité journalière et résolution de problèmes opérationnels.",
      educTitle: "Formation Académique",
      but: "BUT Science des Données",
      iut: "Formation intensive en statistiques, programmation (Python, R, SQL) et BI.",
      bac: "Baccalauréat International",
      bacDesc: "Série scientifique, mention Bien.",
      ctaTitle: "Un projet ou une opportunité ?",
      contactBtn: "Me contacter"
    },
    EN: {
      title: "About Me",
      intro: "I am currently a 2nd-year Data Science student at IUT de Metz. Passionate about computer science and statistics, I seek to apply my skills in data processing and development.",
      expTitle: "Professional Experience",
      manager: "Manager",
      present: "Oct 2023 - Present",
      pizzaHut: "Team management, daily accounting, and operational problem-solving.",
      educTitle: "Academic Education",
      but: "BUT Data Science",
      iut: "Intensive training in statistics, programming (Python, R, SQL), and BI.",
      bac: "International Baccalaureate",
      bacDesc: "Scientific track, with honors.",
      ctaTitle: "A project or an opportunity?",
      contactBtn: "Contact me"
    }
  };
  const text = t[lang] || t.FR;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      {/* Intro card */}
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl mb-12 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white mb-4">{text.title}</h2>
        <p className="text-slate-300 leading-relaxed text-lg">
          {text.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Expérience */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-8 h-1 bg-blue-500 rounded-full" />
            {text.expTitle}
          </h3>
          <div className="relative border-l-2 border-slate-800 ml-3 md:ml-6 pb-12">
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-blue-500 border-blue-900 shadow-xl shadow-blue-500/20" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h4 className="text-xl font-bold text-white">{text.manager}</h4>
                <span className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                  {text.present}
                </span>
              </div>
              <div className="text-lg font-medium mb-3 flex items-center gap-2 text-blue-400">
                <Briefcase className="w-4 h-4" /> Pizza Hut
              </div>
              <p className="text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                {text.pizzaHut}
              </p>
            </div>
          </div>
        </div>

        {/* Formation */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-8 h-1 bg-emerald-500 rounded-full" />
            {text.educTitle}
          </h3>
          <div className="relative border-l-2 border-slate-800 ml-3 md:ml-6 space-y-12 pb-12">
            {/* BUT */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-emerald-500 border-emerald-900 shadow-xl shadow-emerald-500/20" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h4 className="text-xl font-bold text-white">{text.but}</h4>
                <span className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">2024 - 2027</span>
              </div>
              <div className="text-lg font-medium mb-3 flex items-center gap-2 text-emerald-400">
                <GraduationCap className="w-4 h-4" /> IUT de Metz
              </div>
              <p className="text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                {text.iut}
              </p>
            </div>

            {/* Bac */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-emerald-500 border-emerald-900 shadow-xl shadow-emerald-500/20" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h4 className="text-xl font-bold text-white">{text.bac}</h4>
                <span className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">2022 - 2023</span>
              </div>
              <div className="text-lg font-medium mb-3 flex items-center gap-2 text-emerald-400">
                <GraduationCap className="w-4 h-4" /> Lycée El Khalid 2
              </div>
              <p className="text-slate-400 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800/50">
                {text.bacDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mt-8 p-8 bg-gradient-to-r from-blue-900/20 to-slate-900 rounded-2xl border border-slate-800 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">{text.ctaTitle}</h3>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="mailto:imranelahrib2017@gmail.com"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Mail className="w-4 h-4" /> {text.contactBtn}
          </a>
          <a
            href="tel:+33765809495"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            <Phone className="w-4 h-4" /> +33 7 65 80 94 95
          </a>
        </div>
      </div>
    </div>
  );
}
