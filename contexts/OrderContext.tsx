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
  clearExpiredOrders: () => void;
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

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const isOrderExpired = (order: Order): boolean => {
  const createdAt = new Date(order.createdAt).getTime();
  const now = Date.now();
  return now - createdAt > SEVEN_DAYS_MS;
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const clearExpiredOrders = () => {
    setOrders(prevOrders => {
      const validOrders = prevOrders.filter(order => !isOrderExpired(order));
      if (validOrders.length !== prevOrders.length) {
        console.log(`清除了 ${prevOrders.length - validOrders.length} 个过期订单`);
      }
      return validOrders;
    });
  };

  useEffect(() => {
    const savedOrders = localStorage.getItem('jewelry_orders');
    if (savedOrders) {
      try {
        const parsedOrders: Order[] = JSON.parse(savedOrders);
        const validOrders = parsedOrders.filter(order => !isOrderExpired(order));
        setOrders(validOrders);
        if (validOrders.length !== parsedOrders.length) {
          localStorage.setItem('jewelry_orders', JSON.stringify(validOrders));
          console.log(`清除了 ${parsedOrders.length - validOrders.length} 个过期订单`);
        }
      } catch (e) {
        console.error('Failed to parse orders from localStorage:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jewelry_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    const interval = setInterval(clearExpiredOrders, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
    clearExpiredOrders,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
