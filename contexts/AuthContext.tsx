'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  phone?: string;
  address?: string;
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USERS = 'jewelry-shop-users';
const STORAGE_KEY_CURRENT_USER = 'jewelry-shop-current-user';

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

function getUsersFromStorage(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(STORAGE_KEY_USERS);
  return saved ? JSON.parse(saved) : [];
}

function saveUsersToStorage(users: AuthUser[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
}

function getCurrentUserFromStorage(): User | null {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
  return saved ? JSON.parse(saved) : null;
}

function saveCurrentUserToStorage(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedUser = getCurrentUserFromStorage();
    setUser(savedUser);
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

    const newUser: AuthUser = {
      id: generateId(),
      username,
      email,
      password,
      avatar: generateAvatar(username),
    };

    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);

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
