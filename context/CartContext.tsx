'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number, material: string, color: string, size: string) => void;
  removeFromCart: (productId: string, material: string, color: string, size: string) => void;
  updateQuantity: (productId: string, material: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number, material: string, color: string, size: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id &&
                item.selectedMaterial === material &&
                item.selectedColor === color &&
                item.selectedSize === size
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex].quantity += quantity;
        return newItems;
      }

      return [...prev, { product, quantity, selectedMaterial: material, selectedColor: color, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string, material: string, color: string, size: string) => {
    setItems(prev => prev.filter(
      item => !(item.product.id === productId &&
                item.selectedMaterial === material &&
                item.selectedColor === color &&
                item.selectedSize === size)
    ));
  };

  const updateQuantity = (productId: string, material: string, color: string, size: string, quantity: number) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === productId &&
          item.selectedMaterial === material &&
          item.selectedColor === color &&
          item.selectedSize === size) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
