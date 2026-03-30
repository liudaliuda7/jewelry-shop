'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Address } from '@/types';
import { ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    street: '',
    zipCode: '',
  });

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">购物车为空</h2>
          <p className="text-gray-500 mb-8">请先添加商品到购物车</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
          >
            去购物
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">订单提交成功！</h2>
          <p className="text-gray-500 mb-6">感谢您的购买，我们将尽快为您发货</p>
          <p className="text-sm text-gray-400 mb-8">订单号：ORD{Date.now().toString().slice(-10)}</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
          >
            继续购物
          </Link>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">确认订单</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">收货地址</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                    <input
                      type="text"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                      placeholder="请输入姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">手机号码</label>
                    <input
                      type="tel"
                      name="phone"
                      value={address.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                      placeholder="请输入手机号码"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">省份</label>
                    <input
                      type="text"
                      name="province"
                      value={address.province}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                      placeholder="省份"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                    <input
                      type="text"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                      placeholder="城市"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">区/县</label>
                    <input
                      type="text"
                      name="district"
                      value={address.district}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                      placeholder="区/县"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">详细地址</label>
                  <input
                    type="text"
                    name="street"
                    value={address.street}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="街道、门牌号等"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">邮政编码</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none"
                    placeholder="邮政编码（选填）"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">支付方式</h2>
              <div className="space-y-4">
                <label className="flex items-center p-4 border-2 border-rose-500 bg-rose-50 rounded-xl cursor-pointer">
                  <input type="radio" name="payment" value="alipay" defaultChecked className="w-4 h-4 text-rose-500" />
                  <span className="ml-3 text-gray-800">支付宝</span>
                </label>
                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value="wechat" className="w-4 h-4 text-rose-500" />
                  <span className="ml-3 text-gray-800">微信支付</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">订单摘要</h2>
              
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <div key={item.product.id + index + item.selectedMaterial + item.selectedColor + item.selectedSize} className="flex gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{item.selectedMaterial} / {item.selectedColor} / {item.selectedSize}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-rose-500 font-medium">¥{item.product.price.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm">x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">商品总价</span>
                  <span className="text-gray-800">¥{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">运费</span>
                  <span className="text-green-500">免运费</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-gray-100">
                  <span className="text-gray-800">应付总额</span>
                  <span className="text-rose-500">¥{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 py-4 bg-rose-500 text-white rounded-xl text-lg font-medium hover:bg-rose-600 transition-colors"
              >
                提交订单
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
