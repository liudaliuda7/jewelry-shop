'use client';

import { ReactNode, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  User, 
  Settings,
  Heart,
  ShoppingBag,
  CreditCard,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { user } = useAuth();
  const { getOrdersByUserId } = useOrder();
  const router = useRouter();
  const pathname = usePathname();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setOrdersCount(getOrdersByUserId(user.id).length);
  }, [user, getOrdersByUserId, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">请先登录</p>
          <button
            onClick={() => router.push('/login')}
            className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            去登录
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'profile', label: '个人设置', icon: Settings, path: '/user/profile' },
    { id: 'addresses', label: '收货地址', icon: MapPin, path: '/user/addresses' },
    { id: 'orders', label: '我的订单', icon: ShoppingBag, path: '/user/orders', badge: ordersCount },
    { id: 'favorites', label: '我的收藏', icon: Heart, path: '/user/favorites' },
    { id: 'payments', label: '支付方式', icon: CreditCard, path: '/user/payments' },
  ];

  const getActiveTab = () => {
    if (pathname === '/user/profile' || pathname === '/user') return 'profile';
    if (pathname === '/user/addresses') return 'addresses';
    if (pathname === '/user/orders') return 'orders';
    if (pathname === '/user/favorites') return 'favorites';
    if (pathname === '/user/payments') return 'payments';
    return 'profile';
  };

  const activeTab = getActiveTab();

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
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
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
                <p className="text-rose-100 text-sm mt-1 truncate">{user.email}</p>
              </div>

              <div className="p-4">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => router.push(item.path)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-rose-50 text-rose-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-600 rounded-full font-bold">
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
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
