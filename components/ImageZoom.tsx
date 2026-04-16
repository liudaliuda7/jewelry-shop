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
            className="absolute border-2 border-rose-500 bg-rose-500 bg-opacity-10 pointer-events-none z-20"
            style={{
              width: `${100 / zoomLevel}%`,
              height: `${100 / zoomLevel}%`,
              left: `${position.x * 100 - (50 / zoomLevel)}%`,
              top: `${position.y * 100 - (50 / zoomLevel)}%`,
            }}
          />
        )}
      </div>

      {isZooming && (
        <div
          className="absolute top-0 left-full ml-4 w-80 h-80 rounded-lg overflow-hidden border border-gray-200 shadow-lg z-40 hidden lg:block"
          style={{
            backgroundImage: `url(${images[selectedImageIndex]})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
}
