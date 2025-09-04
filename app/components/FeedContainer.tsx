'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { Post, FeedResponse } from '@/types/feed';
import PostCard from './PostCard';

export default function FeedContainer() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch feed data
  const fetchFeedData = useCallback(async (page: number = 1, reset: boolean = false) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/feed?page=${page}&limit=5`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feed data');
      }
      
      const data: FeedResponse = await response.json();
      
      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setHasMore(data.hasMore);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching feed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more posts when reaching the end
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchFeedData(currentPage + 1);
    }
  }, [loading, hasMore, currentPage, fetchFeedData]);

  // Initialize feed
  useEffect(() => {
    fetchFeedData(1, true);
  }, [fetchFeedData]);

  // Set up intersection observer for active post tracking and infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0');
          
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setActivePostIndex(index);
          }
          
          // Load more when near the end
          if (entry.isIntersecting && index === posts.length - 2) {
            loadMore();
          }
        });
      },
      {
        threshold: [0.5, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    );

    // Observe all post elements
    const postElements = containerRef.current?.querySelectorAll('.post-card');
    postElements?.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [posts.length, loadMore]);

  // Handle post actions

  const handleAddToCart = async (productId: string) => {
    try {
      await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: 'add_to_cart' }),
      });
      
      console.log('Added to cart:', productId);
      // Could show a toast notification here
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  const handleProductClick = async (productId: string) => {
    try {
      await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, action: 'view_product' }),
      });
      
      console.log('Product clicked:', productId);
      // Navigate to product page
    } catch (err) {
      console.error('Error tracking product click:', err);
    }
  };

  const handleViewAll = async (category: string) => {
    try {
      await fetch('/api/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, action: 'view_all' }),
      });
      
      console.log('View all clicked for category:', category);
      // Navigate to category page
    } catch (err) {
      console.error('Error tracking view all:', err);
    }
  };

  const handleClose = () => {
    console.log('Close feed');
    // Handle close action
  };

  const handleSearch = () => {
    console.log('Open search');
    // Handle search action
  };

  // Refresh feed
  const handleRefresh = () => {
    fetchFeedData(1, true);
  };

  if (error) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl mb-4">Something went wrong</div>
          <button 
            onClick={handleRefresh}
            className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {/* Header Overlay */}
      <div className="fixed top-4 left-4 right-4 flex justify-between items-center z-50">
        <button
          onClick={handleClose}
          className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all"
        >
          <X size={24} />
        </button>
        
        <button
          onClick={handleSearch}
          className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all"
        >
          <Search size={24} />
        </button>
      </div>

      {/* Feed Container with Scroll Snap */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {posts.map((post, index) => (
          <div
            key={post.id}
            data-index={index}
            className="post-card h-screen w-full snap-center"
          >
            <PostCard
              post={post}
              isActive={index === activePostIndex}
              onAddToCart={handleAddToCart}
              onProductClick={handleProductClick}
              onViewAll={handleViewAll}
            />
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && posts.length > 0 && (
          <div className="h-screen bg-black flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
        )}
        
        {/* Initial Loading */}
        {loading && posts.length === 0 && (
          <div className="h-screen bg-black flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-white border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>
      
      {/* Pull to Refresh Indicator */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0, y: -20 }}
          className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-full text-sm"
        >
          Pull to refresh
        </motion.div>
      </div>
    </div>
  );
}
