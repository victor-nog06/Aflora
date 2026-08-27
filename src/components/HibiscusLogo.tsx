import React from 'react';

interface HibiscusLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showIcon?: boolean;
  textColor?: string;
  iconColor?: string;
  subtitleColor?: string;
  hideSubtitleOnMobile?: boolean;
}

export const HibiscusLogo: React.FC<HibiscusLogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true,
  showIcon = true,
  textColor = 'text-aflora-primary',
  iconColor = 'text-aflora-primary',
  subtitleColor = 'text-aflora-muted',
  hideSubtitleOnMobile = false
}) => {
  const sizeClasses = {
    sm: { icon: 'w-6 h-6', title: 'text-2xl tracking-wider', sub: 'text-[9px] tracking-[0.2em]' },
    md: { icon: 'w-9 h-9', title: 'text-4xl tracking-widest', sub: 'text-[11px] tracking-[0.25em]' },
    lg: { icon: 'w-14 h-14', title: 'text-6xl tracking-[0.15em]', sub: 'text-sm tracking-[0.3em]' },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      {/* Hibiscus Flower Icon */}
      {showIcon && (
        <div className={`${sizeClasses.icon} ${iconColor} mb-1 transition-transform duration-300 hover:scale-105`}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g transform="translate(50, 48)">
              {/* Petals */}
              <path d="M 0 0 C -22 -38 -14 -44 0 -46 C 14 -44 22 -38 0 0 Z" fill="currentColor"/>
              <path d="M 0 0 C 28 -28 38 -16 38 2 C 34 20 20 22 0 0 Z" fill="#B5305E"/>
              <path d="M 0 0 C 32 16 34 32 20 40 C 2 42 -8 30 0 0 Z" fill="currentColor"/>
              <path d="M 0 0 C -32 16 -34 32 -20 40 C -2 42 8 30 0 0 Z" fill="#9C2147"/>
              <path d="M 0 0 C -28 -28 -38 -16 -38 2 C -34 20 -20 22 0 0 Z" fill="currentColor"/>
              {/* Stamen */}
              <path d="M 0 0 Q 10 -24 20 -34" stroke="#F3C649" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="20" cy="-34" r="3.5" fill="#F3C649"/>
              <circle cx="16" cy="-30" r="2.5" fill="#F3C649"/>
              <circle cx="22" cy="-28" r="2.5" fill="#F3C649"/>
              <circle cx="0" cy="0" r="5" fill="#751534"/>
            </g>
          </svg>
        </div>
      )}

      {/* Brand Text Header */}
      <span className={`font-display font-extrabold ${textColor} uppercase leading-none ${sizeClasses.title}`}>
        AFLORA
      </span>

      {/* Subtitle */}
      {showSubtitle && (
        <span className={`font-sans font-medium ${subtitleColor} uppercase mt-1 ${sizeClasses.sub} ${hideSubtitleOnMobile ? 'hidden md:block' : ''}`}>
          AÇAÍ &bull; SMOOTHIES &bull; FRESH FOOD
        </span>
      )}
    </div>
  );
};
