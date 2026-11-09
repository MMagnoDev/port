import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ currentPath, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path, e) => {
    if (e) e.preventDefault();
    setMenuOpen(false);

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

      if (window.location.pathname !== '/' && currentPath !== '/') {
        onNavigate('/');
        setTimeout(scrollToElement, 150);
      } else {
        scrollToElement();
      }
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
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 px-6 sm:px-10 lg:px-14 py-4 sm:py-5 ${
          scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => handleNav('/', e)}
            className="text-[26px] sm:text-[30px] font-bold tracking-[-0.04em] text-white hover:opacity-80 transition-opacity"
          >
            Grid®
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 absolute left-1/2 -translate-x-1/2">
            {[
              { name: 'Work', path: '/project' },
              { name: 'Studio', path: '/about' },
              { name: 'Services', path: '/#services' },
              { name: 'Process', path: '/#process' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={(e) => handleNav(item.path, e)}
                className={`text-[16px] font-semibold tracking-[-0.02em] transition-colors duration-200 ${
                  currentPath === item.path
                    ? 'text-white'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Action (Contact) & Mobile Trigger */}
          <div className="flex items-center space-x-4">
            <a
              href="/contact"
              onClick={(e) => handleNav('/contact', e)}
              className="hidden md:inline-block text-[16px] font-semibold tracking-[-0.02em] text-white/90 hover:text-white transition-colors"
            >
              Contact
            </a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[16px] font-semibold tracking-tight text-white px-3 py-1.5 rounded-full border border-white/20 hover:border-white transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[998] bg-black pt-24 px-6 flex flex-col justify-between pb-12 md:hidden"
          >
            <div className="flex flex-col space-y-6">
              {[
                { name: 'Home', path: '/' },
                { name: 'Work', path: '/project' },
                { name: 'Studio', path: '/about' },
                { name: 'Services', path: '/#services' },
                { name: 'Process', path: '/#process' },
                { name: 'Contact', path: '/contact' },
              ].map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.path}
                  onClick={(e) => handleNav(item.path, e)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 + 0.1, duration: 0.3 }}
                  className={`text-4xl font-bold tracking-tight ${
                    currentPath === item.path ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col space-y-4">
              <span className="text-sm text-white/40 uppercase tracking-widest font-semibold">
                Socials
              </span>
              <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                <a href="https://x.com/47thegreat_" target="_blank" rel="noreferrer" className="hover:text-white">
                  X (Twitter)
                </a>
                <a href="https://www.linkedin.com/in/akinbinuakintayo/" target="_blank" rel="noreferrer" className="hover:text-white">
                  Linkedin
                </a>
                <a href="https://www.instagram.com/47thegreat" target="_blank" rel="noreferrer" className="hover:text-white">
                  Instagram
                </a>
                <a href="https://www.behance.net/creative47" target="_blank" rel="noreferrer" className="hover:text-white">
                  Behance
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

