import Link from 'next/link';
import { Star } from 'lucide-react';
import { Product } from '@/types';
import ImageWithFallback from './ImageWithFallback';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          {product.isHot && (
            <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded">热销</span>
          )}
          {product.isNew && (
            <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded">新品</span>
          )}
        </div>
      </div>
      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-rose-500 transition">
        {product.name}
      </h3>
      <div className="flex items-center gap-1 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">({product.reviewCount})</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-rose-500 font-bold">¥{product.price}</span>
        {product.originalPrice && (
          <span className="text-gray-400 text-sm line-through">¥{product.originalPrice}</span>
        )}
      </div>
    </Link>
  );
}
