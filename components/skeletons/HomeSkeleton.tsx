import Skeleton from '@/components/ui/skeleton';

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 轮播图骨架 */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* 分类导航骨架 */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <Skeleton variant="text" className="h-8 w-32 mx-auto mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Skeleton className="w-full h-full" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Skeleton variant="circular" className="w-10 h-10 mb-2" />
                <Skeleton variant="text" className="w-20 h-5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 热门商品骨架 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <Skeleton variant="text" className="h-8 w-40 mx-auto mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 品牌故事骨架 */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <Skeleton variant="text" className="h-8 w-40 mx-auto mb-8" />
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <Skeleton className="aspect-video w-full" />
            <div className="space-y-4">
              <Skeleton variant="text" className="w-full h-5" />
              <Skeleton variant="text" className="w-11/12 h-5" />
              <Skeleton variant="text" className="w-10/12 h-5" />
              <Skeleton variant="text" className="w-3/4 h-5" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow">
      <div className="relative aspect-square">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      <div className="p-3">
        <Skeleton variant="text" className="w-full h-5 mb-2" />
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="circular" className="w-3 h-3" />
          ))}
          <Skeleton variant="text" className="w-8 h-3 ml-1" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="w-16 h-5" />
          <Skeleton variant="text" className="w-12 h-3" />
        </div>
      </div>
    </div>
  );
}
