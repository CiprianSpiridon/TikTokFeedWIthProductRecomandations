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
      className="flex-shrink-0 w-[calc(25vw-12px)] min-w-[80px] max-w-[100px] bg-gray-900 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
      onClick={handleProductClick}
    >
      <div className="relative">
        {!imageError ? (
          <Image
            src={product.image}
            alt={product.name}
            width={100}
            height={100}
            className="w-full h-20 object-cover"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className="w-full h-20 bg-gray-700 flex items-center justify-center">
            <div className="text-gray-400 text-xs text-center">
              <div className="w-6 h-6 mx-auto mb-1 bg-gray-600 rounded-md flex items-center justify-center text-sm">
                📦
              </div>
              <span className="text-xs">Product</span>
            </div>
          </div>
        )}
        
        {/* Discount Badge */}
        <div className="absolute top-1 left-1 bg-pink-600 text-white text-xs px-1.5 py-0.5 rounded font-semibold">
          {product.discount}
        </div>
      </div>
      
      <div className="p-1.5">
        {/* Product Name */}
        <h3 className="text-white text-[10px] font-medium mb-1 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        
        {/* Price Section */}
        <div className="mb-1">
          <div className="flex items-center space-x-1">
            <span className="text-white font-bold text-[10px]">
              ${product.salePrice.toFixed(2)}
            </span>
            <span className="text-gray-500 text-[9px] line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
        </div>
        
        {/* Add Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className={`
            w-full py-1 px-1.5 rounded text-[9px] font-semibold transition-colors
            ${product.inStock && !isLoading
              ? 'bg-transparent border border-gray-600 text-white hover:bg-pink-600 hover:border-pink-600'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Adding...' : product.inStock ? 'ADD' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
