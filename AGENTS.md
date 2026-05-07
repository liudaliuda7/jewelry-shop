<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-rules -->

# 项目概述
- **名称**: 璀璨首饰 - 轻奢首饰商城
- **类型**: Next.js 16 全栈应用（前端展示 + 模拟数据）
- **语言**: 中文界面 (zh-CN)
- **端口**: 开发环境 3000

# 技术栈

## 核心框架
- **Next.js**: 16.2.1 (⚠️ 非标准版本，有 breaking changes)
- **React**: 19.2.4
- **TypeScript**: 5.x (strict mode)

## UI & 样式
- **Tailwind CSS**: v4 (⚠️ 新版本语法，注意与 v3 的差异)
- **Radix UI**: 无障碍组件库 (@radix-ui/react-select, react-slider, react-slot)
- **Lucide React**: 图标库
- **CVA**: class-variance-authority (组件变体管理)
- **clsx + tailwind-merge**: 类名工具函数

## 路由架构
- **App Router** (必须使用 `app/` 目录，禁止使用 `pages/`)
- **路径别名**: `@/*` 映射到项目根目录 (`.`)

## 状态管理
- **Context API**: 自定义 Hooks 模式
  - AuthContext: 用户认证
  - CartContext: 购物车
  - OrderContext: 订单管理
  - AddressContext: 地址管理
  - TagContext: 标签管理
  - ToastContext: 提示消息

## 数据层
- **模拟数据**: 所有数据在 `types/data.ts` 中定义
- **类型定义**: TypeScript interfaces 在同文件中
- **无后端 API**: 当前为纯前端演示项目

## 开发工具
- **ESLint**: eslint-config-next (core-web-vitals + typescript)
- **PostCSS**: @tailwindcss/postcss v4

# 编码规范

## 文件组织
```
app/
  ├── layout.tsx          # 根布局 (Provider 嵌套)
  ├── page.tsx            # 首页
  ├── globals.css         # 全局样式
  ├── products/           # 商品列表/详情
  ├── cart/               # 购物车
  ├── checkout/           # 结算
  ├── login/              # 登录
  ├── register/           # 注册
  └── user/               # 用户中心 (嵌套路由)
components/
  ├── ui/                 # 基础 UI 组件 (Button, Select 等)
  ├── skeletons/          # 加载骨架屏
  └── [业务组件].tsx       # 业务组件
contexts/                  # Context Providers
types/
  └── data.ts             # 类型定义 + 模拟数据
lib/
  └── utils.ts            # 工具函数 (cn() 等)
public/                    # 静态资源
```

## 组件规范

### 必须遵循
1. **'use client'**: 交互组件必须在文件顶部声明
2. **TypeScript 类型**: 所有 props 必须定义接口
3. **命名规范**:
   - 组件: PascalCase (如 `ProductCard`, `Navbar`)
   - 文件名: 与组件名一致
   - 工具函数: camelCase (如 `getProductById`)

### 组件模式
```tsx
// ✅ 正确示例
'use client';
import { useState } from 'react';

interface Props {
  title: string;
  onClick?: () => void;
}

export default function MyComponent({ title, onClick }: Props) {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <button 
        onClick={() => setCount(c => c + 1)}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Count: {count}
      </button>
    </div>
  );
}
```

### Tailwind CSS 规范
```tsx
// ✅ 使用 cn() 合并类名
import { cn } from '@/lib/utils';

<div className={cn('base-classes', conditional && 'extra-class')} />

// ✅ 响应式设计优先移动端
className="grid grid-cols-2 md:grid-cols-4 gap-4"

// ✅ 使用设计系统颜色
text-gray-800, bg-rose-600, border-gray-200
```

## Context 使用规范
```tsx
// ✅ 正确的 Provider 嵌套顺序 (layout.tsx)
<AuthProvider>           // 最外层
  <CartProvider>
    <OrderProvider>
      <AddressProvider>
        <TagProvider>
          <ToastProvider>   // 最内层
            {children}
          </ToastProvider>
        </TagProvider>
      </AddressProvider>
    </OrderProvider>
  </CartProvider>
</AuthProvider>

// ✅ 在组件中使用
'use client';
import { useCart } from '@/contexts/CartContext';

function MyComponent() {
  const { cartCount, addToCart } = useCart();
  // ...
}
```

## 图片处理
```tsx
// ✅ 使用 next/image (已配置 unsplash 域名)
import Image from 'next/image';

<Image
  src={product.images[0]}
  alt={product.name}
  width={800}
  height={800}
  className="object-cover"
  priority  // 首屏图片添加
/>

// ✅ fill 模式 (需要 relative 容器)
<div className="relative aspect-square">
  <Image
    src={url}
    alt={alt}
    fill
    className="object-cover"
  />
</div>
```

## 路由和导航
```tsx
// ✅ 使用 Link 组件 (客户端导航)
import Link from 'next/link';

<Link href="/products?category=necklace" className="...">
  项链
</Link>

// ✅ 动态路由
// app/products/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetail({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);
  // ...
}

// ✅ 搜索参数
import { useSearchParams } from 'next/navigation'; // 客户端
// 或
export default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams; // 服务端
}
```

## 元数据 (SEO)
```tsx
// ✅ 服务端组件导出 metadata
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '页面标题',
  description: '页面描述',
};

// ✅ 动态 metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = getProductById((await params).id);
  return {
    title: `${product.name} - 璀璨首饰`,
  };
}
```

# 重要注意事项

## ⚠️ Next.js 16 特殊规则
1. **阅读文档**: 修改任何 API 前，先检查 `node_modules/next/dist/docs/`
2. **App Router**: 只能使用 app/ 目录，pages/ 已废弃
3. **Server Components**: 默认是服务端组件，需要交互才加 'use client'
4. **async Components**: 支持异步组件，params/searchParams 需要 await
5. **Turbopack**: 开发服务器使用 Turbopack (可能有不兼容问题)

## 🎨 设计系统
- **主色**: rose (玫瑰红) - 用于品牌色、按钮、强调
- **中性色**: gray 系列 - 用于文字、背景、边框
- **字体**: Inter (sans), Roboto Mono (mono)
- **圆角**: rounded-lg (默认), rounded-full (圆形元素)
- **阴影**: shadow-md (卡片), shadow-lg (弹窗)
- **间距**: 使用 Tailwind 标准间距 (4px 基准)

## 🔒 安全注意事项
- 当前为演示项目，无真实认证
- 用户数据存储在 localStorage (AuthContext)
- 不要在生产环境暴露敏感信息
- API Key 等机密信息应使用环境变量

## 📱 响应式断点
- **Mobile**: < 768px (默认)
- **Tablet**: md: (768px+)
- **Desktop**: lg: (1024px+)
- **Large**: xl: (1280px+)

## ♿ 可访问性 (a11y)
- 使用语义化 HTML 标签
- 图片必须有 alt 属性
- 表单元素关联 label
- 颜色对比度符合 WCAG AA 标准
- 键盘导航支持 (Tab, Enter, Escape)

## 🚀 性能优化
- **图片优化**: 始终使用 next/image
- **代码分割**: 动态导入大型组件
- **懒加载**: 折叠内容使用动态加载
- **Skeleton**: 数据加载时显示骨架屏
- **字体优化**: 使用 next/font/google

# Git 和提交规范
- 使用清晰的中文提交信息
- 格式: `类型: 简短描述`
  - feat: 新功能
  - fix: 修复 bug
  - style: 样式调整
  - refactor: 重构
  - docs: 文档更新
  - chore: 构建/工具变更

# 测试和构建
```bash
# 开发
npm run dev          # 启动开发服务器 (localhost:3000)

# 生产
npm run build        # 构建生产版本
npm run start        # 启动生产服务器

# 代码质量
npm run lint         # 运行 ESLint 检查
```

# 常见任务清单
- [ ] 新建页面 → 在 app/ 下创建目录和 page.tsx
- [ ] 新建组件 → 在 components/ 下创建 .tsx 文件
- [ ] 添加类型 → 在 types/data.ts 中定义 interface
- [ ] 添加数据 → 在 types/data.ts 中添加 mock data
- [ ] 创建 Context → 在 contexts/ 下创建并包裹到 layout.tsx
- [ ] 修改样式 → 使用 Tailwind 类名，避免自定义 CSS
- [ ] 添加图标 → 从 lucide-react 导入

# 联系和支持
- 项目负责人: [你的名字]
- 文档位置: README.md
- 问题反馈: 通过 Git Issues

<!-- END:project-rules -->