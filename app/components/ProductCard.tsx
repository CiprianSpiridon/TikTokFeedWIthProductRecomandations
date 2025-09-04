'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types/feed';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onProductClick: (productId: string) => void;
}

export default function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    await onAddToCart(product.id);
    setIsLoading(false);
  };

  const handleProductClick = () => {
    onProductClick(product.id);
  };


  return (
    <div 
      className="flex-shrink-0 w-20 min-w-[80px] bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={handleProductClick}
    >
      <div className="relative">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            width={80}
            height={80}
            className="w-full h-16 object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-16 bg-gray-700 flex items-center justify-center">
            <div className="text-gray-400 text-xs text-center">
              <div className="w-5 h-5 mx-auto mb-1 bg-gray-600 rounded-md flex items-center justify-center text-xs">
                📦
              </div>
              <span className="text-[8px]">Product</span>
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-0.5 left-0.5 bg-pink-600 text-white text-[8px] px-1 py-0.5 rounded font-semibold">
          {product.discount}
        </div>
      </div>
      
      <div className="p-1">
        {/* Product Name */}
        <h3 className="text-white text-[8px] font-medium mb-0.5 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mb-1">
          <div className="flex items-center space-x-0.5">
            <span className="text-white font-bold text-[8px]">
              ${product.salePrice.toFixed(0)}
            </span>
            <span className="text-gray-500 text-[7px] line-through">
              ${product.originalPrice.toFixed(0)}
            </span>
          </div>
        </div>
        
        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className={`
            w-full py-0.5 px-1 rounded text-[7px] font-semibold transition-colors
            ${product.inStock && !isLoading
              ? 'bg-transparent border border-gray-600 text-white hover:bg-pink-600 hover:border-pink-600'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? '...' : product.inStock ? 'ADD' : 'N/A'}
        </button>
      </div>
    </div>
  );
}
