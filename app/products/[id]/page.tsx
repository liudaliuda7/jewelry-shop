'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { products } from '@/types/data';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import ImageZoom from '@/components/ImageZoom';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSku, setSelectedSku] = useState(product.skus[0]);
  const [quantity, setQuantity] = useState(1);

  // 计算折扣
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // 加入购物车
  const handleAddToCart = () => {
    try {
      addToCart(product, selectedSku, quantity);
      showToast({
        type: 'success',
        title: '已成功加入购物车！',
        description: `${product.name} × ${quantity} 件`,
        duration: 3000,
      });
    } catch (error) {
      showToast({
        type: 'error',
        title: '加入购物车失败',
        description: '请稍后重试',
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* 商品图片 */}
            <div>
              {/* 主图 - 带放大镜功能 */}
              <ImageZoom
                images={product.images}
                selectedImageIndex={selectedImageIndex}
                onImageChange={setSelectedImageIndex}
                alt={product.name}
                zoomLevel={2.5}
              />

              {/* 缩略图 */}
              <div className="flex gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square w-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-rose-600'
                        : 'border-gray-200 hover:border-rose-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 商品信息 */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {product.name}
              </h1>

              {/* 评分和销量 */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{product.rating}</span>
                </div>
                <span className="text-gray-500">已售 {product.sales}+</span>
              </div>

              {/* 价格 */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-bold text-rose-600">
                    ¥{selectedSku.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-400 line-through">
                      ¥{product.originalPrice}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="bg-rose-100 text-rose-600 text-sm px-2 py-1 rounded">
                      省 ¥{product.originalPrice! - product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* SKU选择器 */}
              <div className="space-y-4 mb-6">
                {/* 材质选择 */}
                <div>
                  <h3 className="text-gray-700 font-medium mb-2">材质</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.skus.map((sku) => (
                      <button
                        key={sku.id}
                        onClick={() => setSelectedSku(sku)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedSku.id === sku.id
                            ? 'border-rose-600 bg-rose-50 text-rose-600'
                            : 'border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        {sku.material}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 颜色展示 */}
                <div>
                  <h3 className="text-gray-700 font-medium mb-2">颜色</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedSku.color === '金色'
                          ? 'bg-yellow-400 border-yellow-500'
                          : selectedSku.color === '银色'
                          ? 'bg-gray-300 border-gray-400'
                          : selectedSku.color === '玫瑰金'
                          ? 'bg-pink-200 border-pink-300'
                          : 'bg-amber-600 border-amber-700'
                      }`}
                    />
                    <span className="text-gray-600">{selectedSku.color}</span>
                  </div>
                </div>

                {/* 尺寸选择（如果有） */}
                {selectedSku.size && (
                  <div>
                    <h3 className="text-gray-700 font-medium mb-2">尺寸</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.skus
                        .filter(
                          (sku) =>
                            sku.material === selectedSku.material &&
                            sku.color === selectedSku.color
                        )
                        .map((sku) => (
                          <button
                            key={sku.id}
                            onClick={() => setSelectedSku(sku)}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                              selectedSku.id === sku.id
                                ? 'border-rose-600 bg-rose-50 text-rose-600'
                                : 'border-gray-200 hover:border-rose-300'
                            }`}
                          >
                            {sku.size}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 库存 */}
              <div className="mb-6">
                <span className="text-gray-500">库存：</span>
                <span
                  className={`${
                    selectedSku.stock < 20 ? 'text-rose-600' : 'text-green-600'
                  }`}
                >
                  {selectedSku.stock}件
                  {selectedSku.stock < 20 && ' (库存紧张)'}
                </span>
              </div>

              {/* 数量选择 */}
              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-2">数量</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 border rounded-l-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 h-10 border-t border-b text-center focus:outline-none"
                  />
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(selectedSku.stock, q + 1))
                    }
                    className="w-10 h-10 border rounded-r-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors font-medium"
                >
                  <ShoppingCart className="w-5 h-5" />
                  加入购物车
                </button>
                <button className="w-12 h-12 border-2 border-gray-200 rounded-lg hover:border-rose-600 hover:text-rose-600 transition-colors flex items-center justify-center">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* 商品描述 */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  商品描述
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* 商品参数 */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  商品参数
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">分类</div>
                  <div className="text-gray-800">
                    {product.category === 'necklace'
                      ? '项链'
                      : product.category === 'ring'
                      ? '戒指'
                      : product.category === 'earring'
                      ? '耳环'
                      : '手链'}
                  </div>
                  <div className="text-gray-500">风格</div>
                  <div className="text-gray-800">{product.style}</div>
                  <div className="text-gray-500">材质</div>
                  <div className="text-gray-800">{product.material}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}