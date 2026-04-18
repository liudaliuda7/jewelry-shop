import Skeleton from '@/components/ui/skeleton';

export default function ProductsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 标题 */}
        <Skeleton variant="text" className="h-10 w-48 mb-6" />

        {/* 筛选器骨架 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-10 w-64 rounded-md" />
            <Skeleton className="h-10 w-40 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md ml-auto" />
          </div>
        </div>

        {/* 商品数量 */}
        <Skeleton variant="text" className="h-4 w-32 mb-4" />

        {/* 商品列表 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
