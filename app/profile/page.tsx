'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Settings,
  Heart,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  X
} from 'lucide-react';
import { useAuth, User as UserType } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { Order, OrderStatus, PaymentMethod } from '@/types/data';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  pending: { 
    label: '待支付', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100',
    icon: <Clock className="w-4 h-4" />
  },
  paid: { 
    label: '已支付', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    icon: <CheckCircle2 className="w-4 h-4" />
  },
  shipped: { 
    label: '已发货', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100',
    icon: <Truck className="w-4 h-4" />
  },
  delivered: { 
    label: '已完成', 
    color: 'text-green-600', 
    bgColor: 'bg-green-100',
    icon: <Package className="w-4 h-4" />
  },
  cancelled: { 
    label: '已取消', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-100',
    icon: <X className="w-4 h-4" />
  },
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  alipay: '支付宝',
  wechat: '微信支付',
  bankcard: '银行卡',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusConfig[order.status];

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-500">订单号：</span>
            <span className="font-medium text-gray-800">{order.orderNo}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">下单时间：</span>
            <span className="text-gray-800">{formatDate(order.createdAt)}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${status.bgColor} ${status.color}`}>
          {status.icon}
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {order.items.slice(0, isExpanded ? order.items.length : 2).map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-gray-800 line-clamp-1">{item.productName}</h4>
                <p className="text-sm text-gray-500">
                  {item.skuMaterial} · {item.skuColor}
                  {item.skuSize && ` · ${item.skuSize}`}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-rose-600 font-medium">¥{item.price}</span>
                  <span className="text-gray-500">× {item.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {order.items.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-rose-600 mt-3 transition-colors"
          >
            {isExpanded ? '收起' : `还有 ${order.items.length - 2} 件商品`}
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
        <div className="text-sm text-gray-500">
          共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件商品
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-500">支付方式：</span>
            <span className="text-gray-800">{paymentMethodLabels[order.paymentMethod]}</span>
          </div>
          <div className="text-lg">
            <span className="text-gray-500">订单金额：</span>
            <span className="font-bold text-rose-600">¥{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { getOrdersByUserId } = useOrder();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UserType>>({});
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
      });
      setOrders(getOrdersByUserId(user.id));
    }
  }, [user, getOrdersByUserId]);

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
          <button
            onClick={() => window.location.href = '/login'}
            className="inline-block px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: '个人设置', icon: Settings },
    { id: 'orders', label: '我的订单', icon: ShoppingBag, badge: orders.length },
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
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          activeTab === item.id
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-600 rounded-full">
                            {item.badge}
                          </span>
                        )}
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
                <div>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <ShoppingBag className="w-12 h-12 text-gray-300" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-800 mb-2">暂无订单</h4>
                      <p className="text-gray-500 mb-6">您还没有任何订单记录</p>
                      <button
                        onClick={() => window.location.href = '/products'}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                      >
                        去购物
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 mb-4">
                        共 {orders.length} 个订单
                      </p>
                      {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-12 h-12 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">暂无收藏</h4>
                  <p className="text-gray-500 mb-6">您还没有收藏任何商品</p>
                  <button
                    onClick={() => window.location.href = '/products'}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    去逛逛
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-12 h-12 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">暂无支付方式</h4>
                  <p className="text-gray-500 mb-6">您还没有添加任何支付方式</p>
                  <p className="text-sm text-gray-400">
                    支付时可以选择支付宝、微信支付或银行卡
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
