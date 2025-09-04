'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Post } from '@/types/feed';
import ProductSection from './ProductSection';

interface PostCardProps {
  post: Post;
  isActive: boolean;
  onAddToCart: (productId: string) => void;
  onProductClick: (productId: string) => void;
  onViewAll: (category: string) => void;
}

export default function PostCard({ 
  post, 
  isActive, 
  onAddToCart, 
  onProductClick, 
  onViewAll 
}: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (post.type === 'video' && videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, post.type]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setProgress(progress);
    };

    const handleEnd = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleEnd);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleEnd);
    };
  }, []);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };


  const handleViewAll = () => {
    onViewAll(post.category);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden snap-start">
      {/* Media Content */}
      <div className="relative w-full h-full">
        {post.type === 'image' ? (
          !imageError ? (
            <Image
              src={post.mediaUrl}
              alt={`Post by ${post.author.displayName}`}
              fill
              className="object-cover"
              priority={isActive}
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-lg flex items-center justify-center text-3xl">
                  🖼️
                </div>
                <p className="text-lg">Image content</p>
                <p className="text-gray-400 text-sm mt-2">@{post.author.username}</p>
              </div>
            </div>
          )
        ) : (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              poster={post.thumbnailUrl}
              onError={() => setImageError(true)}
            >
              <source src={post.mediaUrl} type="video/mp4" />
            </video>
            
            {/* Video Controls Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlayPause}
                className="bg-black bg-opacity-50 rounded-full p-4 text-white hover:bg-opacity-70 transition-all"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
            </div>
            
            {/* Video Progress Bar */}
            {post.type === 'video' && (
              <div className="absolute bottom-32 left-4 right-4 h-1 bg-gray-600 rounded-full">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            
            {/* Mute Button */}
            {post.type === 'video' && (
              <button
                onClick={toggleMute}
                className="absolute bottom-40 right-4 bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            )}
          </div>
        )}
        
        {/* Brand Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-white text-3xl font-bold opacity-15 select-none">
            Mumzworld Now
          </div>
        </div>
        
        {/* Top Overlay - Status Bar Style */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 text-white z-10">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">9:41</span>
          </div>
          <div className="text-lg font-bold">
            Mumzworld Now
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 border border-white rounded-sm">
              <div className="w-3/4 h-full bg-white rounded-sm"></div>
            </div>
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full opacity-70"></div>
              <div className="w-1 h-3 bg-white rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
        
        
        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
      
      {/* Product Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent">
        <ProductSection
          promotionalText={post.promotionalText}
          products={post.relatedProducts}
          category={post.category}
          onAddToCart={onAddToCart}
          onProductClick={onProductClick}
          onViewAll={handleViewAll}
        />
      </div>
    </div>
  );
}
