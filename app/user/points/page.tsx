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
  ChevronRight,
  Info,
  X,
  Loader2,
  Sparkles
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

type TabType = 'overview' | 'exchange' | 'history';
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
    value: '¥50',
    icon: <Gift className="w-6 h-6" />
  },
  {
    id: 'coupon-100',
    name: '100元优惠券',
    requiredPoints: 1000,
    description: '满500可用',
    value: '¥100',
    icon: <Gift className="w-6 h-6" />
  },
  {
    id: 'coupon-200',
    name: '200元优惠券',
    requiredPoints: 2000,
    description: '满1000可用',
    value: '¥200',
    icon: <Gift className="w-6 h-6" />
  },
  {
    id: 'vip-day',
    name: '双倍积分日',
    requiredPoints: 1500,
    description: '指定日期购物双倍积分',
    value: '特权',
    icon: <Sparkles className="w-6 h-6" />
  }
];

const tabConfig = [
  {
    id: 'overview' as TabType,
    label: '概览',
    icon: <Coins className="w-5 h-5" />
  },
  {
    id: 'exchange' as TabType,
    label: '兑换',
    icon: <Gift className="w-5 h-5" />
  },
  {
    id: 'history' as TabType,
    label: '记录',
    icon: <Clock className="w-5 h-5" />
  }
];

export default function PointsPage() {
  const { user, getPointsTransactions, spendPoints, addPoints, getMemberInfo } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
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
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
                <Coins className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-amber-700 text-sm mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>我的积分</span>
                </div>
                <div className="text-5xl font-bold text-gray-800 mb-1">
                  {currentPoints.toLocaleString()}
                </div>
                <div className="text-amber-700 text-sm">
                  累计获得：{totalPoints.toLocaleString()} 积分
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/60 backdrop-blur rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{levelConfig.icon}</span>
                  <span className="text-gray-800 font-semibold">{levelConfig.name}</span>
                </div>
                <div className="text-amber-700 text-sm">
                  {levelConfig.discount < 1 ? `${levelConfig.discount * 10}折优惠` : '专属特权'}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 text-sm text-amber-700">
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
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-rose-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">累计获取</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    +{totalEarn.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 mt-1">
                    共 {earnTransactions.length} 笔
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-white border border-rose-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <ArrowDown className="w-5 h-5 text-rose-600" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">累计消耗</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    -{totalSpend.toLocaleString()}
                  </div>
                  <div className="text-xs text-rose-600 mt-1">
                    共 {spendTransactions.length} 笔
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">购物积分</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {transactions.filter(t => t.source === 'purchase').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    1元 = {1 * (levelConfig.level === 'regular' ? 1 : 
                      levelConfig.level === 'silver' ? 1.5 : 
                      levelConfig.level === 'gold' ? 2 : 2.5)}积分
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">奖励积分</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {transactions.filter(t => t.source !== 'purchase' && t.source !== 'exchange' && t.type !== 'spend')
                      .reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-600 mt-1">
                    注册、生日、活动
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-600" />
                  积分规则说明
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold flex-shrink-0">1.</span>
                    <span>购物积分：每消费1元可获得积分，会员等级越高，积分倍数越多（普通1倍、银卡1.5倍、金卡2倍、钻石2.5倍）</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold flex-shrink-0">2.</span>
                    <span>注册奖励：新用户注册成功即可获得积分</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold flex-shrink-0">3.</span>
                    <span>积分有效期：积分自获得之日起{POINTS_EXPIRATION_MONTHS}个月内有效，过期将自动清零</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-500 font-bold flex-shrink-0">4.</span>
                    <span>积分兑换：积分可用于兑换优惠券和专属特权，兑换后积分将立即扣除</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'exchange' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                    <Gift className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">积分兑换</h3>
                    <p className="text-sm text-gray-500">使用积分兑换优惠券和特权</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-600">可用积分：</span>
                  <span className="font-bold text-amber-600">{currentPoints.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {exchangeOptions.map((option) => {
                  const canExchange = currentPoints >= option.requiredPoints;
                  
                  return (
                    <div
                      key={option.id}
                      className={`relative p-5 rounded-xl border-2 transition-all ${
                        canExchange
                          ? 'border-rose-200 hover:border-rose-400 hover:shadow-lg cursor-pointer bg-gradient-to-br from-white to-rose-50'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                      }`}
                      onClick={() => canExchange && handleExchange(option)}
                    >
                      {!canExchange && (
                        <div className="absolute top-3 right-3 px-3 py-1 bg-gray-200 text-gray-500 text-xs rounded-full font-medium">
                          积分不足
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          canExchange ? 'bg-rose-100' : 'bg-gray-200'
                        }`}>
                          <div className={`${
                            canExchange ? 'text-rose-600' : 'text-gray-400'
                          }`}>
                            {option.icon}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{option.name}</h4>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-amber-500" />
                          <span className={`font-bold text-lg ${
                            canExchange ? 'text-amber-600' : 'text-gray-400'
                          }`}>
                            {option.requiredPoints} 积分
                          </span>
                        </div>
                        <span className={`text-sm font-bold ${
                          canExchange ? 'text-rose-600' : 'text-gray-400'
                        }`}>
                          {option.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">积分记录</h3>
                    <p className="text-sm text-gray-500">共 {filteredTransactions.length} 条记录</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {(['all', 'earn', 'spend', 'bonus'] as FilterType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 text-sm rounded-lg transition-all ${
                        filterType === type
                          ? 'bg-rose-100 text-rose-600 font-medium'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Coins className="w-10 h-10 text-gray-300" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">暂无积分记录</h4>
                  <p className="text-gray-500">购物消费或参与活动获取积分</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => {
                    const isPositive = transaction.amount > 0;
                    
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            isPositive ? 'bg-green-100' : 'bg-rose-100'
                          }`}>
                            {isPositive ? (
                              <ArrowUp className="w-6 h-6 text-green-600" />
                            ) : (
                              <ArrowDown className="w-6 h-6 text-rose-600" />
                            )}
                          </div>
                          
                          <div className="min-w-0">
                            <h4 className="font-medium text-gray-800">
                              {transaction.description}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
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
                          <div className={`text-2xl font-bold ${
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
          )}
        </div>
      </div>

      {showExchangeModal && selectedExchange && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800">
                确认兑换
              </h3>
              <button
                onClick={() => setShowExchangeModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center">
                    <Gift className="w-7 h-7 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{selectedExchange.name}</h4>
                    <p className="text-sm text-gray-500">{selectedExchange.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">所需积分</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Coins className="w-4 h-4" />
                      {selectedExchange.requiredPoints}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
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
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExchangeModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  onClick={confirmExchange}
                  disabled={isExchanging || currentPoints < selectedExchange.requiredPoints}
                  className="flex-1 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isExchanging ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      兑换中...
                    </>
                  ) : (
                    '确认兑换'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
