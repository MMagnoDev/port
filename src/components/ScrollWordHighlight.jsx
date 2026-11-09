import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const color = useTransform(progress, range, ['rgba(255, 255, 255, 0.25)', 'rgb(255, 255, 255)']);

  return (
    <span className="relative inline-block mr-[0.25em] last:mr-0">
      <motion.span style={{ opacity, color }}>
        {children}
      </motion.span>
    </span>
  );
}

export default function ScrollWordHighlight({ text, className = '' }) {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.45'],
  });

  const words = text.split(' ');

  return (
    <blockquote
      ref={containerRef}
      className={`relative font-bold tracking-[-0.03em] leading-[1.2] select-none ${className}`}
    >
      “
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {word}
          </Word>
        );
      })}
      ”
    </blockquote>
  );
}

