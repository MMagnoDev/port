import React from 'react';
import { motion } from 'framer-motion';
import BlurRevealHeading from '../components/BlurRevealHeading';
import ContactCTA from '../components/ContactCTA';
import { siteData } from '../data/siteData';

export default function ProjectsPage({ onNavigate }) {
  const handleProjectClick = (slug, e) => {
    e.preventDefault();
    onNavigate(`/project/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#000000] text-white pt-28 sm:pt-36">
      <div className="max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Page Title */}
        <div className="pb-8 border-b border-white/20">
          <BlurRevealHeading
            text="Projects"
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em]"
          />
        </div>

        {/* 2x2 Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-9 gap-y-16 pt-12 sm:pt-20">
          {siteData.projects.map((project, index) => (
            <motion.a
              key={project.id}
              href={`/project/${project.slug}`}
              onClick={(e) => handleProjectClick(project.slug, e)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group block cursor-pointer"
            >
              <div className="relative aspect-[4/3] sm:aspect-[1.15/1] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#111111]">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        </div>
      </div>

      <ContactCTA onNavigate={onNavigate} />
    </div>
  );
}

