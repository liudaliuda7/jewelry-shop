'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Carousel from '@/components/Carousel';
import ProductCard from '@/components/ProductCard';
import HomeSkeleton from '@/components/skeletons/HomeSkeleton';
import { banners, categories, getHotProducts, brandStory } from '@/types/data';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  const hotProducts = getHotProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 轮播图 */}
      <Carousel banners={banners} />

      {/* 分类导航 */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          精选分类
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-4xl mb-2 block">{category.icon}</span>
                  <span className="text-xl font-medium">{category.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 热门商品 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            🔥 热门推荐
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {hotProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            {brandStory.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={brandStory.image}
                alt={brandStory.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {brandStory.content}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
