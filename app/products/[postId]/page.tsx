'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { Post, Product } from '@/types/feed';
import Image from 'next/image';

interface CartItem {
  product: Product;
  quantity: number;
}

export default function ProductsPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch('/api/feed');
        const data = await response.json();
        const foundPost = data.posts.find((p: Post) => p.id === params.postId);
        setPost(foundPost || null);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.postId]);

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          
          <h1 className="flex-1 text-center text-lg font-semibold text-gray-900 mx-4 truncate">
            {post.promotionalText}
          </h1>
          
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Search size={24} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {post.relatedProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Discount Badge */}
              <div className="relative">
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-pink-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {product.discount}
                  </div>
                </div>
                
                {/* Wishlist Heart */}
                <div className="absolute top-2 right-2 z-10">
                  <button className="p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <svg className="w-5 h-5 text-gray-400 hover:text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {/* Product Image */}
                <div className="aspect-square bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                  {product.description}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    AED {product.salePrice.toFixed(0)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    AED {product.originalPrice.toFixed(0)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className={`
                    w-full py-2 px-4 rounded-full text-sm font-semibold transition-colors flex items-center justify-center gap-2
                    ${product.inStock 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {product.inStock ? 'Add' : 'Out of Stock'}
                </button>

                {/* Yalla Badge */}
                <div className="mt-2">
                  <div className="inline-block bg-yellow-400 text-black text-xs px-2 py-1 rounded font-semibold">
                    Yalla
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Button (Fixed Bottom) */}
      {totalCartItems > 0 && (
        <div className="fixed bottom-4 left-4 right-4">
          <button className="w-full bg-pink-600 text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 shadow-lg">
            <ShoppingCart size={20} />
            <span>View cart</span>
            <span className="bg-white/20 px-2 py-1 rounded-full text-sm">
              {totalCartItems} item{totalCartItems !== 1 ? 's' : ''}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
