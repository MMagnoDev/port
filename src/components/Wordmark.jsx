import React from 'react';

export default function Wordmark({ color = 'white', className = '' }) {
  const isWhite = color === 'white';

  return (
    <div className={`w-full overflow-hidden select-none pointer-events-none ${className}`}>
      <div
        className={`w-full text-center font-bold tracking-[-0.035em] leading-[0.8] uppercase font-switzer transition-colors duration-300 ${
          isWhite ? 'text-white' : 'text-black'
        }`}
        style={{
          fontSize: 'clamp(4.5rem, 19.5vw, 24rem)',
        }}
      >
        GRID©
      </div>
    </div>
  );
}

