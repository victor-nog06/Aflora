import React from 'react';
import { BENEFITS } from '../data/menuData';
import { Leaf, Heart, Sparkles, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const Benefits: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-6 h-6 stroke-[1.5]" />;
      case 'Heart':
        return <Heart className="w-6 h-6 stroke-[1.5]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 stroke-[1.5]" />;
      case 'Sun':
        return <Sun className="w-6 h-6 stroke-[1.5]" />;
      default:
        return <Leaf className="w-6 h-6 stroke-[1.5]" />;
    }
  };

  return (
    <section className="py-12 bg-aflora-cardWarm/60 border-y border-aflora-border/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 border border-aflora-border/70 shadow-soft flex items-start gap-4 hover:border-aflora-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-aflora-primaryLight text-aflora-primary flex items-center justify-center shrink-0 group-hover:bg-aflora-primary group-hover:text-white transition-colors duration-300">
                {getIcon(benefit.icon)}
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-aflora-primary uppercase tracking-wide">
                  {benefit.title}
                </h3>
                <p className="font-sans text-xs text-aflora-muted mt-1 leading-relaxed">
                  {benefit.subtitle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
