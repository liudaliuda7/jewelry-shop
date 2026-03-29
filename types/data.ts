// 类型定义
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

export interface SKU {
  id: string;
  material: string;
  size?: string;
  color: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: string;
  product: Product;
  sku: SKU;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

// 分类数据
export const categories: Category[] = [
  {
    id: 'necklace',
    name: '项链',
    icon: '💎',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop'
  },
  {
    id: 'ring',
    name: '戒指',
    icon: '💍',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop'
  },
  {
    id: 'earring',
    name: '耳环',
    icon: '✨',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop'
  },
  {
    id: 'bracelet',
    name: '手链',
    icon: '⌚',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b25f298f3b?w=400&h=300&fit=crop'
  }
];

// 商品数据
export const products: Product[] = [
  {
    id: '1',
    name: '月光珍珠项链',
    price: 899,
    originalPrice: 1299,
    description: '精选天然淡水珍珠，颗颗圆润饱满，散发着柔和的月光般光泽。采用S925纯银链条，不易过敏，持久保色。简约优雅的设计，适合日常佩戴或重要场合。',
    category: 'necklace',
    style: '优雅',
    material: 'S925银',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '1-1', material: 'S925银', color: '银色', price: 899, stock: 50 },
      { id: '1-2', material: 'S925银镀玫瑰金', color: '玫瑰金', price: 999, stock: 30 }
    ],
    isHot: true,
    rating: 4.8,
    sales: 1256
  },
  {
    id: '2',
    name: '永恒钻石戒指',
    price: 2999,
    description: '经典六爪镶嵌设计，展现钻石的璀璨光芒。采用18K金材质，彰显奢华品质。戒臂线条流畅，佩戴舒适。',
    category: 'ring',
    style: '经典',
    material: '18K金',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602607047374-26a793ef1386?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '2-1', material: '18K黄金', size: '12号', color: '金色', price: 2999, stock: 20 },
      { id: '2-2', material: '18K黄金', size: '14号', color: '金色', price: 2999, stock: 15 },
      { id: '2-3', material: '18K白金', size: '12号', color: '白色', price: 3099, stock: 18 }
    ],
    isHot: true,
    rating: 4.9,
    sales: 892
  },
  {
    id: '3',
    name: '星光闪耀耳环',
    price: 599,
    originalPrice: 799,
    description: '精致的星形设计，镶嵌闪耀的锆石，如夜空中的星辰。采用S925银针，防过敏设计。轻盈舒适，适合日常佩戴。',
    category: 'earring',
    style: '时尚',
    material: 'S925银',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1630017952618-6e46c3ab755f?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '3-1', material: 'S925银', color: '银色', price: 599, stock: 100 },
      { id: '3-2', material: 'S925银镀玫瑰金', color: '玫瑰金', price: 649, stock: 80 }
    ],
    isHot: true,
    rating: 4.7,
    sales: 2341
  },
  {
    id: '4',
    name: '幸运四叶草手链',
    price: 799,
    description: '经典四叶草设计，象征幸运与幸福。采用S925银材质，表面镀白金，持久亮丽。可调节链长设计，适合各种手腕尺寸。',
    category: 'bracelet',
    style: '经典',
    material: 'S925银',
    images: [
      'https://images.unsplash.com/photo-1611085583191-a3b25f298f3b?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '4-1', material: 'S925银', color: '银色', price: 799, stock: 60 },
      { id: '4-2', material: 'S925银镀玫瑰金', color: '玫瑰金', price: 849, stock: 45 }
    ],
    isHot: true,
    rating: 4.6,
    sales: 1567
  },
  {
    id: '5',
    name: '几何艺术项链',
    price: 459,
    description: '现代几何设计，简约而不失个性。采用合金材质，电镀工艺，不易褪色。适合搭配各种服装风格。',
    category: 'necklace',
    style: '简约',
    material: '合金',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '5-1', material: '合金', color: '金色', price: 459, stock: 80 },
      { id: '5-2', material: '合金', color: '银色', price: 459, stock: 85 }
    ],
    rating: 4.5,
    sales: 891
  },
  {
    id: '6',
    name: '复古浮雕戒指',
    price: 399,
    description: '复古风格设计，精美的浮雕工艺，展现独特韵味。采用合金材质，做旧处理，增添复古氛围。',
    category: 'ring',
    style: '复古',
    material: '合金',
    images: [
      'https://images.unsplash.com/photo-1602607047374-26a793ef1386?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '6-1', material: '合金', size: '12号', color: '古铜色', price: 399, stock: 40 },
      { id: '6-2', material: '合金', size: '14号', color: '古铜色', price: 399, stock: 35 }
    ],
    rating: 4.4,
    sales: 567
  },
  {
    id: '7',
    name: '海洋之心耳环',
    price: 699,
    description: '采用优质蓝色锆石，如同海洋之心般深邃迷人。S925银针，防过敏设计。精致小巧，适合各种场合。',
    category: 'earring',
    style: '优雅',
    material: 'S925银',
    images: [
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '7-1', material: 'S925银', color: '银色', price: 699, stock: 70 },
      { id: '7-2', material: 'S925银镀玫瑰金', color: '玫瑰金', price: 749, stock: 55 }
    ],
    rating: 4.8,
    sales: 1123
  },
  {
    id: '8',
    name: '满天星锆石手链',
    price: 549,
    description: '满钻设计，如满天星辰般闪耀。采用合金材质，镶嵌多颗锆石，光彩夺目。可调节长度，佩戴舒适。',
    category: 'bracelet',
    style: '时尚',
    material: '合金',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1611085583191-a3b25f298f3b?w=800&h=800&fit=crop'
    ],
    skus: [
      { id: '8-1', material: '合金', color: '金色', price: 549, stock: 90 },
      { id: '8-2', material: '合金', color: '银色', price: 549, stock: 85 }
    ],
    rating: 4.6,
    sales: 1789
  }
];

// 轮播图数据
export const banners = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&h=500&fit=crop',
    title: '秋季新品上市',
    subtitle: '精选轻奢首饰，限时8折优惠'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&h=500&fit=crop',
    title: '婚礼季精选',
    subtitle: '见证幸福时刻，永恒之选'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b25f298f3b?w=1200&h=500&fit=crop',
    title: '会员专享',
    subtitle: '注册即享首单立减50元'
  }
];

// 品牌故事
export const brandStory = {
  title: '关于我们',
  content: '我们专注于轻奢首饰设计，致力于为现代女性打造独特的时尚配饰。每一件作品都经过精心设计和严格选材，融合传统工艺与现代美学。我们相信，每一位女性都值得拥有属于自己的闪耀时刻。',
  image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&h=400&fit=crop'
};

// 获取商品详情
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

// 根据分类获取商品
export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category);
}

// 获取热门商品
export function getHotProducts(): Product[] {
  return products.filter(p => p.isHot);
}