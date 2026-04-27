'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ChevronDown,
  ChevronUp,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  X,
  ArrowRight,
  ShoppingBag,
  MapPin,
  CreditCard,
  Trash2,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrder } from '@/contexts/OrderContext';
import { Order, OrderStatus, PaymentMethod } from '@/types/data';

const statusConfig: Record<OrderStatus, { 
  label: string; 
  color: string; 
  bgColor: string; 
  textColor: string;
  borderColor: string;
  icon: React.ReactNode 
}> = {
  pending: { 
    label: '待支付', 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-400',
    icon: <Clock className="w-6 h-6" />
  },
  paid: { 
    label: '已支付', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-400',
    icon: <CheckCircle2 className="w-6 h-6" />
  },
  shipped: { 
    label: '已发货', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-400',
    icon: <Truck className="w-6 h-6" />
  },
  delivered: { 
    label: '已完成', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    borderColor: 'border-green-400',
    icon: <Package className="w-6 h-6" />
  },
  cancelled: { 
    label: '已取消', 
    color: 'text-gray-600', 
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-600',
    borderColor: 'border-gray-400',
    icon: <X className="w-6 h-6" />
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { updateOrderStatus } = useOrder();
  const status = statusConfig[order.status];

  const handleCancelOrder = () => {
    if (window.confirm('确定要取消这个订单吗？')) {
      setIsCancelling(true);
      setTimeout(() => {
        updateOrderStatus(order.id, 'cancelled');
        setIsCancelling(false);
      }, 500);
    }
  };

  const canCancel = order.status === 'pending' || order.status === 'paid';

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${status.borderColor} overflow-hidden mb-6 transition-all hover:shadow-md`}>
      <div className={`p-4 ${status.bgColor} border-b flex items-center justify-between`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">订单号</span>
            <span className="font-mono font-semibold text-gray-800 text-lg">{order.orderNo}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${status.bgColor} ${status.textColor} border-2 ${status.borderColor}`}>
          {status.icon}
          <span className="font-bold text-lg">{status.label}</span>
        </div>
      </div>

      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-rose-500" />
          <span className="text-gray-600">
            共 <span className="font-bold text-gray-800">{order.items.length}</span> 件商品
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">订单金额</span>
          <span className="text-3xl font-extrabold text-rose-600">¥{order.totalAmount}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {order.items.slice(0, isExpanded ? order.items.length : 2).map((item, index) => (
            <div 
              key={item.id} 
              className={`flex items-center gap-4 p-3 rounded-lg ${index < 2 || isExpanded ? 'bg-gray-50' : ''}`}
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shadow-sm flex-shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-gray-800 line-clamp-1 text-base">{item.productName}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {item.skuMaterial} · {item.skuColor}
                  {item.skuSize && ` · ${item.skuSize}`}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-bold text-rose-600">¥{item.price}</span>
                  <span className="text-lg text-gray-500">
                    × <span className="font-semibold">{item.quantity}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {order.items.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 mx-auto mt-4 px-6 py-2 text-sm text-rose-600 bg-rose-50 rounded-full hover:bg-rose-100 transition-colors font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                收起商品
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                还有 {order.items.length - 2} 件商品
              </>
            )}
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">收货地址</p>
                <p className="text-sm text-gray-800">
                  {order.address.province} {order.address.city} {order.address.district} {order.address.address}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.address.name} {order.address.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <CreditCard className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 mb-1">支付方式</p>
                <p className="text-sm text-gray-800 font-medium">{paymentMethodLabels[order.paymentMethod]}</p>
                {order.paidAt && (
                  <p className="text-sm text-gray-500 mt-1">
                    支付时间：{formatDate(order.paidAt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50 border-t flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>{isExpanded ? '收起详情' : '查看详情'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <div className="flex items-center gap-3">
          {canCancel && (
            <button
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="flex items-center gap-2 px-6 py-2 border-2 border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50"
            >
              {isCancelling ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>{isCancelling ? '取消中...' : '取消订单'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const { getOrdersByUserId } = useOrder();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    if (user) {
      setOrders(getOrdersByUserId(user.id));
    }
  }, [user, getOrdersByUserId]);

  if (!user) return null;

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  const filterTabs = [
    { id: 'all' as const, label: '全部', count: orders.length },
    { id: 'pending' as const, label: '待支付', count: orders.filter(o => o.status === 'pending').length },
    { id: 'paid' as const, label: '已支付', count: orders.filter(o => o.status === 'paid').length },
    { id: 'shipped' as const, label: '已发货', count: orders.filter(o => o.status === 'shipped').length },
    { id: 'delivered' as const, label: '已完成', count: orders.filter(o => o.status === 'delivered').length },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">我的订单</h3>
          <p className="text-gray-500 text-sm">查看和管理您的所有订单</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 mb-6 inline-flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const status = tab.id !== 'all' ? statusConfig[tab.id] : null;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
                  activeFilter === tab.id
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-white'
                }`}
              >
                {status && <span className={activeFilter === tab.id ? 'text-white' : status.textColor}>{status.icon}</span>}
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                    activeFilter === tab.id
                      ? 'bg-white text-rose-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-300" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {activeFilter === 'all' ? '暂无订单' : `暂无${statusConfig[activeFilter].label}订单`}
            </h4>
            <p className="text-gray-500 mb-8">
              {activeFilter === 'all' 
                ? '您还没有任何订单记录，快去挑选心仪的商品吧' 
                : '当前筛选条件下没有订单'
              }
            </p>
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-lg"
            >
              去购物
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              共 <span className="font-bold text-gray-800">{filteredOrders.length}</span> 个订单
            </p>
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
