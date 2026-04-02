import api from './api';
import type { Coin, CoinFilters, PaginatedResponse } from '@/types';

export const coinService = {
  getCoins: async (filters?: CoinFilters): Promise<PaginatedResponse<Coin>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    // Send as 'era' — backend queries both era and denomination fields
    if (filters?.CoinType) params.append('era', filters.CoinType);
    if (filters?.material) params.append('material', filters.material);
    if (filters?.minRarity) params.append('minRarity', filters.minRarity.toString());
    if (filters?.maxRarity) params.append('maxRarity', filters.maxRarity.toString());
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    const response = await api.get(`/coins?${params.toString()}`);
    return response.data;
  },

  getCoin: async (id: string): Promise<Coin> => {
    const response = await api.get(`/coins/${id}`);
    return response.data;
  },

  getFeaturedCoins: async (): Promise<Coin[]> => {
    const response = await api.get('/coins/featured');
    return response.data;
  },

  getRelatedCoins: async (id: string): Promise<Coin[]> => {
    const response = await api.get(`/coins/${id}/related`);
    return response.data;
  },

  incrementViews: async (id: string): Promise<void> => {
    try { await api.post(`/coins/${id}/views`); } catch { /* silent */ }
  },
};
