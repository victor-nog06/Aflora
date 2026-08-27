import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="sobre" className="py-20 bg-aflora-cardWarm/70 border-t border-aflora-border relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=85" 
                alt="Ambiente acolhedor AFLORA"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white font-sans text-xs sm:text-sm">
                <span className="bg-aflora-primary font-display font-semibold uppercase tracking-wider text-[11px] px-3 py-1 rounded-full text-white inline-block mb-2">
                  Nosso Espaço
                </span>
                <p className="font-medium text-white/90">Um ambiente pensado para você desacelerar e renovar suas energias.</p>
              </div>
            </div>
          </motion.div>

          {/* Text Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-1.5 text-aflora-primary text-xs font-sans font-semibold uppercase tracking-widest bg-aflora-primaryLight px-3 py-1 rounded-full w-fit mb-3">
              <Heart className="w-3.5 h-3.5" />
              Nossa Essência
            </div>

            <h2 className="font-display text-3xl sm:text-4xl text-aflora-primary font-bold tracking-wide uppercase mb-6">
              Sobre a AFLORA
            </h2>

            <blockquote className="font-sans text-base sm:text-lg text-aflora-text leading-relaxed font-normal mb-6 italic border-l-4 border-aflora-primary pl-4">
              "A AFLORA nasceu para transformar pequenas pausas em momentos de cuidado. Sabores frescos, combinações especiais e ingredientes escolhidos para nutrir o corpo, acolher a mente e fazer o seu dia florescer."
            </blockquote>

            <p className="font-sans text-sm text-aflora-muted leading-relaxed mb-6">
              Acreditamos que se alimentar bem é um ato de carinho com você mesmo. Por isso, preparamos cada smoothie, refresher e prato com ingredientes selecionados, sem corantes ou conservantes artificiais, garantindo leveza e energia limpa do primeiro ao último gole.
            </p>

            <div className="flex items-center gap-4 text-xs font-sans font-semibold text-aflora-primary uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-aflora-yellow" />
                Feito na Hora
              </span>
              <span>&bull;</span>
              <span>100% Natural</span>
              <span>&bull;</span>
              <span>Com Propósito</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
