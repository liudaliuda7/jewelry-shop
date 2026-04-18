import Skeleton from '@/components/ui/skeleton';

export default function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* 标题 */}
        <Skeleton variant="text" className="h-10 w-56 mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 商品列表骨架 */}
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>

          {/* 订单摘要骨架 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <Skeleton variant="text" className="h-6 w-24 mb-6" />
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-20 h-5" />
                </div>
                <div className="flex justify-between">
                  <Skeleton variant="text" className="w-16 h-5" />
                  <Skeleton variant="text" className="w-16 h-5" />
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <Skeleton variant="text" className="w-12 h-6" />
                    <Skeleton variant="text" className="w-20 h-6" />
                  </div>
                </div>
              </div>

              <Skeleton className="w-full h-12 rounded-lg mb-4" />
              <Skeleton variant="text" className="w-28 h-5 mx-auto mb-2" />
              <Skeleton variant="text" className="w-20 h-5 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      {/* 商品图片 */}
      <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-lg shrink-0" />

      {/* 商品信息 */}
      <div className="flex-grow">
        <Skeleton variant="text" className="w-48 h-6 mb-2" />
        <Skeleton variant="text" className="w-64 h-4 mb-4" />
        
        <div className="flex items-center justify-between">
          {/* 数量调整 */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-l" />
            <Skeleton className="w-12 h-8" />
            <Skeleton className="w-8 h-8 rounded-r" />
          </div>

          {/* 价格 */}
          <div className="text-right">
            <Skeleton variant="text" className="w-20 h-6 mb-1" />
            <Skeleton variant="text" className="w-24 h-4" />
          </div>
        </div>
      </div>

      {/* 删除按钮 */}
      <Skeleton variant="circular" className="w-5 h-5" />
    </div>
  );
}
