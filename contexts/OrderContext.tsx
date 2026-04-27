'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, PaymentMethod, OrderItem, OrderAddress } from '@/types/data';

interface OrderContextType {
  orders: Order[];
  createOrder: (
    items: OrderItem[],
    totalAmount: number,
    paymentMethod: PaymentMethod,
    address: OrderAddress,
    userId: string
  ) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByUserId: (userId: string) => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

const generateOrderNo = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD${timestamp}${random}`;
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedOrders = localStorage.getItem('jewelry_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error('Failed to parse orders from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jewelry_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (
    items: OrderItem[],
    totalAmount: number,
    paymentMethod: PaymentMethod,
    address: OrderAddress,
    userId: string
  ): Order => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderNo: generateOrderNo(),
      userId,
      items,
      totalAmount,
      status: 'paid',
      paymentMethod,
      address,
      createdAt: now,
      paidAt: now,
    };

    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByUserId = (userId: string): Order[] => {
    return orders.filter(order => order.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const updateOrderStatus = (orderId: string, status: Order['status']): void => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const value = {
    orders,
    createOrder,
    getOrderById,
    getOrdersByUserId,
    updateOrderStatus,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
