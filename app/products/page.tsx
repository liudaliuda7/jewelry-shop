'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products, categories } from '@/types/data';
import { Product } from '@/types/data';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  // 筛选和排序状态
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>('default');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // 获取所有可用的风格和材质
  const allStyles = [...new Set(products.map(p => p.style))];
  const allMaterials = [...new Set(products.map(p => p.material))];

  // 当URL参数变化时更新选中的分类
  useEffect(() => {
    setSelectedCategory(searchParams.get('category'));
  }, [searchParams]);

  // 筛选和排序商品
  useEffect(() => {
    let result = [...products];

    // 按分类筛选
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 按风格筛选
    if (selectedStyle) {
      result = result.filter(p => p.style === selectedStyle);
    }

    // 按材质筛选
    if (selectedMaterial) {
      result = result.filter(p => p.material === selectedMaterial);
    }

    // 按价格范围筛选
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // 排序
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
        // 默认排序：热门商品在前
        result.sort((a, b) => (b.isHot ? 1 : 0) - (a.isHot ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedStyle, selectedMaterial, priceRange, sortBy]);

  // 重置筛选
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.name || '全部商品'
            : '全部商品'}
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 筛选侧边栏 */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">筛选</h2>

              {/* 分类筛选 */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">分类</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      !selectedCategory
                        ? 'bg-rose-100 text-rose-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    全部
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        selectedCategory === cat.id
                          ? 'bg-rose-100 text-rose-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 风格筛选 */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">风格</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedStyle(null)}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      !selectedStyle
                        ? 'bg-rose-100 text-rose-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    全部
                  </button>
                  {allStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedStyle(style)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        selectedStyle === style
                          ? 'bg-rose-100 text-rose-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* 材质筛选 */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">材质</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedMaterial(null)}
                    className={`block w-full text-left px-3 py-2 rounded ${
                      !selectedMaterial
                        ? 'bg-rose-100 text-rose-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    全部
                  </button>
                  {allMaterials.map((material) => (
                    <button
                      key={material}
                      onClick={() => setSelectedMaterial(material)}
                      className={`block w-full text-left px-3 py-2 rounded ${
                        selectedMaterial === material
                          ? 'bg-rose-100 text-rose-600'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* 价格范围筛选 */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3">价格范围</h3>
                <div className="space-y-3">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>¥{priceRange[0]}</span>
                    <span>¥{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* 重置按钮 */}
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
              >
                重置筛选
              </button>
            </div>
          </div>

          {/* 商品列表 */}
          <div className="flex-grow">
            {/* 排序选项 */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-wrap items-center justify-between">
                <span className="text-gray-600 mb-2 lg:mb-0">
                  共 {filteredProducts.length} 件商品
                </span>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="default">默认排序</option>
                    <option value="price-asc">价格从低到高</option>
                    <option value="price-desc">价格从高到低</option>
                    <option value="sales">销量优先</option>
                    <option value="rating">评分优先</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 商品网格 */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  没有找到相关商品
                </h3>
                <p className="text-gray-500 mb-4">
                  试试调整筛选条件
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
                >
                  重置筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}