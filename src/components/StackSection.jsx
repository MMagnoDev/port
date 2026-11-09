import React, { useRef, useState, useEffect } from 'react';

export default function StackSection({
  children,
  zIndex = 10,
  className = '',
  id,
  isHero = false,
  shadow = true,
  borderTop = true,
  rounded = true,
}) {
  const sectionRef = useRef(null);
  const [stickyTop, setStickyTop] = useState(0);

  useEffect(() => {
    if (isHero) return;

    const updateStickyTop = () => {
      if (!sectionRef.current) return;
      const height = sectionRef.current.offsetHeight;
      const vh = window.innerHeight;
      // If section is taller than viewport, stick when bottom reaches bottom of screen
      // If section is shorter or equal to viewport, stick at top: 0
      const offset = Math.min(0, vh - height);
      setStickyTop(offset);
    };

    updateStickyTop();

    const resizeObserver = new ResizeObserver(() => {
      updateStickyTop();
    });

    if (sectionRef.current) {
      resizeObserver.observe(sectionRef.current);
    }
    window.addEventListener('resize', updateStickyTop, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStickyTop);
    };
  }, [isHero]);

  if (isHero) {
    return (
      <section
        id={id}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
        className={`w-full h-screen min-h-screen overflow-hidden ${className}`}
      >
        {children}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={id}
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex,
        boxShadow: shadow ? '0 -30px 70px rgba(0, 0, 0, 0.95)' : 'none',
        borderTop: borderTop ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
        borderRadius: rounded ? '36px 36px 0 0' : '0',
      }}
      className={`w-full bg-[#000000] will-change-transform ${className}`}
    >
      {children}
    </section>
  );
}
