import React, { useState, useEffect } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';
import { HibiscusLogo } from './HibiscusLogo';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNavigateMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      setIsScrolled(scrollPos > 20);
      // Hero section threshold: when user scrolls past ~210px
      setIsPastHero(scrollPos > 210);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 70;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
      }
    }, 150);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        /* On mobile: header container slides down only when past hero */
        !isPastHero ? 'max-md:-translate-y-full max-md:opacity-0 max-md:pointer-events-none' : 'max-md:translate-y-0 max-md:opacity-100 max-md:pointer-events-auto'
      } ${
        isScrolled 
          ? 'glass-nav py-2.5 shadow-sm border-b border-aflora-border/50' 
          : 'bg-aflora-bg/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Top-Left Header Brand Name - Docks seamlessly when AFLORA slides from Hero */}
        <motion.a 
          href="#top" 
          onClick={(e) => { e.preventDefault(); scrollToSection('top'); }}
          className="flex items-center gap-2 group"
          aria-label="AFLORA Página Inicial"
          initial={false}
          animate={{
            opacity: isPastHero ? 1 : 0,
            scale: isPastHero ? 1 : 0.9,
          }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <HibiscusLogo 
            showIcon={false} 
            size={isScrolled ? 'sm' : 'md'} 
            showSubtitle={!isScrolled} 
            hideSubtitleOnMobile={true} 
          />
        </motion.a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans font-medium text-sm text-aflora-text">
          <button 
            onClick={() => scrollToSection('top')}
            className="hover:text-aflora-primary transition-colors py-1 relative group"
          >
            Início
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-aflora-primary transition-all duration-300 group-hover:w-full" />
          </button>
          
          <button 
            onClick={() => { scrollToSection('cardapio'); onNavigateMenu(); }}
            className="hover:text-aflora-primary transition-colors py-1 relative group"
          >
            Cardápio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-aflora-primary transition-all duration-300 group-hover:w-full" />
          </button>

          <button 
            onClick={() => scrollToSection('sobre')}
            className="hover:text-aflora-primary transition-colors py-1 relative group"
          >
            Sobre
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-aflora-primary transition-all duration-300 group-hover:w-full" />
          </button>
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={() => { scrollToSection('cardapio'); onNavigateMenu(); }}
            className="inline-flex items-center gap-2 bg-aflora-primary hover:bg-aflora-primaryDark text-white font-display text-sm uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95"
          >
            <UtensilsCrossed className="w-4 h-4" />
            Ver cardápio
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-aflora-primary hover:bg-aflora-primaryLight transition-colors"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-nav border-b border-aflora-border overflow-hidden px-4 py-6"
          >
            <div className="flex flex-col gap-4 items-center text-center font-sans font-medium text-base">
              <button 
                onClick={() => scrollToSection('top')}
                className="w-full py-2 hover:text-aflora-primary transition-colors text-aflora-text"
              >
                Início
              </button>

              <button 
                onClick={() => { scrollToSection('cardapio'); onNavigateMenu(); }}
                className="w-full py-2 hover:text-aflora-primary transition-colors text-aflora-text"
              >
                Cardápio
              </button>

              <button 
                onClick={() => scrollToSection('sobre')}
                className="w-full py-2 hover:text-aflora-primary transition-colors text-aflora-text"
              >
                Sobre
              </button>

              <button 
                onClick={() => scrollToSection('info')}
                className="w-full py-2 hover:text-aflora-primary transition-colors text-aflora-text"
              >
                Informações
              </button>

              <button 
                onClick={() => { scrollToSection('cardapio'); onNavigateMenu(); }}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-aflora-primary text-white font-display text-base uppercase tracking-wider px-6 py-3 rounded-full shadow-md"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Explorar Cardápio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
