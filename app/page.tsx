import Banner from '@/components/Banner';
import CategoryNav from '@/components/CategoryNav';
import ProductCard from '@/components/ProductCard';
import BrandStory from '@/components/BrandStory';
import { getHotProducts, getNewProducts } from '@/data/mockData';

export default function HomePage() {
  const hotProducts = getHotProducts();
  const newProducts = getNewProducts();

  return (
    <div>
      <Banner />
      <CategoryNav />

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">热销商品</h2>
            <a href="/products" className="text-rose-500 hover:underline">查看更多 →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {hotProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">新品上市</h2>
            <a href="/products" className="text-rose-500 hover:underline">查看更多 →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <BrandStory />

      <section className="py-12 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">加入我们的会员</h2>
          <p className="text-gray-600 mb-8">注册会员即可享受专属优惠和新品预览</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="请输入您的邮箱"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition">
              立即注册
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
