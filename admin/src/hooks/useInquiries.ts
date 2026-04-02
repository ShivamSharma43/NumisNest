import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiriesApi, type InquiryFilters } from '@/lib/api/inquiries';
import type { Inquiry } from '@/types/admin';

export const inquiryKeys = {
  all: ['inquiries'] as const,
  lists: () => [...inquiryKeys.all, 'list'] as const,
  list: (filters: InquiryFilters) => [...inquiryKeys.lists(), filters] as const,
  detail: (id: string) => [...inquiryKeys.all, 'detail', id] as const,
};

export function useInquiries(filters?: InquiryFilters) {
  return useQuery({
    queryKey: inquiryKeys.list(filters || {}),
    queryFn: () => inquiriesApi.getAll(filters),
  });
}

export function useInquiry(id: string) {
  return useQuery({
    queryKey: inquiryKeys.detail(id),
    queryFn: () => inquiriesApi.getById(id),
    enabled: !!id,
  });
}

export function useUpdateInquiryStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Inquiry['status'] }) =>
      inquiriesApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: inquiryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inquiryKeys.detail(variables.id) });
    },
  });
}

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inquiriesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: inquiryKeys.all }),
  });
}
