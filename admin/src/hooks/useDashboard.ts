import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboard';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  analytics: () => [...dashboardKeys.all, 'analytics'] as const,
  mostViewedCoins: (limit?: number) => [...dashboardKeys.all, 'most-viewed-coins', limit] as const,
  eraPopularity: () => [...dashboardKeys.all, 'era-popularity'] as const,
  inquiryTrends: (days?: number) => [...dashboardKeys.all, 'inquiry-trends', days] as const,
};

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: dashboardKeys.analytics(),
    queryFn: () => dashboardApi.getAnalytics(),
  });
}

export function useMostViewedCoins(limit?: number) {
  return useQuery({
    queryKey: dashboardKeys.mostViewedCoins(limit),
    queryFn: () => dashboardApi.getMostViewedCoins(limit),
  });
}

export function useEraPopularity() {
  return useQuery({
    queryKey: dashboardKeys.eraPopularity(),
    queryFn: () => dashboardApi.getEraPopularity(),
  });
}

export function useInquiryTrends(days?: number) {
  return useQuery({
    queryKey: dashboardKeys.inquiryTrends(days),
    queryFn: () => dashboardApi.getInquiryTrends(days),
  });
}
