'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ChevronLeft, ChevronRight, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { getProductById } from '@/data/mockData';
import { useCart } from '@/context/CartContext';
import ImageWithFallback from '@/components/ImageWithFallback';
import ImageZoom from '@/components/ImageZoom';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const product = getProductById(productId);
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState(product?.material[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [showAddedToast, setShowAddedToast] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">商品不存在</h1>
        <button
          onClick={() => router.push('/products')}
          className="mt-4 text-rose-500 hover:underline"
        >
          返回商品列表
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedMaterial, selectedColor, selectedSize);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedMaterial, selectedColor, selectedSize);
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showAddedToast && (
        <div className="fixed top-20 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          已加入购物车！
        </div>
      )}

      <nav className="text-sm text-gray-500 mb-6">
        <span onClick={() => router.push('/')} className="hover:text-gray-700 cursor-pointer">首页</span>
        <span className="mx-2">/</span>
        <span onClick={() => router.push('/products')} className="hover:text-gray-700 cursor-pointer">商品</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <ImageZoom
            images={product.images}
            alt={product.name}
            zoomLevel={2.5}
            selectedImage={selectedImage}
            onSelectedImageChange={setSelectedImage}
          />
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImage === index ? 'border-rose-500' : 'border-transparent'}`}
              >
                <ImageWithFallback src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.isHot && <span className="bg-rose-500 text-white text-xs px-2 py-1 rounded">热销</span>}
              {product.isNew && <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded">新品</span>}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'text-amber-400' : 'text-gray-300'}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">({product.reviewCount} 评价)</span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-rose-500">¥{product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">¥{product.originalPrice}</span>
            )}
          </div>

          <p className="text-gray-600">{product.description}</p>

          <div>
            <h3 className="font-semibold mb-3">材质</h3>
            <div className="flex flex-wrap gap-2">
              {product.material.map((mat) => (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`px-4 py-2 border rounded-lg transition ${selectedMaterial === mat ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">颜色</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg transition ${selectedColor === color ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">尺寸</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg transition ${selectedSize === size ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-300 hover:border-gray-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">数量</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
              >
                -
              </button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50 transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition"
            >
              <ShoppingCart size={20} />
              加入购物车
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              立即购买
            </button>
          </div>

          <div className="flex gap-6 pt-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <Heart size={20} />
              收藏
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
              <Share2 size={20} />
              分享
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">商品详情</h3>
            <div className="text-gray-600 whitespace-pre-line">
              {product.details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
