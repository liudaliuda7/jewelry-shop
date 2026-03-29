'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CreditCard, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface AddressForm {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: '',
    zipCode: '',
  });

  // 处理地址表单变化
  const handleAddressChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // 验证地址表单
  const validateAddress = () => {
    return (
      address.name.trim() !== '' &&
      address.phone.trim() !== '' &&
      address.province.trim() !== '' &&
      address.city.trim() !== '' &&
      address.district.trim() !== '' &&
      address.address.trim() !== ''
    );
  };

  // 处理下一步
  const handleNextStep = () => {
    if (step === 'address' && validateAddress()) {
      setStep('payment');
    } else if (step === 'payment') {
      handlePayment();
    }
  };

  // 处理模拟支付
  const handlePayment = () => {
    setIsProcessing(true);
    // 模拟支付过程
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      clearCart();
    }, 2000);
  };

  // 返回首页
  const handleBackToHome = () => {
    router.push('/');
  };

  // 购物车为空时重定向到购物车页面
  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">购物车是空的</h2>
            <p className="text-gray-500 mb-8">请先添加商品到购物车</p>
            <button
              onClick={() => router.push('/cart')}
              className="px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
            >
              去购物车
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">确认订单</h1>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'address' || step === 'payment' || step === 'success'
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              1
            </div>
            <span
              className={`ml-2 ${
                step === 'address' ? 'text-rose-600 font-medium' : 'text-gray-500'
              }`}
            >
              收货地址
            </span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-4">
            <div
              className={`h-full ${
                step === 'payment' || step === 'success' ? 'bg-rose-600' : 'bg-gray-200'
              }`}
            />
          </div>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'payment' || step === 'success'
                  ? 'bg-rose-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              2
            </div>
            <span
              className={`ml-2 ${
                step === 'payment' ? 'text-rose-600 font-medium' : 'text-gray-500'
              }`}
            >
              支付
            </span>
          </div>
          <div className="w-16 h-1 bg-gray-200 mx-4">
            <div
              className={`h-full ${step === 'success' ? 'bg-rose-600' : 'bg-gray-200'}`}
            />
          </div>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === 'success' ? 'bg-rose-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              3
            </div>
            <span
              className={`ml-2 ${
                step === 'success' ? 'text-rose-600 font-medium' : 'text-gray-500'
              }`}
            >
              完成
            </span>
          </div>
        </div>

        {step === 'address' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 地址表单 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  收货地址
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">收货人 *</label>
                    <input
                      type="text"
                      value={address.name}
                      onChange={(e) => handleAddressChange('name', e.target.value)}
                      placeholder="请输入收货人姓名"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">手机号码 *</label>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      placeholder="请输入手机号码"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">省份 *</label>
                    <select
                      value={address.province}
                      onChange={(e) => handleAddressChange('province', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">请选择省份</option>
                      <option value="北京市">北京市</option>
                      <option value="上海市">上海市</option>
                      <option value="广东省">广东省</option>
                      <option value="浙江省">浙江省</option>
                      <option value="江苏省">江苏省</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">城市 *</label>
                    <select
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="">请选择城市</option>
                      <option value="上海市">上海市</option>
                      <option value="广州市">广州市</option>
                      <option value="深圳市">深圳市</option>
                      <option value="杭州市">杭州市</option>
                      <option value="南京市">南京市</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">区县 *</label>
                    <input
                      type="text"
                      value={address.district}
                      onChange={(e) => handleAddressChange('district', e.target.value)}
                      placeholder="请输入区县"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">详细地址 *</label>
                    <textarea
                      value={address.address}
                      onChange={(e) => handleAddressChange('address', e.target.value)}
                      placeholder="请输入详细地址"
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">邮政编码</label>
                    <input
                      type="text"
                      value={address.zipCode}
                      onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      placeholder="请输入邮政编码"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 订单摘要 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  订单摘要
                </h2>

                {/* 商品列表 */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {item.sku.material} · {item.sku.color}
                        </p>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-rose-600">
                            ¥{item.sku.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            ×{item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 价格计算 */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>商品小计</span>
                    <span>¥{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>运费</span>
                    <span className="text-green-600">免运费</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>总计</span>
                      <span className="text-rose-600">¥{cartTotal}</span>
                    </div>
                  </div>
                </div>

                {/* 下一步按钮 */}
                <button
                  onClick={handleNextStep}
                  disabled={!validateAddress()}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    validateAddress()
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  下一步
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 支付信息 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  支付方式
                </h2>

                {/* 地址预览 */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">收货地址</h3>
                  <p className="text-gray-600">
                    {address.province} {address.city} {address.district}{' '}
                    {address.address}
                  </p>
                  <p className="text-gray-600">
                    {address.name} {address.phone}
                  </p>
                </div>

                {/* 模拟支付选项 */}
                <div className="space-y-4">
                  <div className="border-2 border-rose-600 rounded-lg p-4 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-8 h-8 text-rose-600" />
                      <div>
                        <h3 className="font-medium text-gray-800">模拟支付</h3>
                        <p className="text-sm text-gray-500">
                          点击确认支付按钮模拟支付过程
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 支付按钮 */}
                <button
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className="w-full mt-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      确认支付 ¥{cartTotal}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 订单摘要 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  订单摘要
                </h2>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>商品小计</span>
                    <span>¥{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>运费</span>
                    <span className="text-green-600">免运费</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold">
                      <span>总计</span>
                      <span className="text-rose-600">¥{cartTotal}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center">
                  点击"确认支付"即表示您同意我们的服务条款
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-24 h-24 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                支付成功！
              </h2>
              <p className="text-gray-600 mb-2">感谢您的购买</p>
              <p className="text-gray-500 mb-8">
                订单号：ORD{Date.now().toString().slice(-10)}
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">收货信息</h3>
                <p className="text-gray-600">
                  {address.province} {address.city} {address.district}{' '}
                  {address.address}
                </p>
                <p className="text-gray-600">
                  {address.name} {address.phone}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBackToHome}
                  className="px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                >
                  返回首页
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="px-8 py-3 border-2 border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors font-medium"
                >
                  继续购物
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}