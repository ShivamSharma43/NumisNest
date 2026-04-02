// Admin Portal Types
// BUG FIX: MongoDB returns _id — all types now use _id as primary, id as optional alias

export type CoinDenomination = 'old_coin' | '1_rupee' | '2_rupees' | '5_rupees' | '10_rupees' | '20_rupees';

export interface Coin {
  _id: string;       // MongoDB primary key
  id?: string;       // alias — populated from _id by normalizer
  name: string;
  year: number;
  denomination?: string;
  era?: string;
  leader?: string;
  ruler?: string;
  rarity: number;
  dynasty?: string;
  material: string;
  weight?: number;
  diameter?: number;
  mint?: string;
  mintLocation?: string;
  description?: string;
  historicalContext?: string;
  imageUrl?: string;
  images?: string[];
  status: 'draft' | 'published' | 'archived';
  featured?: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  _id: string;
  id?: string;
  userId: string;
  userName?: string;
  userEmail: string;
  coinId?: string;
  coinName?: string;
  subject?: string;
  message: string;
  status: 'pending' | 'responded' | 'closed' | 'new' | 'contacted';
  createdAt: string;
  updatedAt?: string;
}

export interface Article {
  _id: string;
  id?: string;
  title: string;
  slug?: string;
  category: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags: string[];
  status: 'draft' | 'published';
  published?: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCoins: number;
  totalUsers: number;
  totalInquiries: number;
  newInquiriesToday: number;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface AdminUser {
  _id: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'super_admin' | 'user';
}
