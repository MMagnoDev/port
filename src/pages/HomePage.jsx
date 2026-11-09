import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import BlurRevealHeading from '../components/BlurRevealHeading';
import Wordmark from '../components/Wordmark';
import ContactCTA from '../components/ContactCTA';
import StackSection from '../components/StackSection';
import ScrollWordHighlight from '../components/ScrollWordHighlight';
import AnimatedCounter from '../components/AnimatedCounter';
import { siteData } from '../data/siteData';

export default function HomePage({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const { scrollY } = useScroll();

  // Efeito Parallax suave no Hero ao rolar a página
  const heroImageY = useTransform(scrollY, [0, 800], [0, 160]);
  const heroImageScale = useTransform(scrollY, [0, 800], [1, 1.05]);

  const heroTextY = useTransform(scrollY, [0, 700], [0, -60]);
  const heroTextOpacity = useTransform(scrollY, [0, 600], [1, 0.5]);

  const heroWordmarkY = useTransform(scrollY, [0, 700], [0, -80]);
  const heroWordmarkOpacity = useTransform(scrollY, [0, 600], [1, 0.7]);

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
    <div className="w-full bg-[#000000] text-white">
      {/* =========================================================================
          HERO SECTION (Sticky Top 0 - Initial screen)
      ========================================================================= */}
      <StackSection isHero={true} zIndex={10}>
        <div className="relative w-full h-full flex flex-col justify-between pt-24 sm:pt-32 pb-8 px-6 sm:px-10 lg:px-14 overflow-hidden">
          {/* Background image & red atmospheric glow com Parallax */}
          <motion.div
            style={{
              backgroundImage: "url('/assets/images/home/hero__YW8HSxOagJ9n2ox0OjdrR3EBp8.png')",
              y: heroImageY,
              scale: heroImageScale,
            }}
            className="absolute inset-0 bg-cover bg-top pointer-events-none opacity-100 will-change-transform"
          />

          {/* Hero Top Content com Parallax */}
          <motion.div
            style={{ y: heroTextY, opacity: heroTextOpacity }}
            className="relative z-10 max-w-[1800px] w-full mx-auto flex flex-col lg:flex-row justify-between items-start gap-8 pt-4 will-change-transform"
          >
            {/* Top-Left Category Tags */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col space-y-1.5"
            >
              <span className="text-[17px] sm:text-[20px] font-bold tracking-[-0.03em] uppercase text-white">
                CRIAÇÃO DE SITES
              </span>
              <span className="text-[17px] sm:text-[20px] font-bold tracking-[-0.03em] uppercase text-white">
                SOCIAL MEDIA
              </span>
              <span className="text-[17px] sm:text-[20px] font-bold tracking-[-0.03em] uppercase text-white">
                ESTRATÉGIA DIGITAL
              </span>
            </motion.div>

            {/* Top-Right Mission Statement */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="max-w-md lg:text-right"
            >
              <p className="text-[18px] sm:text-[21px] font-bold tracking-[-0.03em] uppercase leading-tight text-white/95">
                CONSTRUINDO EXPERIÊNCIAS DIGITAIS ÚNICAS QUE DESTACAM A SUA MARCA E CONECTAM PESSOAS.
              </p>
            </motion.div>
          </motion.div>

          {/* Hero Giant Wordmark com Parallax */}
          <motion.div
            style={{ y: heroWordmarkY, opacity: heroWordmarkOpacity }}
            className="relative z-10 w-full max-w-[1800px] mx-auto pt-12 sm:pt-20 select-none will-change-transform"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Wordmark color="white" text="MAGNO" />
            </motion.div>
          </motion.div>
        </div>
      </StackSection>

      {/* =========================================================================
          CONTENT WRAPPER (Único bloco contínuo que cobre o Hero)
      ========================================================================= */}
      <div className="relative z-20 w-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] lg:w-[calc(100%-3.5rem)] mx-auto bg-[#000000] border-t border-white/15">
        {/* =====================================================================
            1. WORK SECTION
        ===================================================================== */}
        <section id="work" className="pt-20 sm:pt-28 pb-20 px-6 sm:px-10 lg:px-14">
          <div className="max-w-[1800px] mx-auto">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-white/20 gap-4">
              <div className="flex items-baseline space-x-4">
                <BlurRevealHeading
                  text="Trabalhos"
                  className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
                />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
                  (Projetos Selecionados)
                </span>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'web', label: 'Sites' },
                  { id: 'social', label: 'Social Media' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveFilter(f.id)}
                    className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
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

            {/* Projects Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-9 gap-y-16 pt-12 sm:pt-16">
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
                    {/* Image Container */}
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

                    {/* Card Meta */}
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

            {/* View All Projects Link */}
            <div className="pt-16 sm:pt-20 flex justify-end">
              <a
                href="/project"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/project');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group inline-flex items-center space-x-2 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.03em] text-white hover:text-white/70 transition-colors"
              >
                <span>Ver todos</span>
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. ABOUT SECTION
        ===================================================================== */}
        <section id="about" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-white/20">
          <div className="max-w-[1800px] mx-auto">
            {/* Section Header */}
            <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
              <BlurRevealHeading
                text="Sobre"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
              />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
                (Quem sou eu)
              </span>
            </div>

            {/* About Statement Heading */}
            <div className="pt-12 sm:pt-16 pb-12 sm:pb-20 max-w-5xl">
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.15] text-white/95">
                Especialista em criação de sites modernos e estratégias de social media focadas em gerar resultados reais.
              </h3>
            </div>

            {/* 3-Column Layout: Portrait + Par 1 + Par 2 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
              {/* Column 1: Portrait */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="md:col-span-5 lg:col-span-4"
              >
                <div className="w-full aspect-[3/4] rounded-[24px] overflow-hidden bg-[#111111]">
                  <img
                    src="/assets/images/studio/about-portrait__4hsBNFGSbvNOMV3kSyJST82O8.png"
                    alt="Magno"
                    className="w-full h-full object-cover grayscale contrast-110"
                  />
                </div>
              </motion.div>

              {/* Column 2: Paragraph 1 + Read more */}
              <div className="md:col-span-7 lg:col-span-4 flex flex-col justify-between space-y-8">
                <p className="text-lg sm:text-xl lg:text-[20px] font-semibold text-white/70 leading-[1.5] tracking-tight">
                  Magno é especialista em desenvolvimento de websites de alta conversão e gestão de redes sociais. Desenvolve presenças digitais completas que unem estética impecável, velocidade e posicionamento estratégico.
                </p>
                <div>
                  <a
                    href="/about"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('/about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-block text-[18px] font-bold text-white underline decoration-white/40 underline-offset-8 hover:decoration-white transition-colors"
                  >
                    Conheça mais •
                  </a>
                </div>
              </div>

              {/* Column 3: Paragraph 2 */}
              <div className="md:col-span-12 lg:col-span-4">
                <p className="text-lg sm:text-xl lg:text-[20px] font-semibold text-white/70 leading-[1.5] tracking-tight">
                  Seu trabalho abrange criação de landing pages, sites institucionais, identidade visual digital e planejamento de conteúdo para redes sociais, sempre com o foco em conectar marcas a clientes e impulsionar vendas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            3. SERVICE SECTION
        ===================================================================== */}
        <section id="services" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-white/20">
          <div className="max-w-[1800px] mx-auto">
            {/* Section Header */}
            <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
              <BlurRevealHeading
                text="Serviços"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
              />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
                (O que eu faço)
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/20">
              {siteData.services.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-center cursor-default"
                >
                  {/* Numeral */}
                  <div className="md:col-span-2 text-6xl sm:text-8xl lg:text-[110px] font-semibold text-white/30 tracking-tighter leading-none">
                    {item.number}
                  </div>

                  {/* Title */}
                  <div className="md:col-span-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] text-white">
                    {item.title}
                  </div>

                  {/* Description */}
                  <div className="md:col-span-5 text-base sm:text-lg font-semibold text-white/70 leading-relaxed">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. BRANDS SECTION
        ===================================================================== */}
        <section id="brands" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-white/20">
          <div className="max-w-[1800px] mx-auto">
            {/* Section Header */}
            <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
              <BlurRevealHeading
                text="Marcas"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
              />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
                (Clientes & Parceiros)
              </span>
            </div>

            {/* 3x2 Grid of Rounded Tiles (#b3b3b3) */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-12 sm:pt-16">
              {siteData.brands.map((b, i) => (
                <motion.div
                  key={b.id + '-' + i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="aspect-square rounded-[24px] sm:rounded-[28px] bg-[#b3b3b3] flex items-center justify-center p-8"
                >
                  <img
                    src={b.logo}
                    alt={b.alt}
                    className="max-h-12 sm:max-h-14 max-w-[70%] object-contain filter brightness-90"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. PROCESS SECTION
        ===================================================================== */}
        <section id="process" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-white/20">
          <div className="max-w-[1800px] mx-auto">
            {/* Section Header */}
            <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
              <BlurRevealHeading
                text="Processo"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
              />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
                (Como trabalho)
              </span>
            </div>

            {/* Process Rows */}
            <div className="divide-y divide-white/20">
              {siteData.process.map((step, idx) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  {/* 01 Number */}
                  <div className="lg:col-span-2 text-5xl sm:text-7xl font-bold tracking-[-0.04em] text-white">
                    {step.number}
                  </div>

                  {/* Landscape Image */}
                  <div className="lg:col-span-5 w-full h-[220px] sm:h-[280px] rounded-[24px] overflow-hidden bg-[#111111]">
                    <img
                      src={step.image}
                      alt={step.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title & Description */}
                  <div className="lg:col-span-5 flex flex-col justify-end space-y-3">
                    <h3 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg font-semibold text-white/70 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. REVIEWS SECTION
        ===================================================================== */}
        <section id="reviews" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-white/20">
          <div className="max-w-[1800px] mx-auto">
            {/* Section Header */}
            <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
              <BlurRevealHeading
                text="Depoimentos"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
              />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
                (O que dizem)
              </span>
            </div>

            {/* Testimonial Quote with scroll-linked word-by-word reveal */}
            <div className="pt-16 sm:pt-24 max-w-5xl mx-auto flex flex-col space-y-12 sm:space-y-16">
              <ScrollWordHighlight
                text={siteData.review.quote}
                className="text-3xl sm:text-5xl lg:text-6xl text-white"
              />

              {/* Author Card */}
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] overflow-hidden bg-[#111111]">
                  <img
                    src={siteData.review.avatar}
                    alt={siteData.review.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {siteData.review.author}
                  </span>
                  <span className="text-base sm:text-lg font-semibold text-white/60">
                    {siteData.review.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            7. STATS SECTION
        ===================================================================== */}
        <section id="stats" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14 border-t border-white/20">
          <div className="max-w-[1800px] mx-auto">
            {/* Section Header */}
            <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
              <BlurRevealHeading
                text="Resultados"
                className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
              />
              <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
                (Métricas Reais)
              </span>
            </div>

            {/* 4 Stats Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-16 sm:pt-20">
              {siteData.stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex flex-col space-y-4"
                >
                  <AnimatedCounter
                    value={stat.value}
                    className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white"
                  />
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {stat.label}
                  </div>
                  <p className="text-base font-semibold text-white/70 leading-relaxed">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            8. CONTACT CTA
        ===================================================================== */}
        <div className="py-12 border-t border-white/20">
          <ContactCTA onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}
