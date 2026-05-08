'use client';

import { ReactNode } from 'react';
import { OrderProvider } from '@/contexts/OrderContext';
import { AddressProvider } from '@/contexts/AddressContext';

interface CheckoutLayoutProps {
  children: ReactNode;
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  return (
    <OrderProvider>
      <AddressProvider>
        {children}
      </AddressProvider>
    </OrderProvider>
  );
}
