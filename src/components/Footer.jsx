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
            <span className="text-sm font-bold uppercase tracking-wider text-[#6f6f6f]">
              Vamos conversar?
            </span>
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
            {/* /Redes Sociais */}
            <div className="flex flex-col space-y-4">
              <span className="text-[16px] font-semibold text-[#0f0e0e] tracking-tight">
                /Redes
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

            {/* /Navegação */}
            <div className="flex flex-col space-y-4">
              <span className="text-[16px] font-semibold text-[#0f0e0e] tracking-tight">
                /Navegação
              </span>
              <ul className="flex flex-col space-y-2.5">
                {[
                  { name: 'Início', path: '/' },
                  { name: 'Projetos', path: '/project' },
                  { name: 'Sobre', path: '/about' },
                  { name: 'Serviços', path: '/#services' },
                  { name: 'Contato', path: '/contact' },
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

        {/* Wordmark in Footer */}
        <div className="pt-12 sm:pt-16 pb-8">
          <Wordmark color="black" text="MAGNO" />
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/10 text-xs sm:text-sm font-semibold text-[#6f6f6f]">
          <p>© {new Date().getFullYear()} Magno. Todos os direitos reservados. Criação de Sites & Social Media.</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="hover:text-black transition-colors flex items-center space-x-1"
          >
            <span>Voltar ao topo</span>
            <span>↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
