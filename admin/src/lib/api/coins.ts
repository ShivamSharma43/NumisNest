import { apiClient, type ApiResponse, type PaginatedResponse } from './client';
import type { Coin, CoinDenomination } from '@/types/admin';

export interface CoinFilters {
  search?: string;
  era?: string;
  material?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCoinData {
  name: string;
  year: number;
  era: string;
  ruler?: string;
  dynasty?: string;
  material: string;
  weight?: number;
  diameter?: number;
  mintLocation?: string;
  rarity: number;
  description: string;
  historicalContext?: string;
  images?: string[];
  featured?: boolean;
}

export const coinsApi = {
  // Admin route — shows ALL coins including drafts, supports status/material filtering
  getAll: (filters?: CoinFilters): Promise<PaginatedResponse<Coin>> =>
    apiClient.get<PaginatedResponse<Coin>>('/admin/coins', filters as Record<string, string | number | boolean>),

  getById: (id: string): Promise<Coin> =>
    apiClient.get<Coin>(`/coins/${id}`),

  // BUG FIX: write operations go through /admin prefix (protected)
  create: (data: CreateCoinData): Promise<ApiResponse<Coin>> =>
    apiClient.post<ApiResponse<Coin>>('/admin/coins', data),

  update: (id: string, data: Partial<CreateCoinData>): Promise<ApiResponse<Coin>> =>
    apiClient.put<ApiResponse<Coin>>(`/admin/coins/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/admin/coins/${id}`),

  toggleFeatured: (id: string): Promise<ApiResponse<Coin>> =>
    apiClient.patch<ApiResponse<Coin>>(`/admin/coins/${id}/featured`, {}),
};
