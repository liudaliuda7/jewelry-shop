'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { mockProducts, categories, styles, materials } from '@/data/mockData';
import { Product } from '@/types';
import { Filter, X } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...mockProducts];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedStyle) {
      filtered = filtered.filter(p => p.style === selectedStyle);
    }

    if (selectedMaterial) {
      filtered = filtered.filter(p => p.material.includes(selectedMaterial));
    }

    filtered = filtered.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setProducts(filtered);
  }, [selectedCategory, selectedStyle, selectedMaterial, priceRange, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedStyle('');
    setSelectedMaterial('');
    setPriceRange({ min: 0, max: 1000 });
    setSortBy('');
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">商品分类</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`block w-full text-left px-3 py-2 rounded ${!selectedCategory ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-100'}`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`block w-full text-left px-3 py-2 rounded ${selectedCategory === cat.id ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-100'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">风格</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedStyle('')}
            className={`block w-full text-left px-3 py-2 rounded ${!selectedStyle ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-100'}`}
          >
            全部
          </button>
          {styles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`block w-full text-left px-3 py-2 rounded ${selectedStyle === style.id ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-100'}`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">材质</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedMaterial('')}
            className={`block w-full text-left px-3 py-2 rounded ${!selectedMaterial ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-100'}`}
          >
            全部
          </button>
          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setSelectedMaterial(mat.name)}
              className={`block w-full text-left px-3 py-2 rounded ${selectedMaterial === mat.name ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-100'}`}
            >
              {mat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">价格范围</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded"
              placeholder="最低"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded"
              placeholder="最高"
            />
          </div>
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
      >
        清除筛选
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.name || '全部商品'
            : '全部商品'}
        </h1>
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <option value="">默认排序</option>
            <option value="price-asc">价格从低到高</option>
            <option value="price-desc">价格从高到低</option>
            <option value="rating">好评优先</option>
          </select>
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <Filter size={20} />
            筛选
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar />
        </aside>

        <main className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">没有找到符合条件的商品</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-rose-500 hover:underline"
              >
                清除筛选条件
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 mb-6">共找到 {products.length} 件商品</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">筛选</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={24} />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">加载中...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
