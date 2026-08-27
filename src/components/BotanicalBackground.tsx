import React from 'react';

export const BotanicalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
      {/* Top Left Leaf Silhouette */}
      <svg 
        className="absolute -top-12 -left-16 w-72 h-72 md:w-96 md:h-96 text-aflora-primary/10"
        viewBox="0 0 200 200" 
        fill="currentColor"
      >
        <path d="M40,10 C90,20 140,60 150,110 C160,160 120,190 70,180 C20,170 -10,120 0,70 C10,20 25,5 40,10 Z M60,40 C80,45 110,75 105,100 C100,125 75,130 55,120 C35,110 30,85 35,65 Z" />
      </svg>

      {/* Top Right Leaf Silhouette */}
      <svg 
        className="absolute top-10 -right-20 w-80 h-80 md:w-[28rem] md:h-[28rem] text-aflora-primary/10 rotate-45"
        viewBox="0 0 200 200" 
        fill="currentColor"
      >
        <path d="M100,10 C150,30 180,80 170,130 C160,180 110,190 60,170 C10,150 0,90 20,40 C40,-10 80,0 100,10 Z" />
      </svg>

      {/* Bottom Floating Hibiscus Accents */}
      <svg 
        className="absolute bottom-20 -left-10 w-64 h-64 text-aflora-primary/5 -rotate-12"
        viewBox="0 0 100 100" 
        fill="currentColor"
      >
        <circle cx="50" cy="50" r="40"/>
      </svg>
    </div>
  );
};
