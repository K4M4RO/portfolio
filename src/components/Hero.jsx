import React from 'react';
import { ChevronRight, Download, Mail } from "lucide-react";

// SVG inline pour les icônes non disponibles dans lucide-react v1
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Hero = ({ setActiveTab, lang = "FR" }) => {
  const t = {
    FR: {
      badge: "À la recherche d’un stage de 10 semaines",
      hello: "Bonjour, je suis ",
      subtitle: "Étudiant en 2ème année BUT Science des Données à l'IUT de Metz",
      desc: "Passionné par la data, je transforme les données brutes en solutions concrètes grâce à Python, SQL et la Dataviz.",
      btn1: "Voir mes projets",
      btn2: "Télécharger CV",
    },
    EN: {
      badge: "Looking for a 10-week internship",
      hello: "Hello, I am ",
      subtitle: "2nd-year Data Science student at IUT de Metz",
      desc: "Passionate about data, I transform raw data into concrete solutions using Python, SQL, and Data Visualization.",
      btn1: "View my projects",
      btn2: "Download Resume",
    }
  };

  const text = t[lang] || t.FR;

  return (
    <section id="home" className="max-w-6xl mx-auto px-4 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12 mt-8 md:mt-20">
        <div className="flex-1 space-y-6">
            
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                {text.badge}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                {text.hello} <br className="hidden md:block" />
                <span className="text-blue-500">Imrane Larhrib</span>
            </h1>
            
            <h2 className="text-2xl text-slate-300 font-medium">
                {text.subtitle}
            </h2>
            
            <p className="text-xl text-slate-400 max-w-lg">
                {text.desc}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => {
                  if(setActiveTab) setActiveTab('projects');
                  else document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20">
                    {text.btn1} <ChevronRight className="w-4 h-4" />
                </button>
                <a href={lang === "EN" ? "/resume.pdf" : "/curriculum-vitae.pdf"} download={lang === "EN" ? "Resume_Imrane_Larhrib.pdf" : "CV_Imrane_Larhrib.pdf"} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 border border-slate-700">
                    {text.btn2} <Download className="w-4 h-4" />
                </a>
            </div>

            <div className="flex items-center gap-6 pt-8 text-slate-500">
                <a href="https://github.com/K4M4RO" target="_blank" rel="noreferrer" className="hover:text-blue-400 hover:-translate-y-1 transition-all">
                    <GithubIcon />
                </a>
                <a href="https://www.linkedin.com/in/imrane-larhrib-00a730296/" target="_blank" rel="noreferrer" className="hover:text-blue-400 hover:-translate-y-1 transition-all">
                    <LinkedinIcon />
                </a>
                <a href="mailto:imranelahrib2017@gmail.com" className="hover:text-blue-400 hover:-translate-y-1 transition-all">
                    <Mail className="w-6 h-6" />
                </a>
            </div>
        </div>

        <div className="relative w-full md:w-1/3 aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="relative z-10 w-64 h-64 md:w-80 md:h-80 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden flex items-center justify-center group hover:border-blue-500 transition-colors">
                <img src="/profil.png" alt="Imrane Larhrib" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
        </div>
    </section>
  );
};

export default Hero;
