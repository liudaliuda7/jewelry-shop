import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { Product } from '@/types/data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // 计算折扣
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        {/* 商品图片 */}
        <div className="relative aspect-square">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* 折扣标签 */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded">
              -{discount}%
            </div>
          )}
          {/* 热门标签 */}
          {product.isHot && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
              热卖
            </div>
          )}
        </div>

        {/* 商品信息 */}
        <div className="p-4">
          <h3 className="text-gray-800 font-medium text-sm md:text-base truncate mb-2">
            {product.name}
          </h3>

          {/* 评分 */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.sales})</span>
          </div>

          {/* 价格 */}
          <div className="flex items-center">
            <span className="text-rose-600 font-bold text-lg">¥{product.price}</span>
            {product.originalPrice && (
              <span className="text-gray-400 text-sm line-through ml-2">
                ¥{product.originalPrice}
              </span>
            )}
          </div>

          {/* 材质 */}
          <p className="text-xs text-gray-500 mt-1">材质：{product.material}</p>
        </div>
      </div>
    </Link>
  );
}