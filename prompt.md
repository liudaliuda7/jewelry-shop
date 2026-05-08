# Jewelry Shop 任务集

基于 Next.js + React + TypeScript 的珠宝电商网站仓库，包含商品展示、购物车、订单管理、地址管理等模块。

## 环境约束

- 提供给模型的仓库压缩包根目录名固定为 `repo`
- 容器内仓库路径固定为 `/app/repo`
- 下面部分题目会直接引用仓库中的真实文件片段，分析和修改时应以这些片段及对应文件为准

---

## 任务 1：代码理解与分析

**难度**: ⭐ (1/5)  
**类型**: 代码理解与分析  
**模块**: 商品展示

### 任务描述
我对ProductCard 组件的时候有点疑惑。那个折扣标签和热门标签都是用 absolute 定位的，这样设计有什么考虑吗？还有那个 discount 的计算公式 `Math.round((1 - product.price / product.originalPrice) * 100)`，帮我解释一下它的计算逻辑？

### 相关代码
`components/ProductCard.tsx`

### 仓库引用
```tsx
const discount = product.originalPrice
  ? Math.round((1 - product.price / product.originalPrice) * 100)
  : 0;

{discount > 0 && (
  <div className="absolute top-2 left-2 bg-rose-600 text-white text-xs px-2 py-1 rounded">
    -{discount}%
  </div>
)}

{product.isHot && (
  <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded">
    热卖
  </div>
)}
```

### 预期输出
- 折扣计算公式的解释
- CSS 定位策略的分析
- 组件渲染逻辑的说明

---

## 任务 2：Bug 修复

**难度**: ⭐⭐ (2/5)  
**类型**: Bug 修复/调试  
**模块**: 购物车

### 任务描述
在购物车页面快速点击"+"按钮增加商品数量时，偶尔会出现数量显示不对的情况，比如点了 5 下但只增加了 3 个。怀疑是 CartContext 里的 addToCart 函数有竞态条件问题，请定位一下问题并修复

### 相关代码
`contexts/CartContext.tsx`

### 仓库引用
```tsx
const addToCart = (product: Product, sku: SKU, quantity: number) => {
  setCart(prevCart => {
    const existingItemIndex = prevCart.findIndex(
      item => item.product.id === product.id && item.sku.id === sku.id
    );

    if (existingItemIndex !== -1) {
      return prevCart.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + quantity
          };
        }
        return item;
      });
    } else {
      return [...prevCart, {
        id: `${product.id}-${sku.id}-${Date.now()}`,
        product,
        sku,
        quantity
      }];
    }
  });
};
```

### 预期输出
- 问题根因分析
- 修复后的代码
- 测试验证步骤

---

## 任务 3：功能迭代

**难度**: ⭐⭐ (2/5)  
**类型**: 功能迭代  
**模块**: 商品筛选

### 任务描述
商品列表页面需要加一个"仅显示有货商品"的筛选选项。有些用户不想看到缺货的商品，勾选这个选项后就只显示 stock > 0 的商品。这个应该加在现有的筛选条件那里，看看怎么实现比较好？

### 相关代码
`app/products/page.tsx`, `components/ProductFilters.tsx`

### 预期输出
- 新增的筛选逻辑代码
- UI 更新
- 筛选状态重置的处理

---

## 任务 4：代码重构

**难度**: ⭐⭐⭐ (3/5)  
**类型**: 代码重构  
**模块**: 地址管理

### 任务描述
地址管理页面（AddressesPage）代码太长了，有 400 多行，表单逻辑、省市区联动、标签管理全都混在一起，维护起来很头疼。我想把标签管理这块逻辑抽出来做成一个自定义 Hook，比如叫 useAddressTagManager，这样代码结构清晰一些。请帮我重构一下

### 相关代码
`app/user/addresses/page.tsx`

### 预期输出
- 新的自定义 Hook 代码
- 重构后的页面组件
- 重构前后的对比说明

---

## 任务 5：代码理解与分析

**难度**: ⭐⭐ (2/5)  
**类型**: 代码理解与分析  
**模块**: 数据存储

### 任务描述
我在看 AddressContext 的实现，发现有个地址过期清理机制，用 `60 * 60 * 1000` 作为清理间隔，还有个 `SEVEN_DAYS_MS` 的计算。这个设计是每 7 天清理一次过期地址吗？为什么要用定时器每小时检查？这种设计有什么优缺点？

### 相关代码
`contexts/AddressContext.tsx`

### 仓库引用
```tsx
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const isAddressExpired = (address: Address): boolean => {
  const createdAt = new Date(address.createdAt).getTime();
  const now = Date.now();
  return now - createdAt > SEVEN_DAYS_MS;
};

useEffect(() => {
  const interval = setInterval(clearExpiredAddresses, 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);
```

### 预期输出
- 过期检测算法的解释
- 定时清理策略分析
- 设计优缺点评估

---

## 任务 6：功能迭代

**难度**: ⭐⭐⭐ (3/5)  
**类型**: 功能迭代  
**模块**: 轮播组件

### 任务描述
首页的轮播图有个体验问题：用户鼠标悬停在轮播图上想仔细看的时候，它还在自动切换，体验不太好。能不能加个功能，鼠标悬停的时候暂停自动轮播，移开后再继续？

### 相关代码
`components/Carousel.tsx`

### 仓库引用
```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  }, 5000);
  return () => clearInterval(timer);
}, [banners.length]);
```

### 预期输出
- 修改后的组件代码
- 事件处理逻辑说明
- 性能考虑

---

## 任务 7：DevOps/工程化

**难度**: ⭐⭐⭐ (3/5)  
**类型**: DevOps/工程化  
**模块**: 构建配置

### 任务描述
准备把项目部署到生产环境需要优化一下next.config.js 的配置。现在只配置了图片域名，帮我加上：1）图片优化压缩；2）静态资源缓存策略；3）环境变量验证，确保生产环境必需的变量都设置了

### 相关代码
`next.config.js`, `.env.example`

### 预期输出
- 更新后的配置文件
- 环境变量文档
- 配置验证逻辑

---

## 任务 8：Bug 修复

**难度**: ⭐⭐⭐ (3/5)  
**类型**: Bug 修复/调试  
**模块**: 订单结算

### 任务描述
在结算页面快速切换收货地址时，偶尔会出现选中的地址和显示的地址信息不一致，比如选了地址 A 但显示的是地址 B 的信息。我怀疑是 CheckoutPage 里的状态同步有问题，能帮我查一下吗？

### 相关代码
`app/checkout/page.tsx`

### 仓库引用
```tsx
useEffect(() => {
  const defaultAddr = getDefaultAddress();
  if (defaultAddr) {
    setSelectedSavedAddress(defaultAddr);
    fillAddressFromSaved(defaultAddr);
    setShowManualInput(false);
  } else if (addresses.length === 0 && !isInitialized) {
    setShowManualInput(true);
  }
  setIsInitialized(true);
}, [addresses]);

const handleSelectAddress = (savedAddress: Address) => {
  setSelectedSavedAddress(savedAddress);
  fillAddressFromSaved(savedAddress);
  setShowAddressSelector(false);
};
```

### 预期输出
- Bug 复现步骤
- 根因分析
- 修复方案和代码

---

## 任务 9：功能迭代

**难度**: ⭐⭐⭐⭐ (4/5)  
**类型**: 功能迭代  
**模块**: 商品详情

### 任务描述
商品详情页要加上 SKU 选择功能。现在的商品有材质、颜色、尺寸这些选项，用户需要选择具体的 SKU 才能看到对应的价格和库存，然后才能加入购物车。如果某个 SKU 缺货了要显示"缺货"并禁用选择

### 相关代码
`app/products/[id]/page.tsx`, `types/data.ts`

### 预期输出
- SKU 选择器组件
- 状态管理逻辑
- 与购物车集成代码

---

## 任务 10：代码重构

**难度**: ⭐⭐⭐ (3/5)  
**类型**: 代码重构  
**模块**: 类型定义

### 任务描述
请帮我重构一下types/data.ts 这个文件，所有类型定义都在里面，找起来很麻烦。需要按模块拆分一下，比如商品相关的放 types/product.ts，订单相关的放 types/order.ts，用户相关的放 types/user.ts，然后再搞个 types/index.ts 统一导出

### 相关代码
`types/data.ts`

### 仓库引用
```ts
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: 'necklace' | 'ring' | 'earring' | 'bracelet';
  style: string;
  material: string;
  images: string[];
  skus: SKU[];
  isHot?: boolean;
  rating: number;
  sales: number;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  address: OrderAddress;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}
```

### 预期输出
- 拆分后的类型文件
- 更新后的导入语句
- 重构说明文档

---

## 任务 11：测试

**难度**: ⭐⭐⭐ (3/5)  
**类型**: 测试  
**模块**: 购物车

### 任务描述
给购物车模块补一些单元测试，提高代码质量。需要覆盖这些场景：添加商品、添加相同 SKU（数量应该累加）、移除商品、更新数量、清空购物车、计算总价和数量。请帮忙写一下测试用例

### 相关代码
`contexts/CartContext.tsx`

### 预期输出
- 测试文件 `__tests__/CartContext.test.tsx`
- 测试覆盖率报告
- 测试用例说明

---

## 任务 12：功能迭代

**难度**: ⭐⭐⭐⭐ (4/5)  
**类型**: 功能迭代  
**模块**: 用户系统

### 任务描述
现在的登录状态是用 localStorage 存的，我想改成基于 JWT 的方案：登录成功后存 accessToken 和 refreshToken，还要实现 token 自动刷新，登录过期后自动跳转到登录页。使用 httpOnly cookie 实现

### 相关代码
`contexts/AuthContext.tsx`, `app/login/page.tsx`

### 预期输出
- 更新后的认证逻辑
- Token 管理工具函数
- 安全考虑文档

---

## 任务 13：代码理解与分析

**难度**: ⭐⭐⭐⭐ (4/5)  
**类型**: 代码理解与分析  
**模块**: 性能优化

### 任务描述
首页加载有点慢，我看代码里用了 setTimeout 模拟加载，还有 HomeSkeleton 组件。为什么要这样设计？能不能用 React 的 Suspense 和 lazy 来优化首屏加载？帮我分析一下现在的性能瓶颈和优化方案。

### 相关代码
`app/page.tsx`, `components/skeletons/HomeSkeleton.tsx`

### 仓库引用
```tsx
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 800);

  return () => clearTimeout(timer);
}, []);

if (isLoading) {
  return <HomeSkeleton />;
}
```

### 预期输出
- 当前加载策略分析
- 性能瓶颈识别
- 优化建议和代码示例

---

## 任务 14：功能迭代

**难度**: ⭐⭐⭐⭐⭐ (5/5)  
**类型**: 功能迭代  
**模块**: 全站搜索

### 任务描述
需要求加个全站搜索功能，主要有以下几点：导航栏要有搜索框支持实时建议，能搜商品名称、描述、材质，搜索结果页要有筛选和排序，还要记录搜索历史，搜索结果里关键词要高亮显示。还要支持拼音搜索，比如搜"jz"能匹配"戒指"

### 相关代码
`components/Navbar.tsx`, `app/search/page.tsx`(新建)

### 预期输出
- 搜索组件和页面
- 搜索算法实现
- 拼音匹配功能
- 性能优化策略

---

## 任务 15：DevOps/工程化

**难度**: ⭐⭐⭐⭐ (4/5)  
**类型**: DevOps/工程化  
**模块**: CI/CD

### 任务描述
我们准备搭建完整的 CI/CD 流程，用 GitHub Actions 实现：代码提交时自动跑 ESLint 和类型检查，执行自动化测试，自动构建 Docker 镜像，最后部署到生产环境（先模拟）。还要在 README 上加个构建状态徽章。请帮我配置一下

### 相关代码
`.github/workflows/ci.yml`, `Dockerfile`

### 预期输出
- GitHub Actions 配置文件
- 工作流说明文档
- 构建状态徽章

---

## 附录：难度评分标准

### 需求清晰度
- ⭐: 目标非常明确，几乎不需要推断
- ⭐⭐⭐: 目标基本明确，但有少量需要判断的地方
- ⭐⭐⭐⭐⭐: 目标模糊，存在多种理解或实现路径

### 修改范围
- ⭐: 单文件或局部改动
- ⭐⭐⭐: 多文件改动，但范围可控
- ⭐⭐⭐⭐⭐: 跨模块、跨层级或全仓库联动

### 环境与依赖复杂度
- ⭐: 基本不依赖复杂环境，直接可推进
- ⭐⭐⭐: 需要跑测试、起服务、看日志等基础操作
- ⭐⭐⭐⭐⭐: 依赖复杂环境、外部服务或工程配置排障

### 验证复杂度
- ⭐: 一步即可验证结果
- ⭐⭐⭐: 需要多步验证或组合验证
- ⭐⭐⭐⭐⭐: 验证链路长，回归影响面大

---

## 附录：任务类别定义

| 名称 | 定义 | 典型输入 | 典型输出 |
|------|------|----------|----------|
| 代码生成 | 从需求描述出发，从零生成可运行的项目或模块 | PRD / 功能描述 | 可运行的项目代码 |
| Bug 修复/调试 | 从 issue 或报错信息出发，定位并修复问题 | Bug 报告 / Stack trace / Failing test | 修复后的代码 + 回归测试 |
| 代码重构 | 改善代码结构、性能或可维护性，行为保持不变 | 重构目标描述 + 现有代码库 | 重构后的代码 |
| 功能迭代 | 在已有代码库上添加或修改功能 | 功能需求 + 现有代码库 | 新增 / 修改的代码 |
| 测试 | 为已有代码编写或补全测试用例 | 待测代码 | 测试代码 |
| 代码理解与分析 | 阅读代码并给出解释、审查意见或分析报告 | 代码库 / PR diff / 分析问题 | 结构化分析结果 |
| DevOps/工程化 | 配置 CI/CD、Docker、部署方案等工程基建 | 项目代码 + 工程化需求 | 配置文件 / 脚本 |
