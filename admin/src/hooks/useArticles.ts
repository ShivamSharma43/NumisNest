import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi, type ArticleFilters, type CreateArticleData } from '@/lib/api/articles';

export const articleKeys = {
  all: ['articles'] as const,
  lists: () => [...articleKeys.all, 'list'] as const,
  list: (filters: ArticleFilters) => [...articleKeys.lists(), filters] as const,
  detail: (id: string) => [...articleKeys.all, 'detail', id] as const,
};

export function useArticles(filters?: ArticleFilters) {
  return useQuery({
    queryKey: articleKeys.list(filters || {}),
    queryFn: () => articlesApi.getAll(filters),
  });
}

export function useArticle(id: string) {
  return useQuery({
    queryKey: articleKeys.detail(id),
    queryFn: () => articlesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateArticleData) => articlesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.lists() }),
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateArticleData> }) =>
      articlesApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.id) });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.lists() }),
  });
}

export function useToggleArticlePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesApi.togglePublished(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.lists() }),
  });
}

// useToggleArticlePublish — used by ManageArticles.tsx
// Accepts { id, status } matching the existing page's call signature
export function useToggleArticlePublish() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'draft' | 'published' }) =>
      articlesApi.update(id, { published: status === 'published' }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: articleKeys.detail(variables.id) });
    },
  });
}

export function useToggleArticleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articlesApi.toggleFeatured(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.lists() }),
  });
}
