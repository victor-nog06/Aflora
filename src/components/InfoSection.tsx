import React from 'react';
import { ESTABLISHMENT } from '../data/menuData';
import { MapPin, Clock, Phone, Wifi, Store, ShieldCheck, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

export const InfoSection: React.FC = () => {
  return (
    <section id="info" className="py-16 bg-aflora-bg border-t border-aflora-border relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-3xl sm:text-4xl text-aflora-primary font-bold tracking-wide uppercase">
            Informações & Atendimento
          </h2>
          <p className="font-sans text-sm text-aflora-muted mt-2">
            Venha nos visitar! Estamos prontos para receber você em nosso espaço.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Endereço */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-aflora-border shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-aflora-primaryLight text-aflora-primary flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-aflora-text uppercase tracking-wide mb-1">
                Endereço
              </h3>
              <p className="font-sans text-sm text-aflora-muted leading-relaxed">
                {ESTABLISHMENT.address}
                <br />
                {ESTABLISHMENT.neighborhood} &bull; {ESTABLISHMENT.city}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-aflora-border/50 text-xs font-sans text-aflora-primary font-medium flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Ambiente climatizado e pet-friendly</span>
            </div>
          </motion.div>

          {/* Card 2: Horários */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-aflora-border shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-aflora-primaryLight text-aflora-primary flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-aflora-text uppercase tracking-wide mb-1">
                Horário de Funcionamento
              </h3>
              <ul className="font-sans text-sm text-aflora-muted space-y-1 mt-2">
                <li>{ESTABLISHMENT.hoursWeekdays}</li>
                <li>{ESTABLISHMENT.hoursWeekend}</li>
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t border-aflora-border/50 text-xs font-sans text-aflora-primary font-medium flex items-center gap-1">
              <Store className="w-4 h-4" />
              <span>Aberto hoje para você</span>
            </div>
          </motion.div>

          {/* Card 3: Redes & Wi-Fi */}
          <motion.div 
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl p-6 border border-aflora-border shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-aflora-primaryLight text-aflora-primary flex items-center justify-center mb-4">
                <Wifi className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-aflora-text uppercase tracking-wide mb-1">
                Wi-Fi & Contato
              </h3>
              <div className="font-sans text-sm text-aflora-muted space-y-2 mt-2">
                <p className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-aflora-primary" />
                  <span>Wi-Fi Grátis: <strong>{ESTABLISHMENT.wifi}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-aflora-primary" />
                  <a href={`https://instagram.com/${ESTABLISHMENT.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="hover:underline text-aflora-text font-medium">
                    {ESTABLISHMENT.instagram}
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-aflora-primary" />
                  <span>WhatsApp: {ESTABLISHMENT.whatsapp}</span>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-aflora-border/50 text-xs font-sans text-aflora-muted">
              * Pedidos e pagamentos são feitos exclusivamente no balcão.
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
