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
  Crown
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

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    setMemberInfo(getMemberInfo());
    setLevelProgress(getNextLevelProgress());
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className={`relative p-6 ${currentLevelConfig.bgColor}`}>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={user.avatar}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                currentLevelConfig.color.replace('text-', 'bg-').replace('600', '500')
              } shadow-lg`}>
                <span className="text-white text-sm">{currentLevelConfig.icon}</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentLevelConfig.bgColor
                } ${currentLevelConfig.color} border`}>
                  {currentLevelConfig.icon} {currentLevelConfig.name}
                </span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>加入时间：{formattedJoinDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  <span>当前积分：<span className="font-semibold text-rose-600">{memberInfo.currentPoints}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>累计消费：<span className="font-semibold text-gray-800">¥{memberInfo.totalSpent.toLocaleString()}</span></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/user/points')}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-lg shadow-sm transition-all text-rose-600 font-medium"
            >
              <Coins className="w-4 h-4" />
              <span>查看积分</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {levelProgress && nextLevelConfig ? (
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentLevelConfig.icon}</span>
                  <span className="font-medium text-gray-700">{currentLevelConfig.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{nextLevelConfig.icon}</span>
                  <span className="font-medium text-gray-700">{nextLevelConfig.name}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                还需 <span className="font-semibold text-rose-600">{levelProgress.required - levelProgress.current}</span> 积分/消费
              </div>
            </div>
            
            <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress.percentage}%` }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 font-medium">
                {levelProgress.percentage.toFixed(1)}%
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                <span>当前：{levelProgress.current} 积分</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown className="w-3 h-3" />
                <span>目标：{levelProgress.required} 积分</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-amber-50 border-t">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">恭喜！您已达到最高等级</h3>
                <p className="text-sm text-gray-600 mt-1">作为钻石会员，您已解锁所有专属特权</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Award className="w-5 h-5 text-rose-600" />
            会员等级权益
          </h3>
          <button
            onClick={handleCheckLevel}
            disabled={isChecking}
            className="flex items-center gap-1 px-3 py-1 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowUp className="w-4 h-4" />
            {isChecking ? '检查中...' : '检查升级'}
          </button>
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
                    ? 'border-rose-300 bg-rose-50 shadow-md'
                    : isUnlocked
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                {isCurrentLevel && (
                  <div className="absolute -top-3 -right-3 px-2 py-1 bg-rose-600 text-white text-xs font-medium rounded-full">
                    当前等级
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{config.icon}</span>
                  <div>
                    <h4 className={`font-semibold ${
                      isCurrentLevel ? 'text-rose-700' : isUnlocked ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {config.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {config.minPoints > 0 ? `${config.minPoints}积分 / ¥${config.minSpent}` : '注册即享'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {config.privileges.map((privilege, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <Gift className={`w-3 h-3 ${
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
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">购物折扣</span>
                      <span className={`font-bold ${
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push('/user/points')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <Coins className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">我的积分</h4>
                <p className="text-sm text-gray-500 mt-1">查看积分明细和兑换</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => router.push('/user/orders')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">累计消费</h4>
                <p className="text-sm text-gray-500 mt-1">¥{memberInfo.totalSpent.toLocaleString()}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
          </div>
        </button>

        <button
          onClick={() => router.push('/user/profile')}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                <Star className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">完善信息</h4>
                <p className="text-sm text-gray-500 mt-1">设置生日获取更多特权</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-rose-600 transition-colors" />
          </div>
        </button>
      </div>
    </div>
  );
}
