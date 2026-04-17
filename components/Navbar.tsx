'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { categories } from '@/types/data';
import { useCart } from '@/contexts/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const [displayCount, setDisplayCount] = useState(cartCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFirstShow, setIsFirstShow] = useState(false);
  const prevCountRef = useRef(cartCount);

  useEffect(() => {
    if (cartCount !== prevCountRef.current) {
      if (prevCountRef.current === 0 && cartCount > 0) {
        setIsFirstShow(true);
        setTimeout(() => setIsFirstShow(false), 500);
      } else if (cartCount > 0) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
      }
      setDisplayCount(cartCount);
      prevCountRef.current = cartCount;
    }
  }, [cartCount]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-rose-600">
            ✨ 璀璨首饰
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="text-gray-700 hover:text-rose-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products"
              className="text-gray-700 hover:text-rose-600 transition-colors"
            >
              全部商品
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-rose-600 transition-colors" />
              {displayCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ${
                    isFirstShow
                      ? 'animate-count-pop'
                      : isAnimating
                      ? 'animate-count-update'
                      : ''
                  }`}
                >
                  {displayCount > 99 ? '99+' : displayCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="block py-2 text-gray-700 hover:text-rose-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
            <Link
              href="/products"
              className="block py-2 text-gray-700 hover:text-rose-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              全部商品
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
