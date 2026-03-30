import Link from 'next/link';
import { categories } from '@/data/mockData';
import ImageWithFallback from './ImageWithFallback';

export default function CategoryNav() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-8">商品分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg aspect-square mb-3">
                <ImageWithFallback
                  src={category.icon}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition" />
              </div>
              <h3 className="text-center font-medium text-gray-900 group-hover:text-rose-500 transition">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
