import React from 'react';
import { motion } from 'framer-motion';
import BlurRevealHeading from '../components/BlurRevealHeading';
import Wordmark from '../components/Wordmark';
import ContactCTA from '../components/ContactCTA';
import StackSection from '../components/StackSection';
import ScrollWordHighlight from '../components/ScrollWordHighlight';
import AnimatedCounter from '../components/AnimatedCounter';
import { siteData } from '../data/siteData';

export default function HomePage({ onNavigate }) {
  const handleProjectClick = (slug, e) => {
    e.preventDefault();
    onNavigate(`/project/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#000000] text-white">
      {/* =========================================================================
          HERO SECTION (Sticky Top 0 - Initial screen)
      ========================================================================= */}
      <StackSection isHero={true} zIndex={10}>
        <div className="relative w-full h-full flex flex-col justify-between pt-24 sm:pt-32 pb-8 px-6 sm:px-10 lg:px-14 overflow-hidden">
          {/* Background image & red atmospheric glow */}
          <div
            className="absolute inset-0 bg-cover bg-top pointer-events-none opacity-90 transition-transform duration-1000 scale-100"
            style={{
              backgroundImage: "url('/assets/images/home/hero__YW8HSxOagJ9n2ox0OjdrR3EBp8.png')",
            }}
          />
          {/* Top gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#b8040f]/40 via-black/40 to-black pointer-events-none" />

          {/* Hero Top Content */}
          <div className="relative z-10 max-w-[1800px] w-full mx-auto flex flex-col lg:flex-row justify-between items-start gap-8 pt-4">
            {/* Top-Left Category Tags */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col space-y-1.5"
            >
              <span className="text-[17px] sm:text-[20px] font-bold tracking-[-0.03em] uppercase text-white">
                ART DIRECTION
              </span>
              <span className="text-[17px] sm:text-[20px] font-bold tracking-[-0.03em] uppercase text-white">
                BRAND DESIGN
              </span>
              <span className="text-[17px] sm:text-[20px] font-bold tracking-[-0.03em] uppercase text-white">
                WEB DESIGN
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
                BUILDING DISTINCTIVE VISUAL EXPERIENCES THAT HELP BRANDS STAND OUT AND CONNECT.
              </p>
            </motion.div>
          </div>

          {/* Hero Giant Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[1800px] mx-auto pt-12 sm:pt-20 select-none"
          >
            <Wordmark color="white" />
          </motion.div>
        </div>
      </StackSection>

      {/* =========================================================================
          WORK SECTION (Overlaps Hero)
      ========================================================================= */}
      <StackSection zIndex={20} id="work" className="pt-20 sm:pt-28 pb-20 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
            <BlurRevealHeading
              text="Work"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
              (Selected Project)
            </span>
          </div>

          {/* Projects Grid 2x2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-9 gap-y-16 pt-12 sm:pt-16">
            {siteData.projects.map((project, index) => (
              <motion.a
                key={project.id}
                href={`/project/${project.slug}`}
                onClick={(e) => handleProjectClick(project.slug, e)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group block cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] sm:aspect-[1.15/1] w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#111111]">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          </div>

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
              <span>View all</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>
            </a>
          </div>
        </div>
      </StackSection>

      {/* =========================================================================
          ABOUT SECTION (Overlaps Work)
      ========================================================================= */}
      <StackSection zIndex={30} id="about" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
            <BlurRevealHeading
              text="About"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
              (Who am I)
            </span>
          </div>

          {/* About Statement Heading */}
          <div className="pt-12 sm:pt-16 pb-12 sm:pb-20 max-w-5xl">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-[1.15] text-white/95">
              A digital design studio focused on creating refined brand identities and seamless web experiences.
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
                  alt="Waheedi Gabriel portrait"
                  className="w-full h-full object-cover grayscale contrast-110 hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            {/* Column 2: Paragraph 1 + Read more */}
            <div className="md:col-span-7 lg:col-span-4 flex flex-col justify-between space-y-8">
              <p className="text-lg sm:text-xl lg:text-[20px] font-semibold text-white/70 leading-[1.5] tracking-tight">
                Waheedi Gabriel is an independent designer specializing in brand identity and digital design. With over a decade of experience, he has collaborated with global brands like Framer, Nike, Google, and Amazon to build memorable, impactful identities.
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
                  Read more •
                </a>
              </div>
            </div>

            {/* Column 3: Paragraph 2 */}
            <div className="md:col-span-12 lg:col-span-4">
              <p className="text-lg sm:text-xl lg:text-[20px] font-semibold text-white/70 leading-[1.5] tracking-tight">
                His work spans art direction, web design, and visual storytelling, always guided by a desire to craft thoughtful, timeless solutions that resonate with audiences and push creative boundaries.
              </p>
            </div>
          </div>
        </div>
      </StackSection>

      {/* =========================================================================
          SERVICE SECTION (Overlaps About)
      ========================================================================= */}
      <StackSection zIndex={40} id="services" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
            <BlurRevealHeading
              text="Service"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
              (What I do)
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
                className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-12 items-center group cursor-default"
              >
                {/* Numeral */}
                <div className="md:col-span-2 text-6xl sm:text-8xl lg:text-[110px] font-semibold text-white/30 tracking-tighter leading-none group-hover:text-white transition-colors duration-300">
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
      </StackSection>

      {/* =========================================================================
          BRANDS SECTION (Overlaps Service)
      ========================================================================= */}
      <StackSection zIndex={50} id="brands" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
            <BlurRevealHeading
              text="Brands"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
              (Past Clients)
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
                className="aspect-square rounded-[24px] sm:rounded-[28px] bg-[#b3b3b3] flex items-center justify-center p-8 hover:brightness-105 transition-all duration-300 group"
              >
                <img
                  src={b.logo}
                  alt={b.alt}
                  className="max-h-12 sm:max-h-14 max-w-[70%] object-contain filter brightness-90 group-hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </StackSection>

      {/* =========================================================================
          PROCESS SECTION (Overlaps Brands)
      ========================================================================= */}
      <StackSection zIndex={60} id="process" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
            <BlurRevealHeading
              text="Process"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
              (What I do)
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
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
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
      </StackSection>

      {/* =========================================================================
          REVIEWS SECTION (Overlaps Process)
      ========================================================================= */}
      <StackSection zIndex={70} id="reviews" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
            <BlurRevealHeading
              text="Reviews"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
              (Testimonials)
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
      </StackSection>

      {/* =========================================================================
          STATS SECTION (Overlaps Reviews)
      ========================================================================= */}
      <StackSection zIndex={80} id="stats" className="py-20 sm:py-28 px-6 sm:px-10 lg:px-14">
        <div className="max-w-[1800px] mx-auto">
          {/* Section Header */}
          <div className="flex items-baseline justify-between pb-6 border-b border-white/20">
            <BlurRevealHeading
              text="Stats"
              className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.04em]"
            />
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-white/70 tracking-tight">
              (Facts)
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
      </StackSection>

      {/* =========================================================================
          CONTACT CTA (Overlaps Stats)
      ========================================================================= */}
      <StackSection zIndex={90} shadow={true} borderTop={true} rounded={true} className="py-12">
        <ContactCTA onNavigate={onNavigate} />
      </StackSection>
    </div>
  );
}
