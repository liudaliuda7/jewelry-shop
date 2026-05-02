'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomTag } from '@/types/data';

interface TagContextType {
  customTags: CustomTag[];
  addTag: (name: string) => void;
  deleteTag: (id: string) => void;
  clearExpiredTags: () => void;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export function useTag() {
  const context = useContext(TagContext);
  if (context === undefined) {
    throw new Error('useTag must be used within a TagProvider');
  }
  return context;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const isTagExpired = (tag: CustomTag): boolean => {
  const createdAt = new Date(tag.createdAt).getTime();
  const now = Date.now();
  return now - createdAt > SEVEN_DAYS_MS;
};

export function TagProvider({ children }: { children: ReactNode }) {
  const [customTags, setCustomTags] = useState<CustomTag[]>([]);

  const clearExpiredTags = () => {
    setCustomTags(prevTags => {
      const validTags = prevTags.filter(tag => !isTagExpired(tag));
      if (validTags.length !== prevTags.length) {
        console.log(`清除了 ${prevTags.length - validTags.length} 个过期标签`);
      }
      return validTags;
    });
  };

  useEffect(() => {
    const savedTags = localStorage.getItem('jewelry_custom_tags');
    if (savedTags) {
      try {
        const parsedTags: CustomTag[] = JSON.parse(savedTags);
        const validTags = parsedTags.filter(tag => !isTagExpired(tag));
        setCustomTags(validTags);
        if (validTags.length !== parsedTags.length) {
          localStorage.setItem('jewelry_custom_tags', JSON.stringify(validTags));
          console.log(`清除了 ${parsedTags.length - validTags.length} 个过期标签`);
        }
      } catch (e) {
        console.error('Failed to parse custom tags from localStorage:', e);
        setCustomTags([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('jewelry_custom_tags', JSON.stringify(customTags));
  }, [customTags]);

  useEffect(() => {
    const interval = setInterval(clearExpiredTags, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const addTag = (name: string) => {
    if (!name.trim()) return;
    
    const isDuplicate = customTags.some(tag => 
      tag.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      console.log('标签已存在');
      return;
    }

    const now = new Date().toISOString();
    const newTag: CustomTag = {
      id: `tag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      createdAt: now,
    };

    setCustomTags(prev => [...prev, newTag]);
  };

  const deleteTag = (id: string) => {
    setCustomTags(prev => prev.filter(tag => tag.id !== id));
  };

  const value = {
    customTags,
    addTag,
    deleteTag,
    clearExpiredTags,
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
}
