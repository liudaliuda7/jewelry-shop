export default function BrandStory() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">品牌故事</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&h=600&fit=crop"
              alt="品牌故事"
              className="rounded-lg w-full"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">Elegance 优雅</h3>
            <p className="text-gray-600 leading-relaxed">
              Elegance 创立于2018年，致力于为现代女性设计精致优雅的轻奢首饰。
              我们相信，每一件首饰都承载着佩戴者的独特故事和情感。
            </p>
            <p className="text-gray-600 leading-relaxed">
              从选材到设计，从工艺到细节，我们始终坚持精益求精的态度，
              力求将每一件首饰都打造成为艺术品。无论是日常佩戴还是特殊场合，
              Elegance 都能为您增添独特的魅力。
            </p>
            <div className="pt-4">
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
