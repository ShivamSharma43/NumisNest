import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coinsApi, type CoinFilters, type CreateCoinData } from '@/lib/api/coins';
import type { Coin } from '@/types/admin';

export const coinKeys = {
  all: ['coins'] as const,
  lists: () => [...coinKeys.all, 'list'] as const,
  list: (filters: CoinFilters) => [...coinKeys.lists(), filters] as const,
  detail: (id: string) => [...coinKeys.all, 'detail', id] as const,
};

export function useCoins(filters?: CoinFilters) {
  return useQuery({
    queryKey: coinKeys.list(filters || {}),
    queryFn: () => coinsApi.getAll(filters),
  });
}

export function useCoin(id: string) {
  return useQuery({
    queryKey: coinKeys.detail(id),
    queryFn: () => coinsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCoinData) => coinsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: coinKeys.lists() }),
  });
}

export function useUpdateCoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCoinData> }) =>
      coinsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: coinKeys.lists() });
      queryClient.invalidateQueries({ queryKey: coinKeys.detail(variables.id) });
    },
  });
}

export function useDeleteCoin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coinsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: coinKeys.lists() }),
  });
}

export function useToggleCoinFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coinsApi.toggleFeatured(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: coinKeys.lists() }),
  });
}

// useToggleCoinPublish — used by ManageCoins.tsx
// BUG FIX: was toggling 'featured' field — now correctly updates 'status' to draft/published
export function useToggleCoinPublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'published' }) =>
      coinsApi.update(id, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: coinKeys.lists() });
      queryClient.invalidateQueries({ queryKey: coinKeys.detail(variables.id) });
    },
  });
}
