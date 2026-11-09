import React from 'react';
import { motion } from 'framer-motion';
import BlurRevealHeading from '../components/BlurRevealHeading';
import ContactCTA from '../components/ContactCTA';
import { siteData } from '../data/siteData';

export default function ProjectDetailPage({ slug, onNavigate }) {
  const project = siteData.projects.find((p) => p.slug === slug) || siteData.projects[0];

  const handleNextProject = (nextSlug, e) => {
    e.preventDefault();
    onNavigate(`/project/${nextSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#000000] text-white pt-28 sm:pt-36">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Project Title */}
        <div className="pb-12 border-b border-white/20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <BlurRevealHeading
            text={project.name}
            className="text-5xl sm:text-7xl lg:text-9xl font-bold tracking-[-0.04em]"
          />
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-full bg-white text-black font-bold text-sm sm:text-base tracking-tight hover:bg-white/90 hover:scale-105 active:scale-95 transition-all self-start md:self-auto shadow-lg"
            >
              <span>Ver Site Online</span>
              <span>↗</span>
            </a>
          )}
        </div>

        {/* Project Metadata Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-10 border-b border-white/20">
          <div>
            <span className="block text-sm sm:text-base text-white/50 font-semibold mb-1">
              Cliente
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {project.client}
            </span>
          </div>

          <div>
            <span className="block text-sm sm:text-base text-white/50 font-semibold mb-1">
              Ano
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {project.year}
            </span>
          </div>

          <div className="col-span-2 md:col-span-1">
            <span className="block text-sm sm:text-base text-white/50 font-semibold mb-1">
              Entregáveis
            </span>
            <span className="text-xl sm:text-2xl font-bold text-white">
              {project.categories}
            </span>
          </div>
        </div>

        {/* Main Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="my-12 sm:my-20 w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#0d0d0d] flex items-center justify-center"
        >
          <img
            src={project.image}
            alt={project.name}
            className={`w-full ${
              project.type === 'social'
                ? 'max-h-[850px] object-contain'
                : 'max-h-[900px] object-cover object-top'
            }`}
          />
        </motion.div>

        {/* Problem, Solution, Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 py-12 sm:py-20 border-b border-white/20">
          {/* Desafio */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
              Desafio
            </h3>
            <p className="text-base sm:text-lg font-semibold text-white/70 leading-relaxed">
              {project.problem}
            </p>
          </div>

          {/* Solução */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
              Solução
            </h3>
            <p className="text-base sm:text-lg font-semibold text-white/70 leading-relaxed">
              {project.solution}
            </p>
          </div>

          {/* Resultados */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
              Resultados
            </h3>
            <p className="text-base sm:text-lg font-semibold text-white/70 leading-relaxed">
              {project.results}
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="py-16 sm:py-24">
          <h3 className="text-3xl sm:text-4xl font-bold mb-10 tracking-tight">
            Galeria do Projeto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {project.gallery.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="w-full aspect-[4/3] rounded-[24px] overflow-hidden bg-[#0d0d0d] flex items-center justify-center"
              >
                <img
                  src={img}
                  alt={`${project.name} detalhe ${idx + 1}`}
                  className={`w-full h-full ${
                    img.includes('instagram') ? 'object-contain' : 'object-cover object-top'
                  } hover:scale-105 transition-transform duration-700`}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Next Project Block */}
        <div className="pt-16 pb-24 border-t border-white/20">
          <span className="text-sm sm:text-base font-semibold text-white/50 uppercase tracking-widest block mb-4">
            Próximo Projeto
          </span>
          <a
            href={`/project/${project.nextProjectSlug}`}
            onClick={(e) => handleNextProject(project.nextProjectSlug, e)}
            className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-8 cursor-pointer"
          >
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white group-hover:text-white/80 transition-colors">
              {project.nextProjectName}
            </h2>

            <div className="w-full md:w-80 h-48 rounded-[20px] overflow-hidden bg-[#111111]">
              <img
                src={project.nextProjectImage}
                alt={project.nextProjectName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </a>
        </div>
      </div>

      <ContactCTA onNavigate={onNavigate} />
    </div>
  );
}
