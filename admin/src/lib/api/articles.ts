import { apiClient, type ApiResponse, type PaginatedResponse } from './client';
import type { Article } from '@/types/admin';

export interface ArticleFilters {
  search?: string;
  category?: string;
  published?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateArticleData {
  title: string;
  category: string;
  content: string;
  excerpt?: string;
  author?: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
}

export const articlesApi = {
  // Public read
  getAll: (filters?: ArticleFilters): Promise<PaginatedResponse<Article>> =>
    apiClient.get<PaginatedResponse<Article>>('/articles', filters as Record<string, string | number | boolean>),

  getById: (id: string): Promise<Article> =>
    apiClient.get<Article>(`/articles/${id}`),

  // BUG FIX: write operations go through /admin prefix
  create: (data: CreateArticleData): Promise<ApiResponse<Article>> =>
    apiClient.post<ApiResponse<Article>>('/admin/articles', data),

  update: (id: string, data: Partial<CreateArticleData>): Promise<ApiResponse<Article>> =>
    apiClient.put<ApiResponse<Article>>(`/admin/articles/${id}`, data),

  delete: (id: string): Promise<ApiResponse<{ message: string }>> =>
    apiClient.delete<ApiResponse<{ message: string }>>(`/admin/articles/${id}`),

  togglePublished: (id: string): Promise<ApiResponse<Article>> =>
    apiClient.patch<ApiResponse<Article>>(`/admin/articles/${id}/published`, {}),

  toggleFeatured: (id: string): Promise<ApiResponse<Article>> =>
    apiClient.patch<ApiResponse<Article>>(`/admin/articles/${id}/featured`, {}),
};
