import React, { useEffect } from 'react';
import type { Product } from '../types/menu';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Store, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal / Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col border border-aflora-border"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors"
              aria-label="Fechar detalhes"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image Header */}
            <div className="relative w-full aspect-[16/10] bg-aflora-bg overflow-hidden shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 bg-aflora-primary text-white font-display text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-aflora-yellow" />
                  {product.badge}
                </span>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-aflora-text uppercase tracking-wide">
                    {product.name}
                  </h2>
                  <p className="font-sans text-xs text-aflora-muted mt-0.5">
                    Categoria selecionada no cardápio AFLORA
                  </p>
                </div>
                {product.price && (
                  <span className="font-display text-xl font-bold text-aflora-primary whitespace-nowrap bg-aflora-primaryLight px-3 py-1 rounded-xl">
                    {product.price}
                  </span>
                )}
              </div>

              <p className="font-sans text-sm text-aflora-muted leading-relaxed">
                {product.description}
              </p>

              {/* Ingredients List */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="bg-aflora-bg p-4 rounded-2xl border border-aflora-border/60">
                  <h4 className="font-display text-xs font-bold text-aflora-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Ingredientes Principais
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans text-aflora-text">
                    {product.ingredients.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-aflora-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Category Note if present */}
              {product.note && (
                <p className="font-sans text-xs italic text-aflora-muted bg-aflora-cardWarm p-3 rounded-xl border border-aflora-border/50">
                  * {product.note}
                </p>
              )}

              {/* Counter Order Badge Banner */}
              <div className="mt-4 bg-aflora-primary text-white p-4 rounded-2xl flex items-center gap-3 shadow-md">
                <Store className="w-6 h-6 shrink-0 text-aflora-yellow" />
                <div className="text-xs font-sans">
                  <p className="font-bold font-display uppercase tracking-wider text-sm">Pedido no Balcão</p>
                  <p className="text-white/90">Faça o seu pedido e o pagamento diretamente com a nossa equipe no balcão.</p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-aflora-bg border-t border-aflora-border flex justify-end">
              <button
                onClick={onClose}
                className="w-full sm:w-auto bg-aflora-text hover:bg-black text-white font-display text-sm uppercase tracking-wider px-6 py-2.5 rounded-full transition-colors"
              >
                Voltar ao Cardápio
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
