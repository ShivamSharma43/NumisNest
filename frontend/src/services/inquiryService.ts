import api from './api';
import type { CreateInquiryPayload, Inquiry } from '@/types';

export const inquiryService = {
  /**
   * Create new inquiry about a coin
   */
  createInquiry: async (data: CreateInquiryPayload): Promise<Inquiry> => {
    const response = await api.post('/inquiries', data);
    return response.data;
  },

  /**
   * Get user's inquiries
   * BUG FIX: Backend route is GET /inquiries, not /inquiries/my
   */
  getUserInquiries: async (): Promise<Inquiry[]> => {
    const response = await api.get('/inquiries');
    return response.data;
  },

  /**
   * Get single inquiry by ID
   */
  getInquiry: async (id: string): Promise<Inquiry> => {
    const response = await api.get(`/inquiries/${id}`);
    return response.data;
  },

  /**
   * Cancel/delete an inquiry
   */
  cancelInquiry: async (id: string): Promise<void> => {
    await api.delete(`/inquiries/${id}`);
  },
};