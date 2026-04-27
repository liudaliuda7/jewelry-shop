'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Address, AddressTag } from '@/types/data';

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
  getAddressById: (id: string) => Address | undefined;
  clearExpiredAddresses: () => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function useAddress() {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const isAddressExpired = (address: Address): boolean => {
  const createdAt = new Date(address.createdAt).getTime();
  const now = Date.now();
  return now - createdAt > SEVEN_DAYS_MS;
};

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const clearExpiredAddresses = () => {
    setAddresses(prevAddresses => {
      const validAddresses = prevAddresses.filter(address => !isAddressExpired(address));
      if (validAddresses.length !== prevAddresses.length) {
        console.log(`清除了 ${prevAddresses.length - validAddresses.length} 个过期地址`);
      }
      return validAddresses;
    });
  };

  useEffect(() => {
    const savedAddresses = localStorage.getItem('jewelry_addresses');
    if (savedAddresses) {
      try {
        const parsedAddresses: Address[] = JSON.parse(savedAddresses);
        const validAddresses = parsedAddresses.filter(address => !isAddressExpired(address));
        setAddresses(validAddresses);
        if (validAddresses.length !== parsedAddresses.length) {
          localStorage.setItem('jewelry_addresses', JSON.stringify(validAddresses));
          console.log(`清除了 ${parsedAddresses.length - validAddresses.length} 个过期地址`);
        }
      } catch (e) {
        console.error('Failed to parse addresses from localStorage:', e);
        setAddresses([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jewelry_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    const interval = setInterval(clearExpiredAddresses, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses);
  };

  const addAddress = (addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newAddress: Address = {
      ...addressData,
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: '',
      createdAt: now,
      updatedAt: now,
    };

    setAddresses(prev => {
      let updatedAddresses = [...prev, newAddress];
      
      if (newAddress.isDefault || prev.length === 0) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === newAddress.id,
        }));
      }
      
      saveAddresses(updatedAddresses);
      return updatedAddresses;
    });
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    const now = new Date().toISOString();
    
    setAddresses(prev => {
      let updatedAddresses = prev.map(addr => 
        addr.id === id 
          ? { ...addr, ...updates, updatedAt: now } 
          : addr
      );

      if (updates.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: addr.id === id,
        }));
      }
      
      saveAddresses(updatedAddresses);
      return updatedAddresses;
    });
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const addressToDelete = prev.find(addr => addr.id === id);
      let updatedAddresses = prev.filter(addr => addr.id !== id);
      
      if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      saveAddresses(updatedAddresses);
      return updatedAddresses;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => {
      const updatedAddresses = prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }));
      saveAddresses(updatedAddresses);
      return updatedAddresses;
    });
  };

  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault);
  };

  const getAddressById = (id: string) => {
    return addresses.find(addr => addr.id === id);
  };

  const value = {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    getAddressById,
    clearExpiredAddresses,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}
