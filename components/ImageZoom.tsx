'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface ImageZoomProps {
  images: string[];
  alt: string;
  zoomLevel?: number;
  selectedImage: number;
  onSelectedImageChange: (index: number) => void;
}

export default function ImageZoom({ images, alt, zoomLevel = 2.5, selectedImage, onSelectedImageChange }: ImageZoomProps) {
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
    onSelectedImageChange((selectedImage + 1) % images.length);
  };

  const prevImage = () => {
    onSelectedImageChange((selectedImage - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div
        ref={imageRef}
        className="relative aspect-square overflow-hidden rounded-lg cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <ImageWithFallback
          src={images[selectedImage]}
          alt={alt}
          className="w-full h-full object-cover"
        />
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition z-30"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition z-30"
        >
          <ChevronRight size={24} />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onSelectedImageChange(index);
              }}
              className={`w-2 h-2 rounded-full ${selectedImage === index ? 'bg-white' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
        
        {isZooming && (
          <div
            className="absolute border-2 border-rose-500 bg-rose-500 bg-opacity-10 pointer-events-none z-10"
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
          className="absolute top-0 left-full ml-4 w-80 h-80 rounded-lg overflow-hidden border border-gray-200 shadow-lg z-20 hidden lg:block"
          style={{
            backgroundImage: `url(${images[selectedImage]})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x * 100}% ${position.y * 100}%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      )}
    </div>
  );
}
