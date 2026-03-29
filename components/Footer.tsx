import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div>
            <h3 className="text-xl font-bold text-rose-400 mb-4">✨ 璀璨首饰</h3>
            <p className="text-gray-400 text-sm">
              专注于轻奢首饰设计，为现代女性打造独特的时尚配饰。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-rose-400 transition-colors">
                  全部商品
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-rose-400 transition-colors">
                  购物车
                </Link>
              </li>
            </ul>
          </div>

          {/* 分类 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">商品分类</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/products?category=necklace" className="hover:text-rose-400 transition-colors">
                  项链
                </Link>
              </li>
              <li>
                <Link href="/products?category=ring" className="hover:text-rose-400 transition-colors">
                  戒指
                </Link>
              </li>
              <li>
                <Link href="/products?category=earring" className="hover:text-rose-400 transition-colors">
                  耳环
                </Link>
              </li>
              <li>
                <Link href="/products?category=bracelet" className="hover:text-rose-400 transition-colors">
                  手链
                </Link>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 service@cuican.com</li>
              <li>📱 400-888-8888</li>
              <li>📍 上海市静安区南京西路1266号</li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2024 璀璨首饰. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}