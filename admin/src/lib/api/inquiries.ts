import { apiClient, type ApiResponse, type PaginatedResponse } from './client';
import type { Inquiry } from '@/types/admin';

export interface InquiryFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export const inquiriesApi = {
  // BUG FIX: admin inquiry list goes through /admin prefix
  getAll: (filters?: InquiryFilters): Promise<PaginatedResponse<Inquiry>> =>
    apiClient.get<PaginatedResponse<Inquiry>>('/admin/inquiries', filters as Record<string, string | number | boolean>),

  getById: (id: string): Promise<ApiResponse<Inquiry>> =>
    apiClient.get<ApiResponse<Inquiry>>(`/inquiries/${id}`),

  // BUG FIX: status update goes through /admin prefix
  updateStatus: (id: string, status: Inquiry['status']): Promise<ApiResponse<Inquiry>> =>
    apiClient.patch<ApiResponse<Inquiry>>(`/admin/inquiries/${id}/status`, { status }),

  // Send email reply and auto-update status to 'contacted'
  sendReply: (id: string, subject: string, message: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.post<ApiResponse<{ message: string }>>(`/admin/inquiries/${id}/reply`, { subject, message }),

  // Delete closed inquiry
  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/admin/inquiries/${id}`),
};
