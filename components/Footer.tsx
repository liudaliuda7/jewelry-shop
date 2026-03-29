export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Elegance</h3>
            <p className="text-gray-400 text-sm">
              专注轻奢首饰设计，让每一件首饰都成为您的独特表达。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">商品分类</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">项链</a></li>
              <li><a href="#" className="hover:text-white transition">戒指</a></li>
              <li><a href="#" className="hover:text-white transition">耳环</a></li>
              <li><a href="#" className="hover:text-white transition">手链</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">客户服务</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition">联系我们</a></li>
              <li><a href="#" className="hover:text-white transition">退换货政策</a></li>
              <li><a href="#" className="hover:text-white transition">配送说明</a></li>
              <li><a href="#" className="hover:text-white transition">常见问题</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">关注我们</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="text-sm">微信</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="text-sm">微博</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="text-sm">小红书</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 Elegance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
