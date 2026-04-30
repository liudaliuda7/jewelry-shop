'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Coins,
  ArrowUp,
  ArrowDown,
  Gift,
  Clock,
  TrendingUp,
  ShoppingBag,
  Award,
  Star,
  Calendar,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  PointsTransaction,
  PointsTransactionType,
  PointsSource,
  POINTS_EXPIRATION_MONTHS,
  getMemberLevelConfig,
  MemberLevel
} from '@/types/data';

type FilterType = 'all' | 'earn' | 'spend' | 'bonus';

const sourceLabels: Record<PointsSource, string> = {
  purchase: '购物消费',
  signup: '注册赠送',
  birthday: '生日福利',
  review: '评价奖励',
  activity: '活动奖励',
  exchange: '积分兑换',
  expire: '积分过期'
};

const typeLabels: Record<PointsTransactionType, string> = {
  earn: '获取积分',
  spend: '消耗积分',
  expire: '积分过期',
  bonus: '奖励积分'
};

const exchangeOptions = [
  {
    id: 'coupon-50',
    name: '50元优惠券',
    requiredPoints: 500,
    description: '满200可用',
    value: '¥50'
  },
  {
    id: 'coupon-100',
    name: '100元优惠券',
    requiredPoints: 1000,
    description: '满500可用',
    value: '¥100'
  },
  {
    id: 'coupon-200',
    name: '200元优惠券',
    requiredPoints: 2000,
    description: '满1000可用',
    value: '¥200'
  },
  {
    id: 'vip-day',
    name: '双倍积分日',
    requiredPoints: 1500,
    description: '指定日期购物双倍积分',
    value: '特权'
  }
];

export default function PointsPage() {
  const { user, getPointsTransactions, spendPoints, addPoints, getMemberInfo } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [isExchanging, setIsExchanging] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setTransactions(getPointsTransactions());
    setMemberInfo(getMemberInfo());
  }, [user, router, getPointsTransactions, getMemberInfo]);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'earn') return t.type === 'earn' || t.type === 'bonus';
    if (filterType === 'spend') return t.type === 'spend';
    if (filterType === 'bonus') return t.type === 'bonus';
    return true;
  });

  const handleExchange = (option: any) => {
    setSelectedExchange(option);
    setShowExchangeModal(true);
  };

  const confirmExchange = () => {
    if (!selectedExchange || !user) return;
    
    setIsExchanging(true);
    
    setTimeout(() => {
      const success = spendPoints(
        selectedExchange.requiredPoints,
        `兑换${selectedExchange.name}`
      );
      
      if (success) {
        setTransactions(getPointsTransactions());
        setMemberInfo(getMemberInfo());
      }
      
      setShowExchangeModal(false);
      setSelectedExchange(null);
      setIsExchanging(false);
    }, 1000);
  };

  if (!user || !memberInfo) {
    return null;
  }

  const currentPoints = memberInfo.currentPoints;
  const totalPoints = memberInfo.totalPoints;
  const levelConfig = getMemberLevelConfig(memberInfo.memberLevel as MemberLevel);

  const earnTransactions = transactions.filter(t => t.type === 'earn' || t.type === 'bonus');
  const spendTransactions = transactions.filter(t => t.type === 'spend');
  const totalEarn = earnTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalSpend = Math.abs(spendTransactions.reduce((sum, t) => sum + t.amount, 0));

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-100 text-sm mb-2">
                <Coins className="w-4 h-4" />
                <span>我的积分</span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {currentPoints.toLocaleString()}
              </div>
              <div className="text-amber-100 text-sm">
                累计获得：{totalPoints.toLocaleString()} 积分
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <span className="text-2xl">{levelConfig.icon}</span>
                <span className="text-white font-medium">{levelConfig.name}</span>
              </div>
              <div className="text-amber-100 text-sm">
                {levelConfig.discount < 1 ? `${levelConfig.discount * 10}折优惠` : '专属特权'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-amber-100">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>积分有效期：{POINTS_EXPIRATION_MONTHS}个月</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>等级加速：{(levelConfig.level === 'regular' ? 1 : 
                levelConfig.level === 'silver' ? 1.5 : 
                levelConfig.level === 'gold' ? 2 : 2.5)}倍</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-xs text-gray-500">累计获取</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            +{totalEarn.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 mt-1">
            共 {earnTransactions.length} 笔
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <ArrowDown className="w-5 h-5 text-rose-500" />
            <span className="text-xs text-gray-500">累计消耗</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            -{totalSpend.toLocaleString()}
          </div>
          <div className="text-xs text-rose-600 mt-1">
            共 {spendTransactions.length} 笔
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <span className="text-xs text-gray-500">购物积分</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {transactions.filter(t => t.source === 'purchase').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            1元 = {1 * (levelConfig.level === 'regular' ? 1 : 
              levelConfig.level === 'silver' ? 1.5 : 
              levelConfig.level === 'gold' ? 2 : 2.5)}积分
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="text-xs text-gray-500">奖励积分</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {transactions.filter(t => t.source !== 'purchase' && t.source !== 'exchange' && t.type !== 'spend')
              .reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
          </div>
          <div className="text-xs text-amber-600 mt-1">
            注册、生日、活动
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-600" />
            积分兑换
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exchangeOptions.map((option) => {
            const canExchange = currentPoints >= option.requiredPoints;
            
            return (
              <div
                key={option.id}
                className={`relative p-5 rounded-xl border-2 transition-all ${
                  canExchange
                    ? 'border-rose-200 hover:border-rose-400 hover:shadow-lg cursor-pointer'
                    : 'border-gray-200 opacity-60'
                }`}
                onClick={() => canExchange && handleExchange(option)}
              >
                {!canExchange && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                    积分不足
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    canExchange ? 'bg-rose-100' : 'bg-gray-100'
                  }`}>
                    <Gift className={`w-6 h-6 ${
                      canExchange ? 'text-rose-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{option.name}</h4>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className={`font-bold ${
                      canExchange ? 'text-amber-600' : 'text-gray-400'
                    }`}>
                      {option.requiredPoints} 积分
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-rose-600">
                    {option.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            积分明细
          </h3>
          
          <div className="flex items-center gap-2">
            {(['all', 'earn', 'spend', 'bonus'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  filterType === type
                    ? 'bg-rose-100 text-rose-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? '全部' : 
                 type === 'earn' ? '获取' : 
                 type === 'spend' ? '消耗' : '奖励'}
              </button>
            ))}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Coins className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无积分明细</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const isPositive = transaction.amount > 0;
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isPositive ? 'bg-green-100' : 'bg-rose-100'
                    }`}>
                      {isPositive ? (
                        <ArrowUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDown className="w-5 h-5 text-rose-600" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {transaction.description}
                      </h4>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(transaction.createdAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                          {sourceLabels[transaction.source] || transaction.source}
                        </span>
                        {transaction.expiresAt && (
                          <span className="flex items-center gap-1 text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            有效期至 {new Date(transaction.expiresAt).toLocaleDateString('zh-CN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      isPositive ? 'text-green-600' : 'text-rose-600'
                    }`}>
                      {isPositive ? '+' : ''}{transaction.amount}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      余额：{transaction.balance}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-amber-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          积分规则说明
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">1.</span>
            <span>购物积分：每消费1元可获得积分，会员等级越高，积分倍数越多（普通1倍、银卡1.5倍、金卡2倍、钻石2.5倍）</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">2.</span>
            <span>注册奖励：新用户注册成功即可获得{POINTS_EXPIRATION_MONTHS}积分</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">3.</span>
            <span>积分有效期：积分自获得之日起{POINTS_EXPIRATION_MONTHS}个月内有效，过期将自动清零</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-500 font-bold">4.</span>
            <span>积分兑换：积分可用于兑换优惠券和专属特权，兑换后积分将立即扣除</span>
          </div>
        </div>
      </div>

      {showExchangeModal && selectedExchange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              确认兑换
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{selectedExchange.name}</h4>
                  <p className="text-sm text-gray-500">{selectedExchange.description}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">所需积分</span>
                <span className="font-bold text-amber-600 flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  {selectedExchange.requiredPoints}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">当前积分</span>
                <span className={`font-bold ${
                  currentPoints >= selectedExchange.requiredPoints ? 'text-green-600' : 'text-rose-600'
                }`}>
                  {currentPoints}
                </span>
              </div>
              
              {currentPoints < selectedExchange.requiredPoints && (
                <div className="mt-3 p-3 bg-rose-50 rounded-lg text-sm text-rose-600">
                  积分不足，还需 {selectedExchange.requiredPoints - currentPoints} 积分
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExchangeModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmExchange}
                disabled={isExchanging || currentPoints < selectedExchange.requiredPoints}
                className="flex-1 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExchanging ? '兑换中...' : '确认兑换'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
