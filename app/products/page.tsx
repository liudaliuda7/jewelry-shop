'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import { products, categories } from '@/types/data';
import { Product } from '@/types/data';

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryParam
  );
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category'));
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedStyle) {
      result = result.filter((p) => p.style === selectedStyle);
    }

    if (selectedMaterial) {
      result = result.filter((p) => p.material === selectedMaterial);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedStyle, selectedMaterial, priceRange, sortBy]);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedStyle(null);
    setSelectedMaterial(null);
    setPriceRange([0, 5000]);
    setSortBy('default');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name ||
              '全部商品'
            : '全部商品'}
        </h1>

        <div className="mb-6">
          <ProductFilters
            selectedCategory={selectedCategory}
            selectedStyle={selectedStyle}
            selectedMaterial={selectedMaterial}
            priceRange={priceRange}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onStyleChange={setSelectedStyle}
            onMaterialChange={setSelectedMaterial}
            onPriceRangeChange={setPriceRange}
            onSortChange={setSortBy}
            onReset={resetFilters}
          />
        </div>

        <div className="mb-4 text-sm text-gray-500">
          共 {filteredProducts.length} 件商品
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              没有找到相关商品
            </h3>
            <p className="text-gray-500 mb-6">试试调整筛选条件</p>
            <button
              onClick={resetFilters}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              重置筛选
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">加载中...</div>
    </div>}>
      <ProductsContent />
    </Suspense>
  );
}
