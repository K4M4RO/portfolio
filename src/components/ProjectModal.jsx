import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, CheckCircle2, ImageOff } from "lucide-react";

const GithubIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function ProjectModal({ project, onClose, lang = "FR" }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgIndex(0);
    setImgError(false);
  }, [project]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!project) return null;

  const images = project.images || [];
  const hasImages = images.length > 0 && !imgError;

  const prevSlide = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextSlide = () => setImgIndex((i) => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6 md:p-8">
          <h2 className="text-3xl font-bold text-white mb-2">{project.title[lang] || project.title.FR || project.title}</h2>
          <p className="text-blue-400 mb-4">{project.subtitle[lang] || project.subtitle.FR || project.subtitle}</p>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 mb-6 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all border border-slate-700 hover:border-slate-500 shadow-sm"
            >
              <GithubIcon className="w-5 h-5" />
              <span className="font-medium">{lang === "EN" ? "View Source on GitHub" : "Voir le code source sur GitHub"}</span>
            </a>
          )}

          {/* Image slider */}
          <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 mb-6 group">
            {hasImages ? (
              <>
                <img
                  src={images[imgIndex]}
                  alt={project.title[lang] || project.title.FR || project.title}
                  className="w-full h-full object-contain bg-slate-950"
                  onError={() => setImgError(true)}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-blue-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-blue-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    {/* Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIndex(i)}
                          className={`h-2 rounded-full transition-all ${i === imgIndex ? "w-4 bg-blue-500" : "w-2 bg-white/50"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 flex-col gap-2">
                <ImageOff className="w-12 h-12" />
                <span className="text-sm">{lang === "EN" ? "Image not available" : "Image non disponible"}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-300 text-lg leading-relaxed mb-6">{project.fullDesc[lang] || project.fullDesc.FR || project.fullDesc}</p>

          {/* Key points */}
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 mb-6">
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-blue-500 w-5 h-5" />
              {lang === "EN" ? "Key Points & Achievements" : "Points Clés & Réalisations"}
            </h4>
            <ul className="space-y-2">
              {(project.points[lang] || project.points.FR || project.points).map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <span className="text-blue-400 font-bold mt-0.5 flex-shrink-0">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm rounded-full bg-slate-800 text-blue-300 border border-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
