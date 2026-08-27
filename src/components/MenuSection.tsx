import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../data/menuData';
import type { CategoryId, Product } from '../types/menu';
import { ProductCard } from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface MenuSectionProps {
  onSelectProduct: (product: Product) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectProduct }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'todos'>('todos');

  const filteredProducts = activeCategory === 'todos' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.categoryId === activeCategory);

  return (
    <section id="cardapio" className="py-16 bg-aflora-bg relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-display text-3xl sm:text-4xl text-aflora-primary font-bold tracking-wide uppercase">
            Cardápio AFLORA
          </h2>
          <p className="font-sans text-sm text-aflora-muted mt-2">
            Explore nossas bebidas, bowls e alimentos frescos. Todos os pedidos são preparados na hora e realizados presencialmente no balcão.
          </p>
        </div>

        {/* STICKY Horizontal Category Bar */}
        <div className="sticky top-16 z-40 bg-aflora-bg/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-aflora-border/60 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 sm:justify-center">
            {/* "Todos" Option */}
            <button
              onClick={() => setActiveCategory('todos')}
              className={`shrink-0 font-display text-xs sm:text-sm uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 ${
                activeCategory === 'todos'
                  ? 'bg-aflora-primary text-white shadow-md font-semibold'
                  : 'bg-white text-aflora-muted hover:bg-aflora-cardWarm hover:text-aflora-text border border-aflora-border'
              }`}
            >
              Todos
            </button>

            {/* Category Buttons */}
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 font-display text-xs sm:text-sm uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-aflora-primary text-white shadow-md font-semibold'
                      : 'bg-white text-aflora-muted hover:bg-aflora-cardWarm hover:text-aflora-text border border-aflora-border'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Category Notice / Subtitle if single category is selected */}
        {activeCategory !== 'todos' && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-aflora-cardWarm rounded-2xl border border-aflora-border/70 flex items-center gap-3 text-xs sm:text-sm font-sans text-aflora-text"
          >
            <Info className="w-5 h-5 text-aflora-primary shrink-0" />
            <div>
              <span className="font-bold text-aflora-primary uppercase font-display mr-1">
                {CATEGORIES.find(c => c.id === activeCategory)?.name}:
              </span>
              <span>{CATEGORIES.find(c => c.id === activeCategory)?.subtitle}</span>
              {CATEGORIES.find(c => c.id === activeCategory)?.note && (
                <p className="text-aflora-primary font-medium mt-0.5">
                  &bull; {CATEGORIES.find(c => c.id === activeCategory)?.note}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Product Grid Grouped or Filtered */}
        {activeCategory === 'todos' ? (
          // Grouped by Category when 'todos' is active
          <div className="space-y-14">
            {CATEGORIES.map((cat) => {
              const catProducts = PRODUCTS.filter(p => p.categoryId === cat.id);
              if (catProducts.length === 0) return null;

              return (
                <div key={cat.id} className="scroll-mt-32">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-aflora-primary/20 pb-3 mb-6">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-aflora-primary uppercase tracking-wide">
                        {cat.name}
                      </h3>
                      <p className="font-sans text-xs text-aflora-muted mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>

                    {cat.note && (
                      <span className="font-sans text-xs font-semibold text-aflora-primary bg-aflora-primaryLight px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                        {cat.note}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onSelect={onSelectProduct}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Single Category Filtered View
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </section>
  );
};
