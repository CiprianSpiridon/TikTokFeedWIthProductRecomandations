'use client';

import { ChevronRight } from 'lucide-react';
import { Product } from '@/types/feed';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  promotionalText: string;
  products: Product[];
  category: string;
  onAddToCart: (productId: string) => void;
  onProductClick: (productId: string) => void;
  onViewAll: () => void;
}

export default function ProductSection({ 
  promotionalText, 
  products, 
  category, 
  onAddToCart, 
  onProductClick, 
  onViewAll 
}: ProductSectionProps) {
  return (
    <div className="px-4 pt-4 pb-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-lg font-semibold max-w-[70%]">
          {promotionalText}
        </h2>
        <button 
          onClick={onViewAll}
          className="flex items-center text-gray-300 hover:text-white transition-colors"
        >
          <span className="text-sm mr-1">View all</span>
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Products Horizontal Scroll - Show 4 products */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
}
