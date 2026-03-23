import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import projectsData from "../data/projects.json";

export default function ProjectsSection({ lang = "FR" }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const t = {
    FR: { title: "Projets Réalisés", desc: "Une sélection de mes travaux académiques et personnels" },
    EN: { title: "Completed Projects", desc: "A selection of my academic and personal work" }
  };
  const text = t[lang] || t.FR;

  useEffect(() => {
    const handleOpen = (e) => {
      const proj = projectsData.find(p => p.id === e.detail);
      if (proj) setSelectedProject(proj);
    };
    window.addEventListener('openProjectModal', handleOpen);
    return () => window.removeEventListener('openProjectModal', handleOpen);
  }, []);

  return (
    <div id="projects" className="animate-fade-in">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">{text.title}</h2>
        <p className="text-slate-400">{text.desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectsData.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            lang={lang}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          lang={lang}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
