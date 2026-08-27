import React from 'react';
import { HibiscusLogo } from './HibiscusLogo';
import { ESTABLISHMENT } from '../data/menuData';
import { Phone, Heart, Camera } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-aflora-primary text-white pt-16 pb-8 border-t-4 border-aflora-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/20">
          
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs mb-3 inline-block">
              <HibiscusLogo
                size="md"
                showSubtitle={true}
                textColor="text-white"
                iconColor="text-white"
                subtitleColor="text-white/85"
              />
            </div>
            <p className="font-display text-lg uppercase tracking-wider text-aflora-yellow font-bold mt-2">
              {ESTABLISHMENT.slogan}
            </p>
            <p className="font-sans text-xs text-white/80 max-w-sm mt-2 leading-relaxed">
              Cardápio digital informativo. Venha conhecer nosso espaço e faça seu pedido diretamente no balcão.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-aflora-yellow mb-4">
              Navegação
            </h4>
            <ul className="font-sans text-xs space-y-2.5 text-white/90">
              <li>
                <a href="#top" className="hover:text-aflora-yellow transition-colors">Início</a>
              </li>
              <li>
                <a href="#cardapio" className="hover:text-aflora-yellow transition-colors">Cardápio Digital</a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-aflora-yellow transition-colors">Sobre a AFLORA</a>
              </li>
              <li>
                <a href="#info" className="hover:text-aflora-yellow transition-colors">Informações da Loja</a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-display text-sm font-bold uppercase tracking-widest text-aflora-yellow mb-4">
              Siga a AFLORA
            </h4>
            <div className="font-sans text-xs space-y-2 text-white/90 mb-4">
              <p>{ESTABLISHMENT.address}</p>
              <p>{ESTABLISHMENT.hoursWeekdays}</p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={`https://instagram.com/${ESTABLISHMENT.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram AFLORA"
              >
                <Camera className="w-5 h-5" />
              </a>
              <a 
                href={`https://wa.me/${ESTABLISHMENT.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp AFLORA"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-center text-[11px] font-sans text-white/70 gap-3">
          <p>© {currentYear} AFLORA. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido com <Heart className="w-3 h-3 text-aflora-yellow fill-aflora-yellow" /> para AFLORA
          </p>
        </div>

      </div>
    </footer>
  );
};
