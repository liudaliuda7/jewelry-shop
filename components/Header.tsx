'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, X, Search } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link href="/" className="text-2xl font-bold text-gray-900 ml-2 md:ml-0">
              Elegance
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition">
              首页
            </Link>
            <Link href="/products?category=necklace" className="text-gray-700 hover:text-gray-900 transition">
              项链
            </Link>
            <Link href="/products?category=ring" className="text-gray-700 hover:text-gray-900 transition">
              戒指
            </Link>
            <Link href="/products?category=earring" className="text-gray-700 hover:text-gray-900 transition">
              耳环
            </Link>
            <Link href="/products?category=bracelet" className="text-gray-700 hover:text-gray-900 transition">
              手链
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-gray-900"
            >
              <Search size={20} />
            </button>
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-gray-900">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {isSearchOpen && (
          <div className="py-4 border-t">
            <input
              type="text"
              placeholder="搜索商品..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        )}
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <nav className="px-4 py-2 space-y-2">
            <Link href="/" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
              首页
            </Link>
            <Link href="/products?category=necklace" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
              项链
            </Link>
            <Link href="/products?category=ring" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
              戒指
            </Link>
            <Link href="/products?category=earring" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
              耳环
            </Link>
            <Link href="/products?category=bracelet" className="block py-2 text-gray-700" onClick={() => setIsMenuOpen(false)}>
              手链
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
