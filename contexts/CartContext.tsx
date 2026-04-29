'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, SKU } from '@/types/data';

interface CartStorage {
  items: CartItem[];
  updatedAt: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, sku: SKU, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  clearExpiredCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const isCartExpired = (cartStorage: CartStorage): boolean => {
  const updatedAt = new Date(cartStorage.updatedAt).getTime();
  const now = Date.now();
  return now - updatedAt > SEVEN_DAYS_MS;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const clearExpiredCart = () => {
    setCart([]);
  };

  // 从localStorage加载购物车数据
  useEffect(() => {
    const savedCart = localStorage.getItem('jewelry-cart');
    if (savedCart) {
      try {
        const parsedData = JSON.parse(savedCart);
        if (parsedData && typeof parsedData === 'object' && 'items' in parsedData) {
          const cartStorage = parsedData as CartStorage;
          if (!isCartExpired(cartStorage)) {
            setCart(cartStorage.items);
          } else {
            console.log('购物车已过期，已清除');
            localStorage.removeItem('jewelry-cart');
          }
        } else {
          const oldCart = parsedData as CartItem[];
          const now = new Date().toISOString();
          const cartStorage: CartStorage = {
            items: oldCart,
            updatedAt: now
          };
          localStorage.setItem('jewelry-cart', JSON.stringify(cartStorage));
          setCart(oldCart);
        }
      } catch (e) {
        console.error('Failed to parse cart from localStorage:', e);
        setCart([]);
      }
    }
  }, []);

  // 保存购物车数据到localStorage
  useEffect(() => {
    const now = new Date().toISOString();
    const cartStorage: CartStorage = {
      items: cart,
      updatedAt: now
    };
    localStorage.setItem('jewelry-cart', JSON.stringify(cartStorage));
  }, [cart]);

  // 每小时检查一次过期
  useEffect(() => {
    const checkExpired = () => {
      const savedCart = localStorage.getItem('jewelry-cart');
      if (savedCart) {
        try {
          const parsedData = JSON.parse(savedCart);
          if (parsedData && typeof parsedData === 'object' && 'items' in parsedData) {
            const cartStorage = parsedData as CartStorage;
            if (isCartExpired(cartStorage)) {
              console.log('购物车已过期，已清除');
              localStorage.removeItem('jewelry-cart');
              setCart([]);
            }
          }
        } catch (e) {
          console.error('Failed to check cart expiration:', e);
        }
      }
    };

    const interval = setInterval(checkExpired, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 添加商品到购物车
  const addToCart = (product: Product, sku: SKU, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.sku.id === sku.id
      );

      if (existingItemIndex !== -1) {
        // 商品已存在，增加数量
        // 使用不可变更新：创建新对象而不是修改现有对象
        return prevCart.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + quantity
            };
          }
          return item;
        });
      } else {
        // 添加新商品
        return [...prevCart, {
          id: `${product.id}-${sku.id}-${Date.now()}`,
          product,
          sku,
          quantity
        }];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (cartItemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
  };

  // 更新商品数量
  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prevCart => prevCart.map(item =>
      item.id === cartItemId ? { ...item, quantity } : item
    ));
  };

  // 清空购物车
  const clearCart = () => {
    setCart([]);
  };

  // 计算购物车总价
  const cartTotal = cart.reduce((total, item) => total + item.sku.price * item.quantity, 0);

  // 计算购物车商品总数
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      clearExpiredCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}