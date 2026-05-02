'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  LogIn, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import { categories, products, Product, Category } from '@/types/data';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface SubCategory {
  id: string;
  name: string;
}

interface CategoryDropdownData {
  category: Category;
  subCategories: SubCategory[];
  hotProducts: Product[];
}

function getCategoryDropdownData(categoryId: string): CategoryDropdownData | null {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return null;

  const categoryProducts = products.filter(p => p.category === categoryId);
  const uniqueStyles = [...new Set(categoryProducts.map(p => p.style))];
  
  const subCategories: SubCategory[] = uniqueStyles.map((style, index) => ({
    id: `${categoryId}-style-${index}`,
    name: style
  }));

  const hotProducts = categoryProducts
    .filter(p => p.isHot)
    .slice(0, 4);

  return {
    category,
    subCategories,
    hotProducts
  };
}

interface NavDropdownProps {
  categoryId: string;
  isOpen: boolean;
  isAnimating: boolean;
}

function NavDropdown({ categoryId, isOpen, isAnimating }: NavDropdownProps) {
  const dropdownData = getCategoryDropdownData(categoryId);
  
  if (!dropdownData) return null;
  
  const { category, subCategories, hotProducts } = dropdownData;

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[720px] z-50 ${
        isOpen ? 'animate-dropdown-in' : 'animate-dropdown-out pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex">
          <div className="w-1/3 bg-gray-50 p-6 border-r border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              {category.icon} {category.name}
            </h3>
            <ul className="space-y-1">
              {subCategories.map((sub) => (
                <li key={sub.id}>
                  <Link
                    href={`/products?category=${categoryId}&style=${encodeURIComponent(sub.name)}`}
                    className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-rose-600 hover:bg-white rounded-md transition-colors group"
                  >
                    <span>{sub.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
              <li className="pt-2 mt-2 border-t border-gray-200">
                <Link
                  href={`/products?category=${categoryId}`}
                  className="flex items-center justify-between px-3 py-2 text-sm font-medium text-rose-600 hover:bg-white rounded-md transition-colors"
                >
                  查看全部 {category.name}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </li>
            </ul>
          </div>

          <div className="w-2/3 p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4">
              热门推荐
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {hotProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-gray-800 font-medium truncate group-hover:text-rose-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {product.style} · {product.material}
                    </p>
                    <p className="text-sm font-semibold text-rose-600 mt-1">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {hotProducts.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                暂无热门商品
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [animationKey, setAnimationKey] = useState(0);
  const [isFirstShow, setIsFirstShow] = useState(false);
  const prevCountRef = useRef(cartCount);
  const isFirstMount = useRef(true);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isDropdownAnimating, setIsDropdownAnimating] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      prevCountRef.current = cartCount;
      return;
    }

    if (cartCount !== prevCountRef.current) {
      const wasZero = prevCountRef.current === 0;
      const nowPositive = cartCount > 0;
      
      setAnimationKey((prev) => prev + 1);
      
      if (wasZero && nowPositive) {
        setIsFirstShow(true);
        setTimeout(() => setIsFirstShow(false), 700);
      }
      
      prevCountRef.current = cartCount;
    }
  }, [cartCount]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (categoryId: string) => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    
    if (hoveredCategory !== categoryId) {
      setIsDropdownAnimating(true);
    }
    
    setHoveredCategory(categoryId);
  };

  const handleMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setIsDropdownAnimating(true);
      setTimeout(() => {
        setHoveredCategory(null);
        setIsDropdownAnimating(false);
      }, 150);
    }, 100);
  };

  const shouldAnimate = animationKey > 0 && cartCount > 0;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold text-rose-600">
            ✨ 璀璨首饰
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={`/products?category=${cat.id}`}
                  className={`flex items-center gap-1 py-4 text-gray-700 hover:text-rose-600 transition-colors ${
                    hoveredCategory === cat.id ? 'text-rose-600' : ''
                  }`}
                >
                  {cat.name}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    hoveredCategory === cat.id ? 'rotate-180' : ''
                  }`} />
                </Link>
                <NavDropdown 
                  categoryId={cat.id} 
                  isOpen={hoveredCategory === cat.id}
                  isAnimating={isDropdownAnimating && hoveredCategory === cat.id}
                />
              </div>
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
              {cartCount > 0 && (
                <span
                  key={animationKey}
                  className={`absolute -top-2 -right-2 bg-rose-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium ${
                    shouldAnimate
                      ? isFirstShow
                        ? 'animate-count-pop'
                        : 'animate-count-update'
                      : ''
                  }`}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div 
                className="relative" 
                ref={userMenuRef}
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-rose-200">
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full pt-2 w-48 z-50">
                    <div className="bg-white rounded-lg shadow-lg border">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-800">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/user/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>我的订单</span>
                        </Link>
                      </div>
                      <div className="py-1 border-t">
                        <Link
                          href="/user/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>个人设置</span>
                        </Link>
                      </div>
                      <div className="py-1 border-t mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>退出登录</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </Link>
            )}

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
            
            {user ? (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-3 px-2 py-2">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-gray-700 hover:text-rose-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>个人设置</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-2 py-2 text-red-600 hover:text-red-700 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 text-rose-600 hover:text-rose-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>登录 / 注册</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}