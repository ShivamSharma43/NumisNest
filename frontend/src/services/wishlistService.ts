import api from './api';
import type { Coin } from '@/types';

export const wishlistService = {
  /**
   * Get user's wishlist with full coin data
   */
  getWishlist: async (): Promise<Coin[]> => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  /**
   * Get just the wishlist coin IDs (lighter request)
   */
  getWishlistIds: async (): Promise<string[]> => {
    const response = await api.get('/wishlist/ids');
    return response.data;
  },

  /**
   * Add coin to wishlist
   * BUG FIX: Backend expects POST /wishlist with body {coinId}, not POST /wishlist/:coinId
   */
  addToWishlist: async (coinId: string): Promise<{ message: string; wishlist: string[] }> => {
    const response = await api.post(`/wishlist`, { coinId });
    return response.data;
  },

  /**
   * Remove coin from wishlist
   */
  removeFromWishlist: async (coinId: string): Promise<{ message: string; wishlist: string[] }> => {
    const response = await api.delete(`/wishlist/${coinId}`);
    return response.data;
  },

  /**
   * Check if coin is in wishlist
   * BUG FIX: No /wishlist/check/:coinId route exists - use local state instead
   */
  isInWishlist: async (coinId: string): Promise<boolean> => {
    const ids = await wishlistService.getWishlistIds();
    return ids.includes(coinId);
  },

  /**
   * Clear entire wishlist
   */
  clearWishlist: async (): Promise<void> => {
    await api.delete('/wishlist');
  },
};