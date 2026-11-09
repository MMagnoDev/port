import React from 'react';
import Wordmark from './Wordmark';
import { siteData } from '../data/siteData';

export default function Footer({ onNavigate }) {
  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNav = (path, e) => {
    e.preventDefault();
    if (path.startsWith('/#')) {
      const id = path.replace('/#', '');
      const scrollToElement = () => {
        const el = document.getElementById(id);
        if (!el) return;
        if (window.__lenis) {
          window.__lenis.scrollTo(el, { duration: 1.2, offset: -20 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };

      onNavigate('/');
      setTimeout(scrollToElement, 150);
      return;
    }
    onNavigate(path);
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative z-[100] w-full bg-white text-black pt-16 sm:pt-24 pb-12 px-6 sm:px-10 lg:px-14 overflow-hidden rounded-t-[32px] sm:rounded-t-[44px] shadow-[0_-30px_70px_rgba(0,0,0,0.5)] border-t border-black/10">
      <div className="max-w-[1800px] mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 pb-16 lg:pb-24 border-b border-black/10">
          {/* Contact Details */}
          <div className="flex flex-col space-y-3">
            <a
              href={`mailto:${siteData.meta.email}`}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.03em] hover:text-[#6f6f6f] transition-colors"
            >
              {siteData.meta.email}
            </a>
            <a
              href={`tel:${siteData.meta.phone.replace(/[^0-9+]/g, '')}`}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[-0.03em] hover:text-[#6f6f6f] transition-colors"
            >
              {siteData.meta.phone}
            </a>
          </div>

          {/* Links Columns */}
          <div className="flex gap-16 sm:gap-24">
            {/* /Social */}
            <div className="flex flex-col space-y-4">
              <span className="text-[16px] font-semibold text-[#0f0e0e] tracking-tight">
                /Social
              </span>
              <ul className="flex flex-col space-y-2.5">
                {siteData.meta.socials.map((s) => (
                  <li key={s.name}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[15px] sm:text-[16px] text-[#6f6f6f] hover:text-black font-semibold transition-colors"
                    >
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* /Nav */}
            <div className="flex flex-col space-y-4">
              <span className="text-[16px] font-semibold text-[#0f0e0e] tracking-tight">
                /Nav
              </span>
              <ul className="flex flex-col space-y-2.5">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Work', path: '/project' },
                  { name: 'Studio', path: '/about' },
                  { name: 'Services', path: '/#services' },
                  { name: 'Contact', path: '/contact' },
                ].map((n) => (
                  <li key={n.name}>
                    <a
                      href={n.path}
                      onClick={(e) => handleNav(n.path, e)}
                      className="text-[15px] sm:text-[16px] text-[#6f6f6f] hover:text-black font-semibold transition-colors"
                    >
                      {n.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Huge Wordmark in pure black */}
        <div className="py-8 sm:py-14 select-none">
          <Wordmark color="black" />
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-[15px] sm:text-[16px] font-semibold">
          {/* Author info */}
          <div className="flex items-center space-x-3 text-black/70">
            <span className="text-black/50">Designed by</span>
            <img
              src={siteData.meta.authorAvatar}
              alt={siteData.meta.author}
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
            <a
              href="https://www.framer.com/@akinbinu-akintayo/?tab=templates"
              target="_blank"
              rel="noreferrer"
              className="text-black hover:opacity-75 transition-opacity"
            >
              {siteData.meta.author}
            </a>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            type="button"
            className="flex items-center space-x-1.5 text-black hover:opacity-70 transition-opacity cursor-pointer group"
          >
            <span>Back to top</span>
            <span className="inline-block transition-transform duration-200 group-hover:-translate-y-1">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}

