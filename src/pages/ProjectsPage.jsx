import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurRevealHeading from '../components/BlurRevealHeading';
import ContactCTA from '../components/ContactCTA';
import { siteData } from '../data/siteData';

export default function ProjectsPage({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleProjectClick = (slug, e) => {
    e.preventDefault();
    onNavigate(`/project/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProjects = siteData.projects.filter((project) => {
    if (activeFilter === 'web') return project.type === 'web';
    if (activeFilter === 'social') return project.type === 'social';
    return true;
  });

  return (
    <div className="w-full bg-[#000000] text-white pt-28 sm:pt-36">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Page Title & Filter Buttons */}
        <div className="pb-8 border-b border-white/20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <BlurRevealHeading
            text="Projetos"
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em]"
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'web', label: 'Criação de Sites' },
              { id: 'social', label: 'Social Media' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-5 py-2 rounded-full text-sm sm:text-base font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2x2 Grid of Projects */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-9 gap-y-16 pt-12 sm:pt-20">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.a
                key={project.id}
                layout
                href={`/project/${project.slug}`}
                onClick={(e) => handleProjectClick(project.slug, e)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group block cursor-pointer"
              >
                <div
                  className={`relative w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#0d0d0d] flex items-center justify-center ${
                    project.type === 'social'
                      ? 'aspect-[3/4] sm:aspect-[4/5]'
                      : 'aspect-[4/3]'
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className={`w-full h-full ${
                      project.type === 'social' ? 'object-contain' : 'object-cover object-top'
                    } transition-transform duration-700 ease-out group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                <div className="flex items-center justify-between pt-5 sm:pt-6">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white group-hover:text-white/80 transition-colors">
                    {project.name}
                  </h3>
                  <span className="text-sm sm:text-base font-semibold text-white/60 tracking-tight">
                    {project.categories}
                  </span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ContactCTA onNavigate={onNavigate} />
    </div>
  );
}
