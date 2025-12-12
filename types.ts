export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: number;
  colors?: string[];
  stock: number;
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface FilterOptions {
  category: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  color?: string;
  search?: string;
  inStockOnly?: boolean;
  sortBy?: 'newest' | 'priceLowHigh' | 'priceHighLow' | 'topRated';
  page?: number;
  limit?: number;
}

export interface Review {
  id: number;
  productId: number;
  user: string;
  rating: number;
  date: string;
  content: string;
  avatar: string;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: CartItem[];
}

export interface Address {
  id: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'Visa' | 'MasterCard' | 'Amex' | 'PayPal';
  last4: string;
  expiry: string;
  cardHolder: string;
  isDefault: boolean;
}