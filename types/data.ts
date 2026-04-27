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

export interface OrderAddress {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  zipCode?: string;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'alipay' | 'wechat' | 'bankcard';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  skuId: string;
  skuMaterial: string;
  skuColor: string;
  skuSize?: string;
  price: number;
  quantity: number;
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

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export type AddressTag = 'home' | 'work' | 'default';

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  provinceCode: string;
  provinceName: string;
  cityCode: string;
  cityName: string;
  districtCode: string;
  districtName: string;
  address: string;
  zipCode?: string;
  tag?: AddressTag;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface Region {
  code: string;
  name: string;
  children?: Region[];
}

export const regionData: Region[] = [
  {
    code: '110000',
    name: '北京市',
    children: [
      {
        code: '110100',
        name: '北京市',
        children: [
          { code: '110101', name: '东城区' },
          { code: '110102', name: '西城区' },
          { code: '110105', name: '朝阳区' },
          { code: '110106', name: '丰台区' },
          { code: '110107', name: '石景山区' },
          { code: '110108', name: '海淀区' },
          { code: '110109', name: '门头沟区' },
          { code: '110111', name: '房山区' },
          { code: '110112', name: '通州区' },
          { code: '110113', name: '顺义区' },
          { code: '110114', name: '昌平区' },
          { code: '110115', name: '大兴区' },
          { code: '110116', name: '怀柔区' },
          { code: '110117', name: '平谷区' },
          { code: '110118', name: '密云区' },
          { code: '110119', name: '延庆区' },
        ],
      },
    ],
  },
  {
    code: '310000',
    name: '上海市',
    children: [
      {
        code: '310100',
        name: '上海市',
        children: [
          { code: '310101', name: '黄浦区' },
          { code: '310104', name: '徐汇区' },
          { code: '310105', name: '长宁区' },
          { code: '310106', name: '静安区' },
          { code: '310107', name: '普陀区' },
          { code: '310109', name: '虹口区' },
          { code: '310110', name: '杨浦区' },
          { code: '310112', name: '闵行区' },
          { code: '310113', name: '宝山区' },
          { code: '310114', name: '嘉定区' },
          { code: '310115', name: '浦东新区' },
          { code: '310116', name: '金山区' },
          { code: '310117', name: '松江区' },
          { code: '310118', name: '青浦区' },
          { code: '310120', name: '奉贤区' },
          { code: '310151', name: '崇明区' },
        ],
      },
    ],
  },
  {
    code: '440000',
    name: '广东省',
    children: [
      {
        code: '440100',
        name: '广州市',
        children: [
          { code: '440103', name: '荔湾区' },
          { code: '440104', name: '越秀区' },
          { code: '440105', name: '海珠区' },
          { code: '440106', name: '天河区' },
          { code: '440111', name: '白云区' },
          { code: '440112', name: '黄埔区' },
          { code: '440113', name: '番禺区' },
          { code: '440114', name: '花都区' },
          { code: '440115', name: '南沙区' },
          { code: '440117', name: '从化区' },
          { code: '440118', name: '增城区' },
        ],
      },
      {
        code: '440300',
        name: '深圳市',
        children: [
          { code: '440303', name: '罗湖区' },
          { code: '440304', name: '福田区' },
          { code: '440305', name: '南山区' },
          { code: '440306', name: '宝安区' },
          { code: '440307', name: '龙岗区' },
          { code: '440308', name: '盐田区' },
          { code: '440309', name: '龙华区' },
          { code: '440310', name: '坪山区' },
          { code: '440311', name: '光明区' },
        ],
      },
      {
        code: '440400',
        name: '珠海市',
        children: [
          { code: '440402', name: '香洲区' },
          { code: '440403', name: '斗门区' },
          { code: '440404', name: '金湾区' },
        ],
      },
      {
        code: '440600',
        name: '佛山市',
        children: [
          { code: '440604', name: '禅城区' },
          { code: '440605', name: '南海区' },
          { code: '440606', name: '顺德区' },
          { code: '440607', name: '三水区' },
          { code: '440608', name: '高明区' },
        ],
      },
      {
        code: '441900',
        name: '东莞市',
        children: [
          { code: '441900', name: '东莞市' },
        ],
      },
    ],
  },
  {
    code: '330000',
    name: '浙江省',
    children: [
      {
        code: '330100',
        name: '杭州市',
        children: [
          { code: '330102', name: '上城区' },
          { code: '330105', name: '拱墅区' },
          { code: '330106', name: '西湖区' },
          { code: '330108', name: '滨江区' },
          { code: '330109', name: '萧山区' },
          { code: '330110', name: '余杭区' },
          { code: '330111', name: '富阳区' },
          { code: '330112', name: '临安区' },
          { code: '330122', name: '桐庐县' },
          { code: '330127', name: '淳安县' },
          { code: '330182', name: '建德市' },
        ],
      },
      {
        code: '330200',
        name: '宁波市',
        children: [
          { code: '330203', name: '海曙区' },
          { code: '330205', name: '江北区' },
          { code: '330206', name: '北仑区' },
          { code: '330211', name: '镇海区' },
          { code: '330212', name: '鄞州区' },
          { code: '330213', name: '奉化区' },
          { code: '330225', name: '象山县' },
          { code: '330226', name: '宁海县' },
          { code: '330281', name: '余姚市' },
          { code: '330282', name: '慈溪市' },
        ],
      },
      {
        code: '330300',
        name: '温州市',
        children: [
          { code: '330302', name: '鹿城区' },
          { code: '330303', name: '龙湾区' },
          { code: '330304', name: '瓯海区' },
          { code: '330305', name: '洞头区' },
          { code: '330324', name: '永嘉县' },
          { code: '330326', name: '平阳县' },
          { code: '330327', name: '苍南县' },
          { code: '330328', name: '文成县' },
          { code: '330329', name: '泰顺县' },
          { code: '330381', name: '瑞安市' },
          { code: '330382', name: '乐清市' },
        ],
      },
    ],
  },
  {
    code: '320000',
    name: '江苏省',
    children: [
      {
        code: '320100',
        name: '南京市',
        children: [
          { code: '320102', name: '玄武区' },
          { code: '320104', name: '秦淮区' },
          { code: '320105', name: '建邺区' },
          { code: '320106', name: '鼓楼区' },
          { code: '320111', name: '浦口区' },
          { code: '320113', name: '栖霞区' },
          { code: '320114', name: '雨花台区' },
          { code: '320115', name: '江宁区' },
          { code: '320116', name: '六合区' },
          { code: '320117', name: '溧水区' },
          { code: '320118', name: '高淳区' },
        ],
      },
      {
        code: '320200',
        name: '无锡市',
        children: [
          { code: '320205', name: '锡山区' },
          { code: '320206', name: '惠山区' },
          { code: '320211', name: '滨湖区' },
          { code: '320213', name: '梁溪区' },
          { code: '320214', name: '新吴区' },
          { code: '320281', name: '江阴市' },
          { code: '320282', name: '宜兴市' },
        ],
      },
      {
        code: '320300',
        name: '徐州市',
        children: [
          { code: '320302', name: '鼓楼区' },
          { code: '320303', name: '云龙区' },
          { code: '320305', name: '贾汪区' },
          { code: '320311', name: '泉山区' },
          { code: '320312', name: '铜山区' },
          { code: '320321', name: '丰县' },
          { code: '320322', name: '沛县' },
          { code: '320324', name: '睢宁县' },
          { code: '320381', name: '新沂市' },
          { code: '320382', name: '邳州市' },
        ],
      },
      {
        code: '320500',
        name: '苏州市',
        children: [
          { code: '320505', name: '虎丘区' },
          { code: '320506', name: '吴中区' },
          { code: '320507', name: '相城区' },
          { code: '320508', name: '姑苏区' },
          { code: '320509', name: '吴江区' },
          { code: '320581', name: '常熟市' },
          { code: '320582', name: '张家港市' },
          { code: '320583', name: '昆山市' },
          { code: '320585', name: '太仓市' },
        ],
      },
    ],
  },
  {
    code: '510000',
    name: '四川省',
    children: [
      {
        code: '510100',
        name: '成都市',
        children: [
          { code: '510104', name: '锦江区' },
          { code: '510105', name: '青羊区' },
          { code: '510106', name: '金牛区' },
          { code: '510107', name: '武侯区' },
          { code: '510108', name: '成华区' },
          { code: '510112', name: '龙泉驿区' },
          { code: '510113', name: '青白江区' },
          { code: '510114', name: '新都区' },
          { code: '510115', name: '温江区' },
          { code: '510116', name: '双流区' },
          { code: '510117', name: '郫都区' },
          { code: '510121', name: '金堂县' },
          { code: '510124', name: '大邑县' },
          { code: '510125', name: '蒲江县' },
          { code: '510129', name: '新津县' },
          { code: '510181', name: '都江堰市' },
          { code: '510182', name: '彭州市' },
          { code: '510183', name: '邛崃市' },
          { code: '510184', name: '崇州市' },
          { code: '510185', name: '简阳市' },
        ],
      },
    ],
  },
  {
    code: '500000',
    name: '重庆市',
    children: [
      {
        code: '500100',
        name: '重庆市',
        children: [
          { code: '500101', name: '万州区' },
          { code: '500102', name: '涪陵区' },
          { code: '500103', name: '渝中区' },
          { code: '500104', name: '大渡口区' },
          { code: '500105', name: '江北区' },
          { code: '500106', name: '沙坪坝区' },
          { code: '500107', name: '九龙坡区' },
          { code: '500108', name: '南岸区' },
          { code: '500109', name: '北碚区' },
          { code: '500110', name: '綦江区' },
          { code: '500111', name: '大足区' },
          { code: '500112', name: '渝北区' },
          { code: '500113', name: '巴南区' },
          { code: '500114', name: '黔江区' },
          { code: '500115', name: '长寿区' },
          { code: '500116', name: '江津区' },
          { code: '500117', name: '合川区' },
          { code: '500118', name: '永川区' },
          { code: '500119', name: '南川区' },
          { code: '500120', name: '璧山区' },
          { code: '500121', name: '铜梁区' },
          { code: '500122', name: '潼南区' },
          { code: '500123', name: '荣昌区' },
          { code: '500124', name: '开州区' },
          { code: '500125', name: '梁平区' },
          { code: '500126', name: '武隆区' },
        ],
      },
    ],
  },
  {
    code: '420000',
    name: '湖北省',
    children: [
      {
        code: '420100',
        name: '武汉市',
        children: [
          { code: '420102', name: '江岸区' },
          { code: '420103', name: '江汉区' },
          { code: '420104', name: '硚口区' },
          { code: '420105', name: '汉阳区' },
          { code: '420106', name: '武昌区' },
          { code: '420107', name: '青山区' },
          { code: '420111', name: '洪山区' },
          { code: '420112', name: '东西湖区' },
          { code: '420113', name: '汉南区' },
          { code: '420114', name: '蔡甸区' },
          { code: '420115', name: '江夏区' },
          { code: '420116', name: '黄陂区' },
          { code: '420117', name: '新洲区' },
        ],
      },
    ],
  },
  {
    code: '610000',
    name: '陕西省',
    children: [
      {
        code: '610100',
        name: '西安市',
        children: [
          { code: '610102', name: '新城区' },
          { code: '610103', name: '碑林区' },
          { code: '610104', name: '莲湖区' },
          { code: '610111', name: '灞桥区' },
          { code: '610112', name: '未央区' },
          { code: '610113', name: '雁塔区' },
          { code: '610114', name: '阎良区' },
          { code: '610115', name: '临潼区' },
          { code: '610116', name: '长安区' },
          { code: '610117', name: '高陵区' },
          { code: '610118', name: '鄠邑区' },
          { code: '610122', name: '蓝田县' },
          { code: '610124', name: '周至县' },
        ],
      },
    ],
  },
  {
    code: '350000',
    name: '福建省',
    children: [
      {
        code: '350100',
        name: '福州市',
        children: [
          { code: '350102', name: '鼓楼区' },
          { code: '350103', name: '台江区' },
          { code: '350104', name: '仓山区' },
          { code: '350105', name: '马尾区' },
          { code: '350111', name: '晋安区' },
          { code: '350112', name: '长乐区' },
          { code: '350121', name: '闽侯县' },
          { code: '350122', name: '连江县' },
          { code: '350123', name: '罗源县' },
          { code: '350124', name: '闽清县' },
          { code: '350125', name: '永泰县' },
          { code: '350128', name: '平潭县' },
          { code: '350181', name: '福清市' },
        ],
      },
      {
        code: '350200',
        name: '厦门市',
        children: [
          { code: '350203', name: '思明区' },
          { code: '350205', name: '海沧区' },
          { code: '350206', name: '湖里区' },
          { code: '350211', name: '集美区' },
          { code: '350212', name: '同安区' },
          { code: '350213', name: '翔安区' },
        ],
      },
    ],
  },
  {
    code: '370000',
    name: '山东省',
    children: [
      {
        code: '370100',
        name: '济南市',
        children: [
          { code: '370102', name: '历下区' },
          { code: '370103', name: '市中区' },
          { code: '370104', name: '槐荫区' },
          { code: '370105', name: '天桥区' },
          { code: '370112', name: '历城区' },
          { code: '370113', name: '长清区' },
          { code: '370114', name: '章丘区' },
          { code: '370115', name: '济阳区' },
          { code: '370124', name: '平阴县' },
          { code: '370126', name: '商河县' },
        ],
      },
      {
        code: '370200',
        name: '青岛市',
        children: [
          { code: '370202', name: '市南区' },
          { code: '370203', name: '市北区' },
          { code: '370211', name: '黄岛区' },
          { code: '370212', name: '崂山区' },
          { code: '370213', name: '李沧区' },
          { code: '370214', name: '城阳区' },
          { code: '370215', name: '即墨区' },
          { code: '370281', name: '胶州市' },
          { code: '370283', name: '平度市' },
          { code: '370285', name: '莱西市' },
        ],
      },
    ],
  },
  {
    code: '410000',
    name: '河南省',
    children: [
      {
        code: '410100',
        name: '郑州市',
        children: [
          { code: '410102', name: '中原区' },
          { code: '410103', name: '二七区' },
          { code: '410104', name: '管城回族区' },
          { code: '410105', name: '金水区' },
          { code: '410106', name: '上街区' },
          { code: '410108', name: '惠济区' },
          { code: '410122', name: '中牟县' },
          { code: '410181', name: '巩义市' },
          { code: '410182', name: '荥阳市' },
          { code: '410183', name: '新密市' },
          { code: '410184', name: '新郑市' },
          { code: '410185', name: '登封市' },
        ],
      },
    ],
  },
  {
    code: '120000',
    name: '天津市',
    children: [
      {
        code: '120100',
        name: '天津市',
        children: [
          { code: '120101', name: '和平区' },
          { code: '120102', name: '河东区' },
          { code: '120103', name: '河西区' },
          { code: '120104', name: '南开区' },
          { code: '120105', name: '河北区' },
          { code: '120106', name: '红桥区' },
          { code: '120110', name: '东丽区' },
          { code: '120111', name: '西青区' },
          { code: '120112', name: '津南区' },
          { code: '120113', name: '北辰区' },
          { code: '120114', name: '武清区' },
          { code: '120115', name: '宝坻区' },
          { code: '120116', name: '滨海新区' },
          { code: '120117', name: '宁河区' },
          { code: '120118', name: '静海区' },
          { code: '120119', name: '蓟州区' },
        ],
      },
    ],
  },
  {
    code: '130000',
    name: '河北省',
    children: [
      {
        code: '130100',
        name: '石家庄市',
        children: [
          { code: '130102', name: '长安区' },
          { code: '130104', name: '桥西区' },
          { code: '130105', name: '新华区' },
          { code: '130107', name: '井陉矿区' },
          { code: '130108', name: '裕华区' },
          { code: '130109', name: '藁城区' },
          { code: '130110', name: '鹿泉区' },
          { code: '130111', name: '栾城区' },
          { code: '130121', name: '井陉县' },
          { code: '130123', name: '正定县' },
          { code: '130125', name: '行唐县' },
          { code: '130126', name: '灵寿县' },
          { code: '130127', name: '高邑县' },
          { code: '130128', name: '深泽县' },
          { code: '130129', name: '赞皇县' },
          { code: '130130', name: '无极县' },
          { code: '130131', name: '平山县' },
          { code: '130132', name: '元氏县' },
          { code: '130133', name: '赵县' },
          { code: '130181', name: '辛集市' },
          { code: '130183', name: '晋州市' },
          { code: '130184', name: '新乐市' },
        ],
      },
    ],
  },
  {
    code: '210000',
    name: '辽宁省',
    children: [
      {
        code: '210100',
        name: '沈阳市',
        children: [
          { code: '210102', name: '和平区' },
          { code: '210103', name: '沈河区' },
          { code: '210104', name: '大东区' },
          { code: '210105', name: '皇姑区' },
          { code: '210106', name: '铁西区' },
          { code: '210111', name: '苏家屯区' },
          { code: '210112', name: '浑南区' },
          { code: '210113', name: '沈北新区' },
          { code: '210114', name: '于洪区' },
          { code: '210115', name: '辽中区' },
          { code: '210123', name: '康平县' },
          { code: '210124', name: '法库县' },
          { code: '210181', name: '新民市' },
        ],
      },
      {
        code: '210200',
        name: '大连市',
        children: [
          { code: '210202', name: '中山区' },
          { code: '210203', name: '西岗区' },
          { code: '210204', name: '沙河口区' },
          { code: '210211', name: '甘井子区' },
          { code: '210212', name: '旅顺口区' },
          { code: '210213', name: '金州区' },
          { code: '210224', name: '长海县' },
          { code: '210281', name: '瓦房店市' },
          { code: '210282', name: '普兰店区' },
          { code: '210283', name: '庄河市' },
        ],
      },
    ],
  },
  {
    code: '220000',
    name: '吉林省',
    children: [
      {
        code: '220100',
        name: '长春市',
        children: [
          { code: '220102', name: '南关区' },
          { code: '220103', name: '宽城区' },
          { code: '220104', name: '朝阳区' },
          { code: '220105', name: '二道区' },
          { code: '220106', name: '绿园区' },
          { code: '220112', name: '双阳区' },
          { code: '220113', name: '九台区' },
          { code: '220122', name: '农安县' },
          { code: '220181', name: '榆树市' },
          { code: '220182', name: '德惠市' },
          { code: '220183', name: '公主岭市' },
        ],
      },
    ],
  },
  {
    code: '230000',
    name: '黑龙江省',
    children: [
      {
        code: '230100',
        name: '哈尔滨市',
        children: [
          { code: '230102', name: '道里区' },
          { code: '230103', name: '南岗区' },
          { code: '230104', name: '道外区' },
          { code: '230108', name: '平房区' },
          { code: '230109', name: '松北区' },
          { code: '230110', name: '香坊区' },
          { code: '230111', name: '呼兰区' },
          { code: '230112', name: '阿城区' },
          { code: '230113', name: '双城区' },
          { code: '230123', name: '依兰县' },
          { code: '230124', name: '方正县' },
          { code: '230125', name: '宾县' },
          { code: '230126', name: '巴彦县' },
          { code: '230127', name: '木兰县' },
          { code: '230128', name: '通河县' },
          { code: '230129', name: '延寿县' },
          { code: '230182', name: '尚志市' },
          { code: '230183', name: '五常市' },
        ],
      },
    ],
  },
  {
    code: '340000',
    name: '安徽省',
    children: [
      {
        code: '340100',
        name: '合肥市',
        children: [
          { code: '340102', name: '瑶海区' },
          { code: '340103', name: '庐阳区' },
          { code: '340104', name: '蜀山区' },
          { code: '340111', name: '包河区' },
          { code: '340121', name: '长丰县' },
          { code: '340122', name: '肥东县' },
          { code: '340123', name: '肥西县' },
          { code: '340124', name: '庐江县' },
          { code: '340181', name: '巢湖市' },
        ],
      },
    ],
  },
  {
    code: '360000',
    name: '江西省',
    children: [
      {
        code: '360100',
        name: '南昌市',
        children: [
          { code: '360102', name: '东湖区' },
          { code: '360103', name: '西湖区' },
          { code: '360104', name: '青云谱区' },
          { code: '360105', name: '青山湖区' },
          { code: '360111', name: '新建区' },
          { code: '360112', name: '红谷滩区' },
          { code: '360121', name: '南昌县' },
          { code: '360123', name: '安义县' },
          { code: '360124', name: '进贤县' },
        ],
      },
    ],
  },
  {
    code: '430000',
    name: '湖南省',
    children: [
      {
        code: '430100',
        name: '长沙市',
        children: [
          { code: '430102', name: '芙蓉区' },
          { code: '430103', name: '天心区' },
          { code: '430104', name: '岳麓区' },
          { code: '430105', name: '开福区' },
          { code: '430111', name: '雨花区' },
          { code: '430112', name: '望城区' },
          { code: '430121', name: '长沙县' },
          { code: '430181', name: '浏阳市' },
          { code: '430182', name: '宁乡市' },
        ],
      },
    ],
  },
  {
    code: '450000',
    name: '广西壮族自治区',
    children: [
      {
        code: '450100',
        name: '南宁市',
        children: [
          { code: '450102', name: '兴宁区' },
          { code: '450103', name: '青秀区' },
          { code: '450104', name: '江南区' },
          { code: '450105', name: '西乡塘区' },
          { code: '450107', name: '良庆区' },
          { code: '450108', name: '邕宁区' },
          { code: '450109', name: '武鸣区' },
          { code: '450123', name: '隆安县' },
          { code: '450124', name: '马山县' },
          { code: '450125', name: '上林县' },
          { code: '450126', name: '宾阳县' },
          { code: '450127', name: '横州市' },
        ],
      },
    ],
  },
  {
    code: '520000',
    name: '贵州省',
    children: [
      {
        code: '520100',
        name: '贵阳市',
        children: [
          { code: '520102', name: '南明区' },
          { code: '520103', name: '云岩区' },
          { code: '520111', name: '花溪区' },
          { code: '520112', name: '乌当区' },
          { code: '520113', name: '白云区' },
          { code: '520114', name: '观山湖区' },
          { code: '520121', name: '开阳县' },
          { code: '520122', name: '息烽县' },
          { code: '520123', name: '修文县' },
          { code: '520181', name: '清镇市' },
        ],
      },
    ],
  },
  {
    code: '530000',
    name: '云南省',
    children: [
      {
        code: '530100',
        name: '昆明市',
        children: [
          { code: '530102', name: '五华区' },
          { code: '530103', name: '盘龙区' },
          { code: '530111', name: '官渡区' },
          { code: '530112', name: '西山区' },
          { code: '530113', name: '东川区' },
          { code: '530114', name: '呈贡区' },
          { code: '530115', name: '晋宁区' },
          { code: '530122', name: '富民县' },
          { code: '530124', name: '宜良县' },
          { code: '530125', name: '石林彝族自治县' },
          { code: '530126', name: '嵩明县' },
          { code: '530127', name: '禄劝彝族苗族自治县' },
          { code: '530128', name: '寻甸回族彝族自治县' },
          { code: '530181', name: '安宁市' },
        ],
      },
    ],
  },
  {
    code: '620000',
    name: '甘肃省',
    children: [
      {
        code: '620100',
        name: '兰州市',
        children: [
          { code: '620102', name: '城关区' },
          { code: '620103', name: '七里河区' },
          { code: '620104', name: '西固区' },
          { code: '620105', name: '安宁区' },
          { code: '620111', name: '红古区' },
          { code: '620121', name: '永登县' },
          { code: '620122', name: '皋兰县' },
          { code: '620123', name: '榆中县' },
        ],
      },
    ],
  },
  {
    code: '640000',
    name: '宁夏回族自治区',
    children: [
      {
        code: '640100',
        name: '银川市',
        children: [
          { code: '640104', name: '兴庆区' },
          { code: '640105', name: '西夏区' },
          { code: '640106', name: '金凤区' },
          { code: '640121', name: '永宁县' },
          { code: '640122', name: '贺兰县' },
          { code: '640181', name: '灵武市' },
        ],
      },
    ],
  },
  {
    code: '150000',
    name: '内蒙古自治区',
    children: [
      {
        code: '150100',
        name: '呼和浩特市',
        children: [
          { code: '150102', name: '新城区' },
          { code: '150103', name: '回民区' },
          { code: '150104', name: '玉泉区' },
          { code: '150105', name: '赛罕区' },
          { code: '150121', name: '土默特左旗' },
          { code: '150122', name: '托克托县' },
          { code: '150123', name: '和林格尔县' },
          { code: '150124', name: '清水河县' },
          { code: '150125', name: '武川县' },
        ],
      },
      {
        code: '150200',
        name: '包头市',
        children: [
          { code: '150202', name: '东河区' },
          { code: '150203', name: '昆都仑区' },
          { code: '150204', name: '青山区' },
          { code: '150205', name: '石拐区' },
          { code: '150206', name: '白云鄂博矿区' },
          { code: '150207', name: '九原区' },
          { code: '150221', name: '土默特右旗' },
          { code: '150222', name: '固阳县' },
          { code: '150223', name: '达尔罕茂明安联合旗' },
        ],
      },
    ],
  },
];

export function getProvinces(): { code: string; name: string }[] {
  return regionData.map(p => ({ code: p.code, name: p.name }));
}

export function getCities(provinceCode: string): { code: string; name: string }[] {
  const province = regionData.find(p => p.code === provinceCode);
  return province?.children?.map(c => ({ code: c.code, name: c.name })) || [];
}

export function getDistricts(provinceCode: string, cityCode: string): { code: string; name: string }[] {
  const province = regionData.find(p => p.code === provinceCode);
  const city = province?.children?.find(c => c.code === cityCode);
  return city?.children?.map(d => ({ code: d.code, name: d.name })) || [];
}