'use client';

import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="flex justify-center mb-6">
          <ShoppingBag size={80} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">购物车是空的</h2>
        <p className="text-gray-500 mb-8">快去挑选心仪的商品吧！</p>
        <button
          onClick={() => router.push('/products')}
          className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition"
        >
          去购物
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">购物车</h1>
        <button
          onClick={() => router.push('/products')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={18} />
          继续购物
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="font-medium text-gray-900 mb-1 hover:text-rose-500 cursor-pointer"
                  onClick={() => router.push(`/products/${item.product.id}`)}
                >
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {item.selectedMaterial} / {item.selectedColor} / {item.selectedSize}
                </p>
                <p className="text-rose-500 font-bold">¥{item.product.price}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedMaterial, item.selectedColor, item.selectedSize)}
                  className="text-gray-400 hover:text-rose-500 transition"
                >
                  <Trash2 size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedMaterial, item.selectedColor, item.selectedSize, item.quantity - 1)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.selectedMaterial, item.selectedColor, item.selectedSize, item.quantity + 1)}
                    className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 h-fit">
          <h2 className="text-lg font-bold mb-4">订单摘要</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>商品数量</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)} 件</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>商品总价</span>
              <span>¥{getTotalPrice()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>运费</span>
              <span className="text-emerald-500">免运费</span>
            </div>
          </div>
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-bold">总计</span>
              <span className="text-2xl font-bold text-rose-500">¥{getTotalPrice()}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-rose-500 text-white py-3 rounded-lg hover:bg-rose-600 transition font-medium"
          >
            去结算
          </button>
          <button
            onClick={() => router.push('/products')}
            className="w-full mt-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            继续购物
          </button>
        </div>
      </div>
    </div>
  );
}
