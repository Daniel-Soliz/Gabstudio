import React from 'react';

/**
 * Elegant fine-line decorative SVGs: vintage flourishes, eyelash silhouettes, and dividers.
 */
export const LashIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg 
    viewBox="0 0 48 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    {/* Upper eyelid arc */}
    <path d="M4 18C14 8 34 8 44 18" />
    {/* Eyelash hairs */}
    <path d="M10 13C8 8 6 5 4 4" />
    <path d="M16 11C15 6 13 3 11 1" />
    <path d="M22 10C22 5 21 2 20 0" />
    <path d="M28 10C29 5 31 2 33 0" />
    <path d="M34 11C36 6 38 3 41 2" />
    <path d="M40 14C42 10 45 7 47 5" />
  </svg>
);

export const VintageFlourish: React.FC<{ className?: string }> = ({ className = 'w-32 h-6' }) => (
  <svg 
    viewBox="0 0 160 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.2" 
    strokeLinecap="round" 
    className={className}
    aria-hidden="true"
  >
    <path d="M20 12H65" opacity="0.6" />
    <path d="M95 12H140" opacity="0.6" />
    <circle cx="80" cy="12" r="3" fill="currentColor" />
    <path d="M72 12C74 8 78 8 80 12C82 16 86 16 88 12" />
    <circle cx="15" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
    <circle cx="145" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
  </svg>
);

export const CornerOrnament: React.FC<{ position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; className?: string }> = ({
  position = 'top-left',
  className = 'w-8 h-8',
}) => {
  const rotation = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      className={`${className} ${rotation} pointer-events-none opacity-40`}
      aria-hidden="true"
    >
      <path d="M4 28V6C6 6 10 6 16 6" />
      <path d="M28 4H6C6 6 6 10 6 16" />
      <circle cx="6" cy="6" r="2" fill="currentColor" />
    </svg>
  );
};


export const EyeLogo: React.FC<{ className?: string }> = ({ className = 'w-16 h-10' }) => (
  <svg
    viewBox="0 0 72 46"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M11 24C20 15 31 12 41 14C50 15 57 19 62 24C57 29 50 33 41 34C31 35 20 32 11 24Z" />
    <path d="M16 23C23 18 31 17 39 18C47 19 53 21 58 24" />
    <circle cx="38" cy="24" r="7" />
    <circle cx="38" cy="24" r="2.5" fill="currentColor" stroke="none" />
    <path d="M15 17L9 13" />
    <path d="M21 13L18 7" />
    <path d="M29 11L28 4" />
    <path d="M47 12L50 6" />
    <path d="M55 16L61 11" />
    <path d="M10 31L5 35" />
    <path d="M58 31L64 35" />
    <path d="M4 9L4.7 11.3L7 12L4.7 12.7L4 15L3.3 12.7L1 12L3.3 11.3L4 9Z" fill="currentColor" stroke="none" />
    <path d="M66 4L66.6 6L69 6.6L66.6 7.2L66 9.5L65.4 7.2L63 6.6L65.4 6L66 4Z" fill="currentColor" stroke="none" />
  </svg>
);
