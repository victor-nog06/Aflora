import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Benefits } from './components/Benefits';
import { MenuSection } from './components/MenuSection';
import { ProductModal } from './components/ProductModal';
import { About } from './components/About';
import { InfoSection } from './components/InfoSection';
import { Footer } from './components/Footer';
import { BotanicalBackground } from './components/BotanicalBackground';
import type { Product } from './types/menu';

export function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleScrollToMenu = () => {
    const element = document.getElementById('cardapio');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-aflora-bg text-aflora-text font-sans antialiased overflow-x-hidden">
      {/* Subtle Botanical SVG Silhouettes in Background */}
      <BotanicalBackground />

      {/* Fixed Sticky Header */}
      <Header onNavigateMenu={handleScrollToMenu} />

      {/* Main Content Areas */}
      <main className="relative z-10">
        {/* 1. Hero / Main Section */}
        <Hero onExploreClick={handleScrollToMenu} />

        {/* 2. Brand Benefits Cards */}
        <Benefits />

        {/* 3. Digital Menu Showcase Section */}
        <MenuSection onSelectProduct={(product) => setSelectedProduct(product)} />

        {/* 4. About Brand Story */}
        <About />

        {/* 5. Store Information */}
        <InfoSection />
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* Product Detail Bottom Sheet / Modal */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </div>
  );
}

export default App;
