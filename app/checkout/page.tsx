'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  CreditCard, 
  CheckCircle,
  ChevronRight,
  Banknote,
  WalletCards,
  MessageCircle,
  Building2,
  Loader2,
  MapPin,
  Home,
  Building,
  Star,
  ChevronDown,
  Plus,
  X
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAddress } from '@/contexts/AddressContext';
import { 
  getProvinces, 
  getCities, 
  getDistricts,
  PaymentMethod as PaymentMethodType,
  OrderItem,
  Address,
  AddressTag
} from '@/types/data';

interface AddressForm {
  name: string;
  phone: string;
  provinceCode: string;
  cityCode: string;
  districtCode: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  address: string;
  zipCode: string;
}

const paymentMethods: { 
  id: PaymentMethodType; 
  name: string; 
  icon: React.ReactNode; 
  color: string;
  description: string;
}[] = [
  {
    id: 'alipay',
    name: '支付宝',
    icon: <WalletCards className="w-6 h-6" />,
    color: 'text-blue-500',
    description: '使用支付宝快捷支付'
  },
  {
    id: 'wechat',
    name: '微信支付',
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'text-green-500',
    description: '使用微信扫码支付'
  },
  {
    id: 'bankcard',
    name: '银行卡',
    icon: <Building2 className="w-6 h-6" />,
    color: 'text-orange-500',
    description: '使用银行卡在线支付'
  }
];

const tagLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  home: { label: '家', icon: <Home className="w-3.5 h-3.5" />, color: 'text-rose-500' },
  work: { label: '公司', icon: <Building className="w-3.5 h-3.5" />, color: 'text-blue-500' },
  default: { label: '默认', icon: <Star className="w-3.5 h-3.5" />, color: 'text-amber-500' },
};

function getTagInfo(tag?: AddressTag) {
  if (!tag) return null;
  return tagLabels[tag] || null;
}

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrder();
  const { user } = useAuth();
  const { addresses, getDefaultAddress } = useAddress();
  const router = useRouter();
  
  const [step, setStep] = useState<'address' | 'payment' | 'success'>('address');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType>('alipay');
  const [provinceCode, setProvinceCode] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ code: string; name: string }[]>([]);
  const [createdOrderNo, setCreatedOrderNo] = useState('');
  
  const [address, setAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    provinceCode: '',
    cityCode: '',
    districtCode: '',
    provinceName: '',
    cityName: '',
    districtName: '',
    address: '',
    zipCode: '',
  });

  const [showAddressSelector, setShowAddressSelector] = useState(false);
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<Address | null>(null);
  const [showManualInput, setShowManualInput] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setProvinces(getProvinces());
  }, []);

  useEffect(() => {
    const defaultAddr = getDefaultAddress();
    if (defaultAddr) {
      setSelectedSavedAddress(defaultAddr);
      fillAddressFromSaved(defaultAddr);
      setShowManualInput(false);
    } else if (addresses.length === 0 && !isInitialized) {
      setShowManualInput(true);
    }
    setIsInitialized(true);
  }, [addresses]);

  const fillAddressFromSaved = (savedAddress: Address) => {
    setAddress({
      name: savedAddress.name,
      phone: savedAddress.phone,
      provinceCode: savedAddress.provinceCode,
      cityCode: savedAddress.cityCode,
      districtCode: savedAddress.districtCode,
      provinceName: savedAddress.provinceName,
      cityName: savedAddress.cityName,
      districtName: savedAddress.districtName,
      address: savedAddress.address,
      zipCode: savedAddress.zipCode || '',
    });
    setProvinceCode(savedAddress.provinceCode);
    setCityCode(savedAddress.cityCode);
    setDistrictCode(savedAddress.districtCode);
    setCities(getCities(savedAddress.provinceCode));
    setDistricts(getDistricts(savedAddress.provinceCode, savedAddress.cityCode));
  };

  const handleSelectAddress = (savedAddress: Address) => {
    setSelectedSavedAddress(savedAddress);
    fillAddressFromSaved(savedAddress);
    setShowAddressSelector(false);
  };

  useEffect(() => {
    if (provinceCode) {
      const province = provinces.find(p => p.code === provinceCode);
      setAddress(prev => ({ 
        ...prev, 
        provinceCode,
        provinceName: province?.name || ''
      }));
      setCities(getCities(provinceCode));
      setCityCode('');
      setDistrictCode('');
      setDistricts([]);
    }
  }, [provinceCode, provinces]);

  useEffect(() => {
    if (cityCode && provinceCode) {
      const city = cities.find(c => c.code === cityCode);
      setAddress(prev => ({ 
        ...prev, 
        cityCode,
        cityName: city?.name || ''
      }));
      setDistricts(getDistricts(provinceCode, cityCode));
      setDistrictCode('');
    }
  }, [cityCode, provinceCode, cities]);

  useEffect(() => {
    if (districtCode) {
      const district = districts.find(d => d.code === districtCode);
      setAddress(prev => ({ 
        ...prev, 
        districtCode,
        districtName: district?.name || ''
      }));
    }
  }, [districtCode, districts]);

  const handleInputChange = (field: keyof AddressForm, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    return (
      address.name.trim() !== '' &&
      address.phone.trim() !== '' &&
      address.provinceCode !== '' &&
      address.cityCode !== '' &&
      address.districtCode !== '' &&
      address.address.trim() !== ''
    );
  };

  const handleNextStep = () => {
    if (step === 'address' && validateAddress()) {
      setStep('payment');
    } else if (step === 'payment') {
      handlePayment();
    }
  };

  const handlePayment = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      const orderItems: OrderItem[] = cart.map((item) => ({
        id: item.id,
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        skuId: item.sku.id,
        skuMaterial: item.sku.material,
        skuColor: item.sku.color,
        skuSize: item.sku.size,
        price: item.sku.price,
        quantity: item.quantity,
      }));

      const newOrder = createOrder(
        orderItems,
        cartTotal,
        selectedPayment,
        {
          name: address.name,
          phone: address.phone,
          province: address.provinceName,
          city: address.cityName,
          district: address.districtName,
          address: address.address,
          zipCode: address.zipCode,
        },
        user.id
      );

      setCreatedOrderNo(newOrder.orderNo);
      setIsProcessing(false);
      setStep('success');
      clearCart();
    }, 2000);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

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

  const stepLabels = [
    { step: 'address', label: '收货地址', num: 1 },
    { step: 'payment', label: '支付', num: 2 },
    { step: 'success', label: '完成', num: 3 },
  ];

  const getStepStatus = (currentStep: string, targetStep: string) => {
    const steps = ['address', 'payment', 'success'];
    const currentIndex = steps.indexOf(currentStep);
    const targetIndex = steps.indexOf(targetStep);
    
    if (targetIndex < currentIndex) return 'done';
    if (targetIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl p-12 shadow-2xl text-center max-w-sm mx-4">
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-rose-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-rose-600 rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-transparent border-t-rose-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-8 border-4 border-transparent border-t-rose-300 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-rose-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">支付处理中</h3>
            <p className="text-gray-500 mb-6">请稍候，正在验证您的支付...</p>
            <div className="flex justify-center gap-1">
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-rose-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-7xl mx-auto px-4 ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">确认订单</h1>

        <div className="flex items-center justify-center mb-8">
          {stepLabels.map((item, index) => {
            const status = getStepStatus(step, item.step);
            const isLast = index === stepLabels.length - 1;
            
            return (
              <div key={item.step} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      status === 'active'
                        ? 'bg-rose-600 text-white scale-110'
                        : status === 'done'
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {status === 'done' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      item.num
                    )}
                  </div>
                  <span
                    className={`ml-2 font-medium ${
                      status === 'active' ? 'text-rose-600' : status === 'done' ? 'text-gray-700' : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {!isLast && (
                  <div className="w-16 h-1 bg-gray-200 mx-4 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        getStepStatus(step, stepLabels[index + 1].step) !== 'pending'
                          ? 'bg-rose-600 w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {step === 'address' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    选择收货地址
                  </h2>
                </div>

                {selectedSavedAddress && (
                  <div className="mb-6 p-4 bg-rose-50 rounded-lg border-2 border-rose-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-800">{selectedSavedAddress.name}</span>
                          <span className="text-gray-600">{selectedSavedAddress.phone}</span>
                          {selectedSavedAddress.isDefault && (
                            <span className="px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              默认
                            </span>
                          )}
                          {getTagInfo(selectedSavedAddress.tag) && (
                            <span className={`px-2 py-0.5 bg-white text-xs rounded-full flex items-center gap-1 ${getTagInfo(selectedSavedAddress.tag)!.color}`}>
                              {getTagInfo(selectedSavedAddress.tag)!.icon}
                              {getTagInfo(selectedSavedAddress.tag)!.label}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {selectedSavedAddress.provinceName} {selectedSavedAddress.cityName} {selectedSavedAddress.districtName} {selectedSavedAddress.address}
                          {selectedSavedAddress.zipCode && ` (邮编: ${selectedSavedAddress.zipCode})`}
                        </p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 ml-4" />
                    </div>
                  </div>
                )}

                {addresses.length > 0 && (
                  <button
                    onClick={() => setShowAddressSelector(!showAddressSelector)}
                    className="flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mb-4"
                  >
                    <MapPin className="w-4 h-4" />
                    {selectedSavedAddress ? '更换地址' : '选择已有地址'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAddressSelector ? 'rotate-180' : ''}`} />
                  </button>
                )}

                {showAddressSelector && addresses.length > 0 && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3 max-h-80 overflow-y-auto">
                    {addresses.map((addr) => {
                      const tagInfo = getTagInfo(addr.tag);
                      const isSelected = selectedSavedAddress?.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleSelectAddress(addr)}
                          className={`p-4 rounded-lg cursor-pointer transition-all border-2 ${
                            isSelected
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-gray-200 hover:border-rose-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-grow">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-gray-800">{addr.name}</span>
                                <span className="text-gray-600">{addr.phone}</span>
                                {addr.isDefault && (
                                  <span className="px-2 py-0.5 bg-rose-600 text-white text-xs rounded-full flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    默认
                                  </span>
                                )}
                                {tagInfo && (
                                  <span className={`px-2 py-0.5 bg-gray-100 text-xs rounded-full flex items-center gap-1 ${tagInfo.color}`}>
                                    {tagInfo.icon}
                                    {tagInfo.label}
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm">
                                {addr.provinceName} {addr.cityName} {addr.districtName} {addr.address}
                                {addr.zipCode && ` (邮编: ${addr.zipCode})`}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="ml-3">
                                <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() => setShowManualInput(!showManualInput)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg hover:border-rose-400 hover:text-rose-500 transition-colors mb-4"
                >
                  <Plus className="w-4 h-4" />
                  {showManualInput ? '收起手动输入' : '新增收货地址'}
                </button>

                {showManualInput && (
                  <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-4">输入收货地址</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">收货人 *</label>
                        <input
                          type="text"
                          value={address.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="请输入收货人姓名"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">手机号码 *</label>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="请输入手机号码"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">省份 *</label>
                        <select
                          value={provinceCode}
                          onChange={(e) => setProvinceCode(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="">请选择省份</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">城市 *</label>
                        <select
                          value={cityCode}
                          onChange={(e) => setCityCode(e.target.value)}
                          disabled={!provinceCode}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">请选择城市</option>
                          {cities.map((city) => (
                            <option key={city.code} value={city.code}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">区县 *</label>
                        <select
                          value={districtCode}
                          onChange={(e) => setDistrictCode(e.target.value)}
                          disabled={!cityCode}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          <option value="">请选择区县</option>
                          {districts.map((district) => (
                            <option key={district.code} value={district.code}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2">详细地址 *</label>
                        <textarea
                          value={address.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="请输入详细地址（街道、门牌号等）"
                          rows={3}
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">邮政编码</label>
                        <input
                          type="text"
                          value={address.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder="请输入邮政编码（选填）"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  订单摘要
                </h2>

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
                          {item.sku.size && ` · ${item.sku.size}`}
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

                <button
                  onClick={handleNextStep}
                  disabled={!validateAddress()}
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    validateAddress()
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  下一步
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  支付方式
                </h2>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    收货地址
                  </h3>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-gray-800">{address.name}</span>
                    <span className="text-gray-600">{address.phone}</span>
                  </div>
                  <p className="text-gray-600">
                    {address.provinceName} {address.cityName} {address.districtName} {address.address}
                  </p>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPayment === method.id
                          ? 'border-rose-600 bg-rose-50'
                          : 'border-gray-200 hover:border-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${method.color}`}>
                          {method.icon}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">{method.name}</h3>
                          <p className="text-sm text-gray-500">{method.description}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === method.id
                              ? 'border-rose-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedPayment === method.id && (
                            <div className="w-3 h-3 rounded-full bg-rose-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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
                      <Banknote className="w-5 h-5" />
                      确认支付 ¥{cartTotal}
                    </>
                  )}
                </button>
              </div>
            </div>

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
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                支付成功！
              </h2>
              <p className="text-gray-600 mb-2">感谢您的购买</p>
              <p className="text-gray-500 mb-8">
                订单号：{createdOrderNo}
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-800 mb-4 text-center">收货信息</h3>
                <p className="text-gray-600 mb-2">
                  <span className="text-gray-500">收货人：</span>{address.name}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="text-gray-500">联系电话：</span>{address.phone}
                </p>
                <p className="text-gray-600">
                  <span className="text-gray-500">收货地址：</span>
                  {address.provinceName} {address.cityName} {address.districtName} {address.address}
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
                  onClick={() => router.push('/user/orders')}
                  className="px-8 py-3 border-2 border-rose-600 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors font-medium"
                >
                  查看订单
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
