export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Legacy interface for compatibility
export interface UserLegacy {
  id: string;
  username: string;
  email: string;
  phone: string;
  profileImage?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  price: number;
  colour: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  images: string[];
  inStock: boolean;
  totalStock: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
}

// Legacy interface for compatibility
export interface ProductLegacy {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: string[];
  price: number;
  colour: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  images: string[];
  inStock: boolean;
  totalStock: number;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  selectedColour: string;
  selectedSize: string;
  priceAtTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  updatedAt: string;
}

// Legacy interfaces for compatibility
export interface CartItemLegacy {
  id: string;
  productId: string;
  product: ProductLegacy;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface CartLegacy {
  items: CartItemLegacy[];
  total: number;
}

// API Response interfaces
export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ProductFilters {
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  colour?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  inStock?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface ProductStats {
  totalProducts: number;
  totalInStock: number;
  totalOutOfStock: number;
  totalStock: number;
  totalSold: number;
  averagePrice: number;
  maxPrice: number;
  minPrice: number;
}

export type SortOption = 'price-low' | 'price-high' | 'popularity' | 'trending';
export type FilterOption = 'all' | 'trending' | 'popular' | 'sale';