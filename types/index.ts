export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  details: string;
  material: string[];
  colors: string[];
  sizes: string[];
  images: string[];
  style: string;
  rating: number;
  reviewCount: number;
  isHot?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMaterial: string;
  selectedColor: string;
  selectedSize: string;
}

export interface Address {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  zipCode?: string;
}
