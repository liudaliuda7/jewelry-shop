'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Settings,
  Heart,
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { useAuth, User as UserType } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [user, router]);

  const handleInputChange = (field: keyof UserType, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMessage('');
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setSuccessMessage('个人信息已保存');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // 处理错误
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">请先登录</p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            去登录
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: '个人设置', icon: Settings },
    { id: 'orders', label: '我的订单', icon: ShoppingBag },
    { id: 'favorites', label: '我的收藏', icon: Heart },
    { id: 'payments', label: '支付方式', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">个人中心</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 text-center">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    fill
                    className="rounded-full object-cover border-4 border-white"
                  />
                </div>
                <h2 className="text-white font-semibold text-lg">{user.username}</h2>
                <p className="text-rose-100 text-sm mt-1">{user.email}</p>
              </div>

              <div className="p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {activeTab === 'profile' && '个人设置'}
                    {activeTab === 'orders' && '我的订单'}
                    {activeTab === 'favorites' && '我的收藏'}
                    {activeTab === 'payments' && '支付方式'}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {activeTab === 'profile' && '管理您的个人信息和账户设置'}
                    {activeTab === 'orders' && '查看您的订单历史和当前订单'}
                    {activeTab === 'favorites' && '查看您收藏的商品'}
                    {activeTab === 'payments' && '管理您的支付方式'}
                  </p>
                </div>
                {activeTab === 'profile' && (
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{isSaving ? '保存中...' : '保存'}</span>
                      </>
                    ) : (
                      <>
                        <Settings className="w-4 h-4" />
                        <span>编辑</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                  {successMessage}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        用户名
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={formData.username || ''}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        邮箱地址
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={formData.email || ''}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        手机号码
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          placeholder="请输入手机号码"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      收货地址
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <textarea
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        placeholder="请输入收货地址"
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          if (user) {
                            setFormData({
                              username: user.username,
                              email: user.email,
                              phone: user.phone || '',
                              address: user.address || '',
                            });
                          }
                        }}
                        className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? '保存中...' : '保存'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-800 mb-2">暂无订单</h4>
                  <p className="text-gray-500 mb-6">您还没有任何订单记录</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    去购物
                  </Link>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-800 mb-2">暂无收藏</h4>
                  <p className="text-gray-500 mb-6">您还没有收藏任何商品</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    去逛逛
                  </Link>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-800 mb-2">暂无支付方式</h4>
                  <p className="text-gray-500 mb-6">您还没有添加任何支付方式</p>
                  <button className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">
                    添加支付方式
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
