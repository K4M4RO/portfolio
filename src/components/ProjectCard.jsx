import { Maximize2, ShoppingCart, Award, Home, DatabaseBackup, Terminal, Code2, Database } from "lucide-react";

const iconMap = {
  ShoppingCart, Award, Home, DatabaseBackup, Terminal, Code2, Database
};

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function ProjectCard({ project, onClick, lang = "FR" }) {
  const Icon = iconMap[project.icon] || Code2;

  return (
    <div
      onClick={() => onClick(project)}
      className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1 flex flex-col h-full cursor-pointer relative overflow-hidden"
    >
      {/* Maximize icon on hover */}
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400">
        <Maximize2 className="w-5 h-5" />
      </div>

      {/* Project icon */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg ${project.iconBg} ${project.iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{project.title[lang] || project.title.FR || project.title}</h3>
      <p className="text-sm text-blue-400 mb-3 font-medium">{project.subtitle[lang] || project.subtitle.FR || project.subtitle}</p>
      <p className="text-slate-400 mb-6 text-sm flex-grow">{project.shortDesc[lang] || project.shortDesc.FR || project.shortDesc}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 2 && (
          <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {lang === "EN" ? "+ " + (project.tags.length - 2) + " More" : "+ " + (project.tags.length - 2) + " Autres"}
          </span>
        )}
        
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto flex items-center justify-center p-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-colors"
            title={lang === "EN" ? "View on GitHub" : "Voir sur GitHub"}
          >
            <GithubIcon className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
