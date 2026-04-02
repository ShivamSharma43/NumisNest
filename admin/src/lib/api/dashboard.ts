import { apiClient, type ApiResponse } from './client';
import type { DashboardStats, ChartData } from '@/types/admin';

export interface AnalyticsData {
  totalCoinViews: number;
  totalArticleViews: number;
  avgRarity: number;
  totalInquiries: number;
  materialDistribution: ChartData[];
  rarityBreakdown: ChartData[];
  topViewedCoins: { name: string; views: number }[];
  inquiryByStatus: ChartData[];
}

export const dashboardApi = {
  // BUG FIX: routes are under /admin/ prefix on the backend
  getStats: (): Promise<ApiResponse<DashboardStats>> =>
    apiClient.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats'),

  getMostViewedCoins: (limit?: number): Promise<ApiResponse<{ name: string; views: number }[]>> =>
    apiClient.get('/admin/dashboard/charts/most-viewed-coins', { limit: limit || 5 }),

  getEraPopularity: (): Promise<ApiResponse<ChartData[]>> =>
    apiClient.get('/admin/dashboard/charts/era-popularity'),

  getInquiryTrends: (days?: number): Promise<ApiResponse<{ date: string; count: number }[]>> =>
    apiClient.get('/admin/dashboard/charts/inquiry-trends', { days: days || 30 }),

  // BUG FIX: getAnalytics was missing — this is what Analytics.tsx calls
  getAnalytics: (): Promise<ApiResponse<AnalyticsData>> =>
    apiClient.get<ApiResponse<AnalyticsData>>('/admin/dashboard/analytics'),
};
