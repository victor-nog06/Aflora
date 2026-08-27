import React from 'react';
import type { Product } from '../types/menu';
import { motion } from 'framer-motion';
import { Info, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl border border-aflora-border/80 p-4 shadow-soft hover:shadow-elevated hover:border-aflora-primary/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3.5 bg-aflora-bg">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Optional Badge Tag */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-aflora-primary text-white font-display text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            <Sparkles className="w-3 h-3 text-aflora-yellow" />
            {product.badge}
          </span>
        )}

        {/* Tap Info Hint Icon Overlay */}
        <div className="absolute bottom-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 text-aflora-primary flex items-center justify-center shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all">
          <Info className="w-4 h-4" />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-display text-lg font-bold text-aflora-text group-hover:text-aflora-primary transition-colors uppercase tracking-wide">
              {product.name}
            </h3>
            {product.price && (
              <span className="font-display text-base font-bold text-aflora-primary whitespace-nowrap">
                {product.price}
              </span>
            )}
          </div>

          <p className="font-sans text-xs text-aflora-muted line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Main Ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="pt-2 border-t border-aflora-border/50 text-[11px] font-sans text-aflora-muted/90">
            <span className="font-semibold text-aflora-text">Ingredientes: </span>
            <span>{product.ingredients.join(', ')}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
