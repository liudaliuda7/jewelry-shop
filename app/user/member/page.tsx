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
  Info
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  getMemberLevelConfig,
  memberLevelConfigs,
  MemberLevel,
  MemberLevelConfig
} from '@/types/data';

export default function MemberCenterPage() {
  const { user, getMemberInfo, getNextLevelProgress, checkAndUpdateMemberLevel } = useAuth();
  const router = useRouter();
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [levelProgress, setLevelProgress] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);

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
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`p-6 ${currentLevelConfig.bgColor} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={user.avatar}
                    alt={user.username}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                  currentLevelConfig.color.replace('text-', 'bg-').replace('600', '500')
                }`}>
                  <span className="text-white text-sm">{currentLevelConfig.icon}</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                    currentLevelConfig.bgColor
                  } ${currentLevelConfig.color}`}>
                    {currentLevelConfig.icon} {currentLevelConfig.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>加入时间：{formattedJoinDate}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <Coins className="w-3 h-3" />
                  <span>当前积分</span>
                </div>
                <div className="text-3xl font-bold text-rose-600">
                  {memberInfo.currentPoints.toLocaleString()}
                </div>
                <div className="text-xs text-rose-500 mt-1">
                  会员等级加速中
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <Award className="w-3 h-3" />
                  <span>累计消费</span>
                </div>
                <div className="text-3xl font-bold text-gray-800">
                  ¥{memberInfo.totalSpent.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  支持等级升级
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={() => router.push('/user/points')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all font-medium shadow-lg shadow-rose-200"
              >
                <Coins className="w-5 h-5" />
                <span>查看积分详情</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push('/user/profile')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/90 text-gray-700 rounded-xl hover:bg-white transition-all font-medium border"
              >
                <User className="w-5 h-5" />
                <span>完善个人信息</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">等级进度</h3>
                <p className="text-sm text-gray-500">查看当前等级和升级进度</p>
              </div>
            </div>
            <button
              onClick={handleCheckLevel}
              disabled={isChecking}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <ArrowUp className="w-4 h-4" />
              {isChecking ? '检查中...' : '检查升级'}
            </button>
          </div>

          {levelProgress && nextLevelConfig ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      currentLevelConfig.color.replace('text-', 'bg-').replace('600', '100')
                    }`}>
                      <span className="text-2xl">{currentLevelConfig.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">当前等级</p>
                      <p className="font-semibold text-gray-800">{currentLevelConfig.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-1 bg-gray-200 rounded" />
                    <div className="w-8 h-1 bg-gray-200 rounded" />
                    <div className="w-8 h-1 bg-gray-200 rounded" />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300">
                      <span className="text-2xl opacity-50">{nextLevelConfig.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">下一等级</p>
                      <p className="font-semibold text-gray-800">{nextLevelConfig.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-500">距离升级还需</p>
                  <p className="text-2xl font-bold text-rose-600">
                    {levelProgress.required - levelProgress.current}
                  </p>
                  <p className="text-xs text-gray-500">积分/消费</p>
                </div>
              </div>

              <div className="relative h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: animateProgress ? `${levelProgress.percentage}%` : '0%',
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white bg-black/20 px-2 py-0.5 rounded-full">
                  {levelProgress.percentage.toFixed(1)}%
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-gray-600">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>当前：<span className="font-semibold text-gray-800">{levelProgress.current}</span> 积分</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>目标：<span className="font-semibold text-gray-800">{levelProgress.required}</span> 积分</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium mb-1">升级小贴士</p>
                    <p>继续购物消费或参与活动获取积分，达到 {levelProgress.required} 积分即可升级为 {nextLevelConfig.name}，享受更多专属特权！</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border border-amber-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center">
                  <Crown className="w-8 h-8 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-800">🎉 恭喜！您已达到最高等级</h3>
                  <p className="text-amber-700 mt-1">作为 {currentLevelConfig.name}，您已解锁所有专属特权</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">会员等级权益</h3>
                <p className="text-sm text-gray-500">各等级专属特权一览</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberLevelConfigs.map((config, index) => {
              const isCurrentLevel = config.level === memberInfo.memberLevel;
              const isUnlocked = index <= memberLevelConfigs.findIndex(c => c.level === memberInfo.memberLevel);
              
              return (
                <div
                  key={config.level}
                  className={`relative p-5 rounded-xl border-2 transition-all ${
                    isCurrentLevel
                      ? 'border-rose-300 bg-gradient-to-br from-rose-50 to-white shadow-lg'
                      : isUnlocked
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-white'
                      : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  {isCurrentLevel && (
                    <div className="absolute -top-3 -right-3 px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full shadow-lg">
                      当前等级
                    </div>
                  )}
                  
                  {!isUnlocked && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gray-200 text-gray-500 text-xs rounded-full">
                      未解锁
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCurrentLevel
                        ? 'bg-rose-200'
                        : isUnlocked
                        ? 'bg-green-200'
                        : 'bg-gray-200'
                    }`}>
                      <span className="text-2xl">{config.icon}</span>
                    </div>
                    <div>
                      <h4 className={`font-bold ${
                        isCurrentLevel ? 'text-rose-700' : isUnlocked ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {config.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {config.minPoints > 0 ? `${config.minPoints}积分 / ¥${config.minSpent}` : '注册即享'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {config.privileges.map((privilege, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Gift className={`w-3 h-3 flex-shrink-0 ${
                          isUnlocked ? 'text-green-500' : 'text-gray-400'
                        }`} />
                        <span className={`${
                          isUnlocked ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          {privilege}
                        </span>
                      </div>
                    ))}
                  </div>

                  {config.discount < 1 && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">购物折扣</span>
                        <span className={`font-bold text-lg ${
                          isCurrentLevel ? 'text-rose-600' : isUnlocked ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {config.discount * 10}折
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push('/user/points')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <Coins className="w-7 h-7 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">我的积分</h4>
                <p className="text-sm text-gray-500 mt-1">查看积分明细和兑换</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        <button
          onClick={() => router.push('/user/orders')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Award className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">累计消费</h4>
                <p className="text-sm text-gray-500 mt-1">¥{memberInfo.totalSpent.toLocaleString()}</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
        </button>

        <button
          onClick={() => router.push('/user/profile')}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                <Star className="w-7 h-7 text-rose-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">完善信息</h4>
                <p className="text-sm text-gray-500 mt-1">设置生日获取更多特权</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      </div>
    </div>
  );
}
