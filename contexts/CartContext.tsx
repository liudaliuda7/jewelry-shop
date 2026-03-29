'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, SKU } from '@/types/data';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, sku: SKU, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // 从localStorage加载购物车数据
  useEffect(() => {
    const savedCart = localStorage.getItem('jewelry-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // 保存购物车数据到localStorage
  useEffect(() => {
    localStorage.setItem('jewelry-cart', JSON.stringify(cart));
  }, [cart]);

  // 添加商品到购物车
  const addToCart = (product: Product, sku: SKU, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.sku.id === sku.id
      );

      if (existingItemIndex !== -1) {
        // 商品已存在，增加数量
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
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
      cartCount
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