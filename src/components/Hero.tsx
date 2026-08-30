import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { HibiscusLogo } from './HibiscusLogo';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute smooth vertical float & fade exit animation as user scrolls
  const logoOpacity = Math.max(0, 1 - scrollOffset / 180);
  const logoY = -Math.min(60, scrollOffset * 0.35);

  return (
    <section id="top" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Brand Title Display with scroll float & fade animation */}
            <motion.div 
              style={{
                opacity: logoOpacity,
                transform: `translateY(${logoY}px)`
              }}
              className="mb-4 transition-transform duration-75 ease-out"
            >
              <HibiscusLogo size="lg" showSubtitle={true} showIcon={true} textColor="text-aflora-primary" />
            </motion.div>

            {/* Slogan */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-aflora-primary font-bold tracking-wide uppercase mt-2 mb-4">
              Mais que sabor, um estilo de vida.
            </h1>

            {/* Intro Text */}
            <p className="font-sans text-base sm:text-lg text-aflora-muted max-w-xl leading-relaxed mb-8">
              Sabores frescos, ingredientes naturais selecionados e preparações artesanais pensadas para nutrir o seu corpo e fazer o seu dia florescer.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-aflora-primary hover:bg-aflora-primaryDark text-white font-display text-base sm:text-lg uppercase tracking-wider px-8 py-4 rounded-full shadow-elevated hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Explorar Cardápio</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>

            {/* Highlights Tag */}
            <div className="mt-8 flex items-center gap-6 text-xs font-sans text-aflora-muted">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-aflora-yellow" />
                Ingredientes 100% Naturais
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-aflora-primary" />
                Feito na Hora
              </span>
            </div>
          </motion.div>

          {/* Right Image Feature Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center relative"
          >
            {/* Product Image Frame */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-elevated border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=1000&q=85" 
                alt="AFLORA Smoothie Margarida"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              
              {/* Floating Badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-aflora-border shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-aflora-primaryLight flex items-center justify-center shrink-0 text-aflora-primary font-display font-bold text-lg">
                  ★
                </div>
                <div>
                  <p className="font-display text-sm font-semibold uppercase text-aflora-text">Margarida &bull; Smoothie Proteico</p>
                  <p className="font-sans text-xs text-aflora-muted">Morango, banana, iogurte natural, tâmara e 20 g de proteína</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
