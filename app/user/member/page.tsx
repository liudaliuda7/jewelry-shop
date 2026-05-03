'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Star,
  Coins,
  Gift,
  Award,
  ChevronRight,
  Calendar,
  ArrowUp,
  Crown,
  User,
  Shield,
  Sparkles,
  Info,
  TrendingUp,
  Wallet,
  ChevronUp,
  TrendingUp as TrendingUpIcon,
  Heart,
  MessageCircle,
  Tag,
  Package,
  PartyPopper,
  Settings
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  getMemberLevelConfig,
  memberLevelConfigs,
  MemberLevel
} from '@/types/data';

type TabType = 'overview' | 'progress' | 'benefits';

const tabConfig = [
  {
    id: 'overview' as TabType,
    label: '会员概览',
    icon: <User className="w-5 h-5" />
  },
  {
    id: 'progress' as TabType,
    label: '等级进度',
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    id: 'benefits' as TabType,
    label: '会员权益',
    icon: <Shield className="w-5 h-5" />
  }
];

export default function MemberCenterPage() {
  const { user, getMemberInfo, getNextLevelProgress, checkAndUpdateMemberLevel } = useAuth();
  const router = useRouter();
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [levelProgress, setLevelProgress] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setMemberInfo(getMemberInfo());
    setLevelProgress(getNextLevelProgress());
    
    setTimeout(() => setAnimateProgress(true), 100);
  }, [user, router, getMemberInfo, getNextLevelProgress]);

  const handleCheckLevel = () => {
    setIsChecking(true);
    checkAndUpdateMemberLevel();
    setTimeout(() => {
      setMemberInfo(getMemberInfo());
      setLevelProgress(getNextLevelProgress());
      setIsChecking(false);
    }, 500);
  };

  const toggleLevelExpand = (level: string) => {
    setExpandedLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  if (!user || !memberInfo) {
    return null;
  }

  const currentLevelConfig = getMemberLevelConfig(memberInfo.memberLevel as MemberLevel);
  const nextLevelConfig = levelProgress 
    ? memberLevelConfigs.find(c => c.minPoints === levelProgress.required) || null
    : null;

  const joinDate = new Date(memberInfo.joinDate);
  const formattedJoinDate = `${joinDate.getFullYear()}年${joinDate.getMonth() + 1}月${joinDate.getDate()}日`;

  return (
    <div className="space-y-6">
      {/* 顶部会员卡片 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className={`p-8 ${currentLevelConfig.bgColor} relative overflow-hidden`}>
          {/* 装饰背景 */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3" />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white ${
                    currentLevelConfig.color.replace('text-', 'bg-').replace('600', '500')
                  }`}>
                    <span className="text-white text-lg">{currentLevelConfig.icon}</span>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-gray-800">{user.username}</h2>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 ${
                      currentLevelConfig.bgColor
                    } ${currentLevelConfig.color} shadow-sm`}>
                      {currentLevelConfig.icon} {currentLevelConfig.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>加入时间：{formattedJoinDate}</span>
                  </div>
                </div>
              </div>

              <div className="lg:ml-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-rose-600" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">当前积分</span>
                  </div>
                  <div className="text-4xl font-bold text-rose-600 mb-1">
                    {memberInfo.currentPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-rose-500 font-medium">
                    会员等级加速中
                  </div>
                </div>
                
                <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">累计消费</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-1">
                    ¥{memberInfo.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    支持等级升级
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <TrendingUpIcon className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">累计获得</span>
                  </div>
                  <div className="text-4xl font-bold text-amber-600 mb-1">
                    {memberInfo.totalPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-amber-600 font-medium">
                    积分总数
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab导航 */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-100">
          <div className="flex">
            {tabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-8 py-5 text-sm font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-rose-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span className="text-base">{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          {/* 会员概览 Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* 快捷操作 */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-rose-600" />
                  </div>
                  快捷操作
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => router.push('/user/points')}
                    className="bg-gradient-to-br from-amber-50 to-white border border-amber-200 rounded-2xl p-6 hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                        <Coins className="w-7 h-7 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">积分管理</h4>
                        <p className="text-sm text-gray-500 mt-1">查看积分明细和兑换</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-amber-600 font-medium">当前积分: {memberInfo.currentPoints}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/user/orders')}
                    className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Award className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">我的订单</h4>
                        <p className="text-sm text-gray-500 mt-1">查看历史订单</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">累计消费: ¥{memberInfo.totalSpent}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>

                  <button
                    onClick={() => router.push('/user/profile')}
                    className="bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-2xl p-6 hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                        <User className="w-7 h-7 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">个人设置</h4>
                        <p className="text-sm text-gray-500 mt-1">完善个人信息</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-rose-600 font-medium">设置生日获取特权</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('benefits')}
                    className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <Shield className="w-7 h-7 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-lg">会员权益</h4>
                        <p className="text-sm text-gray-500 mt-1">查看等级特权</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-green-600 font-medium">当前等级: {currentLevelConfig.name}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                </div>
              </div>

              {/* 当前等级信息 */}
              <div className="bg-gradient-to-r from-rose-50 to-white border border-rose-200 rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-rose-200 flex items-center justify-center shadow-lg">
                      <span className="text-5xl">{currentLevelConfig.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{currentLevelConfig.name}特权</h3>
                      <p className="text-gray-600 mt-1">您当前享受的会员特权</p>
                    </div>
                  </div>
                  
                  <div className="lg:ml-auto flex flex-wrap gap-4">
                    {currentLevelConfig.privileges.slice(0, 4).map((privilege, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-rose-100">
                        <Gift className="w-4 h-4 text-rose-500" />
                        <span className="text-sm text-gray-700 font-medium">{privilege}</span>
                      </div>
                    ))}
                    {currentLevelConfig.discount < 1 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-xl shadow-sm">
                        <Star className="w-4 h-4 text-amber-600" />
                        <span className="text-sm text-amber-800 font-bold">购物 {currentLevelConfig.discount * 10}折</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 等级进度 Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">等级进度</h3>
                    <p className="text-sm text-gray-500">查看当前等级和升级进度</p>
                  </div>
                </div>
                <button
                  onClick={handleCheckLevel}
                  disabled={isChecking}
                  className="flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all disabled:opacity-50 font-medium shadow-lg shadow-rose-200"
                >
                  <ArrowUp className="w-5 h-5" />
                  {isChecking ? '检查中...' : '检查升级'}
                </button>
              </div>

              {levelProgress && nextLevelConfig ? (
                <div className="space-y-8">
                  {/* 等级对比 */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      {/* 当前等级 */}
                      <div className="flex items-center gap-4 p-6 bg-rose-50 rounded-2xl border-2 border-rose-200">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          currentLevelConfig.color.replace('text-', 'bg-').replace('600', '100')
                        }`}>
                          <span className="text-4xl">{currentLevelConfig.icon}</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">当前等级</p>
                          <p className="text-xl font-bold text-gray-800">{currentLevelConfig.name}</p>
                        </div>
                      </div>
                      
                      {/* 箭头 */}
                      <div className="flex items-center gap-1 px-4">
                        <div className="w-4 h-4 rounded-full bg-rose-300" />
                        <div className="w-20 h-1.5 bg-gradient-to-r from-rose-300 to-rose-400 rounded-full" />
                        <div className="w-4 h-4 rounded-full bg-rose-400" />
                        <ChevronRight className="w-8 h-8 text-rose-400" />
                      </div>
                      
                      {/* 下一等级 */}
                      <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-100">
                          <span className="text-4xl opacity-50">{nextLevelConfig.icon}</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium mb-1">下一等级</p>
                          <p className="text-xl font-bold text-gray-800">{nextLevelConfig.name}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* 距离升级 */}
                    <div className="text-center lg:text-right p-6 bg-rose-50 rounded-2xl border border-rose-200">
                      <p className="text-sm text-gray-500 mb-1">距离升级还需</p>
                      <p className="text-4xl font-bold text-rose-600">
                        {levelProgress.required - levelProgress.current}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">积分/消费</p>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="space-y-4">
                    <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                        style={{ 
                          width: animateProgress ? `${levelProgress.percentage}%` : '0%',
                        }}
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-base font-bold text-gray-600 bg-white/90 px-4 py-1.5 rounded-full shadow-sm">
                        {levelProgress.percentage.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-base px-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="w-5 h-5 text-amber-500" />
                        <span>当前：<span className="font-bold text-gray-800 text-xl">{levelProgress.current}</span> 积分</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Crown className="w-5 h-5 text-amber-500" />
                        <span>目标：<span className="font-bold text-gray-800 text-xl">{levelProgress.required}</span> 积分</span>
                      </div>
                    </div>
                  </div>

                  {/* 升级小贴士 */}
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-200 flex items-center justify-center shrink-0">
                        <Info className="w-6 h-6 text-amber-700" />
                      </div>
                      <div>
                        <p className="font-bold text-amber-800 mb-2 text-lg">升级小贴士</p>
                        <p className="text-sm text-amber-700 leading-relaxed">
                          继续购物消费或参与活动获取积分，达到 <span className="font-bold text-lg">{levelProgress.required}</span> 积分即可升级为 <span className="font-bold text-lg">{nextLevelConfig.name}</span>，享受更多专属特权！
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                  <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                    <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center shadow-lg">
                      <Crown className="w-12 h-12 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-amber-800 mb-3">🎉 恭喜！您已达到最高等级</h3>
                      <p className="text-amber-700 text-lg">作为 {currentLevelConfig.name}，您已解锁所有专属特权</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 会员权益 Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">会员等级权益</h3>
                  <p className="text-sm text-gray-500">各等级专属特权对比一览</p>
                </div>
              </div>

              {/* 等级信息卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {memberLevelConfigs.map((config, index) => {
                  const isCurrentLevel = config.level === memberInfo.memberLevel;
                  const isUnlocked = index <= memberLevelConfigs.findIndex(c => c.level === memberInfo.memberLevel);
                  
                  return (
                    <div
                      key={config.level}
                      className={`relative rounded-2xl p-6 border-2 transition-all ${
                        isCurrentLevel
                          ? 'border-rose-300 bg-gradient-to-br from-rose-50 to-white shadow-lg'
                          : isUnlocked
                          ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
                          : 'border-gray-200 bg-gray-50 opacity-70'
                      }`}
                    >
                      {isCurrentLevel && (
                        <div className="absolute -top-2 -right-2 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full shadow-lg">
                          当前等级
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-4xl mb-2">{config.icon}</div>
                        <h4 className={`font-bold ${
                          isCurrentLevel ? 'text-rose-700' : isUnlocked ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {config.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {config.minPoints > 0 ? `${config.minPoints}积分 / ¥${config.minSpent}` : '注册即享'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 权益对比表格 */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 border-b border-gray-200 min-w-40">
                          权益项目
                        </th>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          return (
                            <th 
                              key={config.level} 
                              className={`px-6 py-4 text-center text-sm font-bold border-b border-gray-200 min-w-32 ${
                                isCurrentLevel 
                                  ? 'bg-gradient-to-b from-rose-50 to-rose-100 text-rose-700' 
                                  : 'text-gray-700'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <span className="text-xl">{config.icon}</span>
                                <span>{config.name}</span>
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {/* 购物折扣 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-medium text-gray-700">购物折扣</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {config.discount < 1 ? (
                                <span className={`text-xl font-bold ${
                                  isCurrentLevel ? 'text-rose-600' : 'text-amber-600'
                                }`}>
                                  {config.discount * 10}折
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 注册即享 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">注册即享</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('注册即享');
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <span className={`text-2xl ${
                                  isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                }`}>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 生日特权 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-pink-500" />
                            <span className="text-sm font-medium text-gray-700">生日特权</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('生日特权') || config.privileges.includes('生日礼包');
                          const privilegeText = config.privileges.includes('生日礼包') ? '生日礼包' : 
                                                  config.privileges.includes('生日特权') ? '生日特权' : null;
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <div>
                                  <span className={`text-2xl ${
                                    isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                  }`}>
                                    ✓
                                  </span>
                                  {privilegeText && (
                                    <div className={`text-xs mt-1 ${
                                      isCurrentLevel ? 'text-rose-600' : 'text-green-600'
                                    }`}>
                                      {privilegeText}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 积分累计 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-medium text-gray-700">积分累计</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('积分累计');
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <span className={`text-2xl ${
                                  isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                }`}>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 积分日倍数 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">积分日倍数</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const privilege = config.privileges.find(p => p.includes('倍积分日'));
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {privilege ? (
                                <span className={`text-sm font-bold ${
                                  isCurrentLevel ? 'text-rose-600' : 'text-blue-600'
                                }`}>
                                  {privilege}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 优先客服 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-medium text-gray-700">优先客服</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('优先客服') || config.privileges.includes('专属顾问');
                          const privilegeText = config.privileges.includes('专属顾问') ? '专属顾问' : 
                                                  config.privileges.includes('优先客服') ? '优先客服' : null;
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <div>
                                  <span className={`text-2xl ${
                                    isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                  }`}>
                                    ✓
                                  </span>
                                  {privilegeText && (
                                    <div className={`text-xs mt-1 ${
                                      isCurrentLevel ? 'text-rose-600' : 'text-green-600'
                                    }`}>
                                      {privilegeText}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 专属优惠券 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Tag className="w-5 h-5 text-rose-500" />
                            <span className="text-sm font-medium text-gray-700">专属优惠券</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('专属优惠券');
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <span className={`text-2xl ${
                                  isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                }`}>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 免运费 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">免运费</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('免运费');
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <span className={`text-2xl ${
                                  isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                }`}>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 新品优先购 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-medium text-gray-700">新品优先购</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('新品优先购') || config.privileges.includes('限量款优先');
                          const privilegeText = config.privileges.includes('限量款优先') ? '限量款优先' : 
                                                  config.privileges.includes('新品优先购') ? '新品优先购' : null;
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <div>
                                  <span className={`text-2xl ${
                                    isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                  }`}>
                                    ✓
                                  </span>
                                  {privilegeText && (
                                    <div className={`text-xs mt-1 ${
                                      isCurrentLevel ? 'text-rose-600' : 'text-green-600'
                                    }`}>
                                      {privilegeText}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* VIP活动邀请 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <PartyPopper className="w-5 h-5 text-pink-500" />
                            <span className="text-sm font-medium text-gray-700">VIP活动邀请</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('VIP活动邀请');
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <span className={`text-2xl ${
                                  isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                }`}>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>

                      {/* 免费保养服务 */}
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 border-b border-gray-100">
                          <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">免费保养服务</span>
                          </div>
                        </td>
                        {memberLevelConfigs.map((config, index) => {
                          const isCurrentLevel = config.level === memberInfo.memberLevel;
                          const hasPrivilege = config.privileges.includes('免费保养服务');
                          return (
                            <td 
                              key={config.level} 
                              className={`px-6 py-4 text-center border-b border-gray-100 ${
                                isCurrentLevel ? 'bg-rose-50' : ''
                              }`}
                            >
                              {hasPrivilege ? (
                                <span className={`text-2xl ${
                                  isCurrentLevel ? 'text-rose-500' : 'text-green-500'
                                }`}>
                                  ✓
                                </span>
                              ) : (
                                <span className="text-gray-400 text-lg">-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 图例说明 */}
              <div className="flex flex-wrap items-center gap-6 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl text-green-500">✓</span>
                  <span className="text-sm text-gray-600">已解锁特权</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400">-</span>
                  <span className="text-sm text-gray-600">暂未解锁</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-rose-50 border border-rose-200 rounded"></div>
                  <span className="text-sm text-gray-600">您的当前等级</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
