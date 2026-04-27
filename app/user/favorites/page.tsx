'use client';

import { useRouter } from 'next/navigation';
import { Heart, ArrowRight } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">我的收藏</h3>
        <p className="text-gray-500 text-sm">查看您收藏的商品</p>
      </div>

      <div className="text-center py-16">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-gray-300" />
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">暂无收藏</h4>
        <p className="text-gray-500 mb-8">您还没有收藏任何商品</p>
        <button
          onClick={() => router.push('/products')}
          className="inline-flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
        >
          去逛逛
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
