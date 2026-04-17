'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageZoomProps {
  images: string[];
  selectedImageIndex: number;
  onImageChange: (index: number) => void;
  alt: string;
  zoomLevel?: number;
}

export default function ImageZoom({ 
  images, 
  selectedImageIndex, 
  onImageChange, 
  alt,
  zoomLevel = 2.5
}: ImageZoomProps) {
  const [isZooming, setIsZooming] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setPosition({ x, y });
  };

  const nextImage = () => {
    onImageChange((selectedImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    onImageChange((selectedImageIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div
        ref={imageRef}
        className="relative aspect-square rounded-lg overflow-hidden cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[selectedImageIndex]}
          alt={alt}
          fill
          className="object-cover"
          priority
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors z-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors z-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {isZooming && (
          <div
            className="absolute pointer-events-none z-20"
            style={{
              width: `${100 / zoomLevel}%`,
              height: `${100 / zoomLevel}%`,
              left: `${position.x * 100 - (50 / zoomLevel)}%`,
              top: `${position.y * 100 - (50 / zoomLevel)}%`,
            }}
          >
            <div className="absolute inset-0 border-2 border-rose-400/80 rounded-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200/20 to-pink-100/10" />
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-rose-500" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-rose-500" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-rose-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-rose-500" />
          </div>
        )}
      </div>

      {isZooming && (
        <div
          className="absolute top-0 left-full ml-6 w-96 h-96 rounded-xl overflow-hidden z-40 hidden lg:block"
          style={{
            backgroundImage: `url(${images[selectedImageIndex]})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 border-2 border-rose-200 rounded-xl" />
          <div className="absolute inset-0 shadow-xl" />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 font-medium">
            放大 {zoomLevel}x
          </div>
        </div>
      )}
    </div>
  );
}
