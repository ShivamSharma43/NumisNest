// Coin Types
export interface Coin {
  _id: string;
  name: string;
  year: number;
  CoinType?: CoinType;       // may be missing for admin-created coins
  ruler?: string;
  dynasty?: string;
  material: Material;
  weight?: number;
  diameter?: number;
  rarity: number; // 1-5 scale
  description: string;
  historicalContext?: string;
  mintLocation?: string;
  images: string[];
  imageUrl?: string;         // admin form stores single URL here
  denomination?: string;     // admin form field
  status?: string;           // draft | published
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CoinType = 'old' | '1-rupee' | '2-rupees' | '5-rupees' | '10-rupees' | '20-rupees';
export type Material = 'gold' | 'silver' | 'copper' | 'bronze' | 'nickel' | 'other';

export interface CoinFilters {
  search?: string;
  CoinType?: CoinType;
  material?: Material;
  minRarity?: number;
  maxRarity?: number;
  sortBy?: 'views' | 'newest' | 'rarity' | 'year';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  wishlist: string[]; // Coin IDs
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Inquiry Types
export interface Inquiry {
  _id: string;
  coinId: string;
  coinName: string;
  userId: string;
  userEmail: string;
  message: string;
  status: 'pending' | 'responded' | 'closed';
  createdAt: string;
}

export interface CreateInquiryPayload {
  coinId: string;
  coinName: string;
  message: string;
}

// Article Types (for Phase 2)
export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Error
export interface ApiError {
  message: string;
  status: number;
}
