import React from 'react';
import { motion } from 'framer-motion';

export default function BlurRevealHeading({
  text,
  tag = 'h2',
  className = '',
  byWord = false,
  delay = 0,
}) {
  const Tag = tag;
  const items = byWord ? text.split(' ') : text.split('');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: byWord ? 0.08 : 0.025,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Tag className={`overflow-hidden inline-flex flex-wrap ${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="inline-flex flex-wrap"
      >
        {items.map((item, idx) => (
          <motion.span
            key={idx}
            variants={itemVariants}
            className="inline-block"
            style={{ whiteSpace: item === ' ' ? 'pre' : 'normal' }}
          >
            {item === ' ' ? '\u00A0' : item}
            {byWord && idx < items.length - 1 ? '\u00A0' : ''}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

