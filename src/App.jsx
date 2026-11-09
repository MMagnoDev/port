import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { siteData } from './data/siteData';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPath]);

  // Update dynamic page title
  useEffect(() => {
    if (currentPath.startsWith('/project/')) {
      const slug = currentPath.replace('/project/', '');
      const project = siteData.projects.find((p) => p.slug === slug);
      document.title = project ? `${project.name} — Magno` : 'Projetos — Magno';
    } else if (currentPath === '/project') {
      document.title = 'Projetos — Magno';
    } else if (currentPath === '/about') {
      document.title = 'Sobre — Magno';
    } else if (currentPath === '/contact') {
      document.title = 'Contato — Magno';
    } else {
      document.title = 'Magno — Criação de Sites & Social Media';
    }
  }, [currentPath]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Route matching
  const renderPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigateTo} />;
    }
    if (currentPath === '/project') {
      return <ProjectsPage onNavigate={navigateTo} />;
    }
    if (currentPath.startsWith('/project/')) {
      const slug = currentPath.replace('/project/', '');
      return <ProjectDetailPage slug={slug} onNavigate={navigateTo} />;
    }
    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigateTo} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigateTo} />;
    }
    // Fallback to Home
    return <HomePage onNavigate={navigateTo} />;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <Header currentPath={currentPath} onNavigate={navigateTo} />
      <main className="flex-1 w-full">{renderPage()}</main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

