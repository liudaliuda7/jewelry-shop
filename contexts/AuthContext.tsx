'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MemberLevel,
  MemberInfo,
  PointsTransaction,
  PointsTransactionType,
  PointsSource,
  getMemberLevelByPoints,
  getMemberLevelConfig,
  memberLevelConfigs,
  INITIAL_SIGNUP_POINTS,
  calculatePointsExpirationDate,
  calculatePurchasePoints
} from '@/types/data';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
  birthday?: string;
  memberLevel: MemberLevel;
  currentPoints: number;
  totalPoints: number;
  totalSpent: number;
  joinDate: string;
  lastUpgradeDate?: string;
}

export interface AuthUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addPoints: (amount: number, source: PointsSource, description: string, relatedOrderId?: string) => void;
  spendPoints: (amount: number, description: string, relatedOrderId?: string) => boolean;
  getPointsTransactions: () => PointsTransaction[];
  checkAndUpdateMemberLevel: () => void;
  getMemberInfo: () => MemberInfo | null;
  getNextLevelProgress: () => { current: number; required: number; percentage: number } | null;
  isLoginExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USERS = 'jewelry-shop-users';
const STORAGE_KEY_CURRENT_USER = 'jewelry-shop-current-user';
const STORAGE_KEY_POINTS_TRANSACTIONS = 'jewelry-shop-points-transactions';
const STORAGE_KEY_LOGIN_TIMESTAMP = 'jewelry-shop-login-timestamp';

const LOGIN_EXPIRATION_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function generateAvatar(username: string): string {
  const initial = username.charAt(0).toUpperCase();
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8'];
  const colorIndex = Math.abs(username.charCodeAt(0)) % colors.length;
  const bgColor = colors[colorIndex];
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=${bgColor}&color=fff&size=128`;
}

function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

function migrateUserData(user: any): User {
  const now = getCurrentTimestamp();
  
  return {
    ...user,
    memberLevel: user.memberLevel || 'regular',
    currentPoints: user.currentPoints || 0,
    totalPoints: user.totalPoints || 0,
    totalSpent: user.totalSpent || 0,
    joinDate: user.joinDate || now,
  };
}

function getUsersFromStorage(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY_USERS);
  if (!saved) return [];
  
  const users = JSON.parse(saved);
  return users.map((user: any) => migrateUserData(user) as AuthUser);
}

function saveUsersToStorage(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function getCurrentUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
  if (!saved) return null;
  
  const parsedUser = JSON.parse(saved);
  return migrateUserData(parsedUser);
}

function saveCurrentUserToStorage(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEY_LOGIN_TIMESTAMP, getCurrentTimestamp());
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
    localStorage.removeItem(STORAGE_KEY_LOGIN_TIMESTAMP);
  }
}

function getPointsTransactionsFromStorage(): PointsTransaction[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY_POINTS_TRANSACTIONS);
  return saved ? JSON.parse(saved) : [];
}

function savePointsTransactionsToStorage(transactions: PointsTransaction[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_POINTS_TRANSACTIONS, JSON.stringify(transactions));
}

function isLoginExpired(): boolean {
  if (typeof window === 'undefined') return true;
  const loginTimestamp = localStorage.getItem(STORAGE_KEY_LOGIN_TIMESTAMP);
  if (!loginTimestamp) return true;
  
  const loginTime = new Date(loginTimestamp).getTime();
  const currentTime = new Date().getTime();
  const elapsedDays = (currentTime - loginTime) / MS_PER_DAY;
  
  return elapsedDays >= LOGIN_EXPIRATION_DAYS;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = getCurrentUserFromStorage();
    
    if (savedUser) {
      if (isLoginExpired()) {
        saveCurrentUserToStorage(null);
        setUser(null);
      } else {
        setUser(savedUser);
      }
    }
    
    setIsInitialized(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsersFromStorage();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      saveCurrentUserToStorage(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = getUsersFromStorage();
    
    if (users.find(u => u.email === email)) {
      return false;
    }

    const now = getCurrentTimestamp();
    const newUser: AuthUser = {
      id: generateId(),
      username,
      email,
      password,
      avatar: generateAvatar(username),
      memberLevel: 'regular',
      currentPoints: INITIAL_SIGNUP_POINTS,
      totalPoints: INITIAL_SIGNUP_POINTS,
      totalSpent: 0,
      joinDate: now,
    };

    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);

    const welcomeTransaction: PointsTransaction = {
      id: generateId(),
      userId: newUser.id,
      amount: INITIAL_SIGNUP_POINTS,
      type: 'bonus',
      source: 'signup',
      description: '新会员注册赠送积分',
      balance: INITIAL_SIGNUP_POINTS,
      createdAt: now,
      expiresAt: calculatePointsExpirationDate(now),
    };
    
    const transactions = getPointsTransactionsFromStorage();
    savePointsTransactionsToStorage([...transactions, welcomeTransaction]);

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    saveCurrentUserToStorage(userWithoutPassword);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    saveCurrentUserToStorage(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    saveCurrentUserToStorage(updatedUser);

    const users = getUsersFromStorage();
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...updates } : u
    );
    saveUsersToStorage(updatedUsers);
  };

  const addPoints = (
    amount: number, 
    source: PointsSource, 
    description: string, 
    relatedOrderId?: string
  ) => {
    if (!user) return;

    const now = getCurrentTimestamp();
    const pointsToAdd = calculatePurchasePoints(amount, user.memberLevel);
    
    const updatedUser: User = {
      ...user,
      currentPoints: user.currentPoints + pointsToAdd,
      totalPoints: user.totalPoints + pointsToAdd,
    };

    const transaction: PointsTransaction = {
      id: generateId(),
      userId: user.id,
      amount: pointsToAdd,
      type: 'earn',
      source,
      description,
      balance: updatedUser.currentPoints,
      createdAt: now,
      expiresAt: calculatePointsExpirationDate(now),
      relatedOrderId,
    };

    setUser(updatedUser);
    saveCurrentUserToStorage(updatedUser);

    const users = getUsersFromStorage();
    const updatedUsers = users.map(u => 
      u.id === user.id ? updatedUser as AuthUser : u
    );
    saveUsersToStorage(updatedUsers);

    const transactions = getPointsTransactionsFromStorage();
    savePointsTransactionsToStorage([...transactions, transaction]);

    checkAndUpdateMemberLevelInternal(updatedUser);
  };

  const spendPoints = (
    amount: number, 
    description: string, 
    relatedOrderId?: string
  ): boolean => {
    if (!user || user.currentPoints < amount) {
      return false;
    }

    const now = getCurrentTimestamp();
    const updatedUser: User = {
      ...user,
      currentPoints: user.currentPoints - amount,
    };

    const transaction: PointsTransaction = {
      id: generateId(),
      userId: user.id,
      amount: -amount,
      type: 'spend',
      source: 'exchange',
      description,
      balance: updatedUser.currentPoints,
      createdAt: now,
      relatedOrderId,
    };

    setUser(updatedUser);
    saveCurrentUserToStorage(updatedUser);

    const users = getUsersFromStorage();
    const updatedUsers = users.map(u => 
      u.id === user.id ? updatedUser as AuthUser : u
    );
    saveUsersToStorage(updatedUsers);

    const transactions = getPointsTransactionsFromStorage();
    savePointsTransactionsToStorage([...transactions, transaction]);

    return true;
  };

  const getPointsTransactions = (): PointsTransaction[] => {
    if (!user) return [];
    const transactions = getPointsTransactionsFromStorage();
    return transactions
      .filter(t => t.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const checkAndUpdateMemberLevelInternal = (currentUser: User) => {
    const newLevel = getMemberLevelByPoints(currentUser.totalPoints, currentUser.totalSpent);
    
    if (newLevel !== currentUser.memberLevel) {
      const now = getCurrentTimestamp();
      const updatedUser: User = {
        ...currentUser,
        memberLevel: newLevel,
        lastUpgradeDate: now,
      };

      setUser(updatedUser);
      saveCurrentUserToStorage(updatedUser);

      const users = getUsersFromStorage();
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? updatedUser as AuthUser : u
      );
      saveUsersToStorage(updatedUsers);

      const levelConfig = getMemberLevelConfig(newLevel);
      const upgradeTransaction: PointsTransaction = {
        id: generateId(),
        userId: currentUser.id,
        amount: 0,
        type: 'bonus',
        source: 'activity',
        description: `恭喜升级为${levelConfig.name}！`,
        balance: updatedUser.currentPoints,
        createdAt: now,
      };

      const transactions = getPointsTransactionsFromStorage();
      savePointsTransactionsToStorage([...transactions, upgradeTransaction]);
    }
  };

  const checkAndUpdateMemberLevel = () => {
    if (!user) return;
    checkAndUpdateMemberLevelInternal(user);
  };

  const getMemberInfo = (): MemberInfo | null => {
    if (!user) return null;
    
    return {
      userId: user.id,
      currentPoints: user.currentPoints,
      totalPoints: user.totalPoints,
      totalSpent: user.totalSpent,
      memberLevel: user.memberLevel,
      joinDate: user.joinDate,
      lastUpgradeDate: user.lastUpgradeDate,
      birthday: user.birthday,
      phone: user.phone,
      address: user.address,
    };
  };

  const getNextLevelProgress = () => {
    if (!user) return null;
    
    const sortedConfigs = [...memberLevelConfigs].sort((a, b) => a.minPoints - b.minPoints);
    
    const currentIndex = sortedConfigs.findIndex(c => c.level === user.memberLevel);
    
    if (currentIndex >= sortedConfigs.length - 1) {
      return null;
    }
    
    const nextConfig = sortedConfigs[currentIndex + 1];
    const currentProgress = Math.max(user.totalPoints, user.totalSpent);
    const requiredProgress = Math.max(nextConfig.minPoints, nextConfig.minSpent);
    const percentage = Math.min((currentProgress / requiredProgress) * 100, 100);
    
    return {
      current: currentProgress,
      required: requiredProgress,
      percentage,
    };
  };

  const isLoginExpiredCheck = (): boolean => {
    return isLoginExpired();
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      addPoints,
      spendPoints,
      getPointsTransactions,
      checkAndUpdateMemberLevel,
      getMemberInfo,
      getNextLevelProgress,
      isLoginExpired: isLoginExpiredCheck,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
