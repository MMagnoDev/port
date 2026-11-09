import React from 'react';
import { motion } from 'framer-motion';

export default function ContactCTA({ onNavigate }) {
  const handleContact = (e) => {
    e.preventDefault();
    onNavigate('/contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full px-6 sm:px-10 lg:px-14 py-16 sm:py-24">
      <div className="max-w-[1800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-[460px] sm:h-[600px] lg:h-[720px] rounded-[24px] sm:rounded-[32px] overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-12 shadow-2xl"
        >
          {/* Background Image with glow / warm red overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105 hover:scale-100"
            style={{
              backgroundImage: "url('/assets/images/contact/cta-portrait__DkyFLmBYvs0vQpa51WP8ZjGf67c.png')",
              filter: 'brightness(0.9) contrast(1.1)',
            }}
          />
          {/* Subtle gradient vignette to boost readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-8 sm:space-y-10">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] text-white leading-[1.05] drop-shadow-md">
              Let's build something<br />great together
            </h2>

            <a
              href="/contact"
              onClick={handleContact}
              className="px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-black text-base sm:text-lg font-bold rounded-full hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg"
            >
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

