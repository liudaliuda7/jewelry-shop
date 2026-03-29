'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
  const router = useRouter();

  // 处理结算
  const handleCheckout = () => {
    router.push('/checkout');
  };

  // 空状态
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">购物车是空的</h2>
            <p className="text-gray-500 mb-8">快去挑选心仪的首饰吧！</p>
            <Link
              href="/products"
              className="inline-block px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
            >
              去购物
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          购物车 ({cartCount} 件商品)
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 商品列表 */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4"
              >
                {/* 商品图片 */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0">
                  <Link href={`/products/${item.product.id}`}>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>

                {/* 商品信息 */}
                <div className="flex-grow">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="text-lg font-medium text-gray-800 hover:text-rose-600 transition-colors"
                  >
                    {item.product.name}
                  </Link>

                  <div className="text-sm text-gray-500 mt-1">
                    <span>材质：{item.sku.material}</span>
                    <span className="mx-2">|</span>
                    <span>颜色：{item.sku.color}</span>
                    {item.sku.size && (
                      <>
                        <span className="mx-2">|</span>
                        <span>尺寸：{item.sku.size}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* 数量调整 */}
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border rounded-l hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 h-8 border-t border-b flex items-center justify-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border rounded-r hover:bg-gray-100 transition-colors flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 价格 */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-rose-600">
                        ¥{item.sku.price * item.quantity}
                      </div>
                      <div className="text-sm text-gray-500">
                        ¥{item.sku.price} × {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-rose-600 transition-colors self-start"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* 订单摘要 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                订单摘要
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>商品小计</span>
                  <span>¥{cartTotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>运费</span>
                  <span className="text-green-600">免运费</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>总计</span>
                    <span className="text-rose-600">¥{cartTotal}</span>
                  </div>
                </div>
              </div>

              {/* 结算按钮 */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium mb-4"
              >
                去结算
              </button>

              {/* 清空购物车 */}
              <button
                onClick={clearCart}
                className="w-full py-2 text-gray-500 hover:text-rose-600 transition-colors text-sm"
              >
                清空购物车
              </button>

              {/* 继续购物 */}
              <Link
                href="/products"
                className="block text-center py-2 text-rose-600 hover:text-rose-700 transition-colors text-sm mt-2"
              >
                继续购物
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}