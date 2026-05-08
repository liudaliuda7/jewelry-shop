'use client';

import { ReactNode } from 'react';
import UserLayoutContent from './UserLayoutContent';
import { OrderProvider } from '@/contexts/OrderContext';
import { AddressProvider } from '@/contexts/AddressContext';
import { TagProvider } from '@/contexts/TagContext';

interface UserLayoutProps {
  children: ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <OrderProvider>
      <AddressProvider>
        <TagProvider>
          <UserLayoutContent>{children}</UserLayoutContent>
        </TagProvider>
      </AddressProvider>
    </OrderProvider>
  );
}