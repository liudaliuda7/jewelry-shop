'use client';

import { CreditCard } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">支付方式</h3>
        <p className="text-gray-500 text-sm">管理您的支付方式</p>
      </div>

      <div className="text-center py-16">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <CreditCard className="w-12 h-12 text-gray-300" />
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">暂无支付方式</h4>
        <p className="text-gray-500 mb-6">您还没有添加任何支付方式</p>
        <p className="text-sm text-gray-400">
          支付时可以选择支付宝、微信支付或银行卡
        </p>
      </div>
    </div>
  );
}
