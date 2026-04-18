import Skeleton from '@/components/ui/skeleton';

export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            {/* 商品图片区域 */}
            <div>
              {/* 主图骨架 */}
              <Skeleton className="aspect-square w-full rounded-lg mb-4" />
              
              {/* 缩略图骨架 */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* 商品信息区域 */}
            <div>
              {/* 标题 */}
              <Skeleton variant="text" className="h-10 w-4/5 mb-4" />
              <Skeleton variant="text" className="h-8 w-3/5 mb-4" />

              {/* 评分和销量 */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} variant="circular" className="w-5 h-5" />
                  ))}
                  <Skeleton variant="text" className="w-12 h-5 ml-2" />
                </div>
                <Skeleton variant="text" className="w-24 h-5" />
              </div>

              {/* 价格 */}
              <div className="mb-6">
                <div className="flex items-baseline gap-4">
                  <Skeleton variant="text" className="h-10 w-28" />
                  <Skeleton variant="text" className="h-6 w-20" />
                </div>
              </div>

              {/* SKU选择器骨架 */}
              <div className="space-y-4 mb-6">
                {/* 材质选择 */}
                <div>
                  <Skeleton variant="text" className="h-5 w-12 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-10 w-20 rounded-lg" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                    <Skeleton className="h-10 w-20 rounded-lg" />
                  </div>
                </div>

                {/* 颜色选择 */}
                <div>
                  <Skeleton variant="text" className="h-5 w-12 mb-2" />
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" className="w-8 h-8" />
                    <Skeleton variant="text" className="w-16 h-5" />
                  </div>
                </div>

                {/* 尺寸选择 */}
                <div>
                  <Skeleton variant="text" className="h-5 w-12 mb-2" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-10 w-16 rounded-lg" />
                    <Skeleton className="h-10 w-16 rounded-lg" />
                    <Skeleton className="h-10 w-16 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* 库存 */}
              <Skeleton variant="text" className="w-32 h-5 mb-6" />

              {/* 数量选择 */}
              <div className="mb-6">
                <Skeleton variant="text" className="h-5 w-12 mb-2" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-10 h-10 rounded-l-lg" />
                  <Skeleton className="w-20 h-10" />
                  <Skeleton className="w-10 h-10 rounded-r-lg" />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-4">
                <Skeleton className="flex-1 h-12 rounded-lg" />
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>

              {/* 商品描述 */}
              <div className="mt-8 pt-8 border-t">
                <Skeleton variant="text" className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  <Skeleton variant="text" className="w-full h-5" />
                  <Skeleton variant="text" className="w-11/12 h-5" />
                  <Skeleton variant="text" className="w-10/12 h-5" />
                </div>
              </div>

              {/* 商品参数 */}
              <div className="mt-6">
                <Skeleton variant="text" className="h-6 w-24 mb-4" />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-24 h-5" />
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-20 h-5" />
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-24 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
