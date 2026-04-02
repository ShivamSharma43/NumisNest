import api from './api';

export interface ArticleFilters {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ArticleCategory = 
  | 'Coin History'
  | 'Grading Guides'
  | 'Collecting Tips'
  | 'Market Trends'
  | 'Era Spotlights'
  | 'Rare Finds';

export const articleCategories: ArticleCategory[] = [
  'Coin History',
  'Grading Guides',
  'Collecting Tips',
  'Market Trends',
  'Era Spotlights',
  'Rare Finds',
];

export interface PaginatedArticles {
  data: Article[];
  total: number;
  page: number;
  totalPages: number;
}

export const articleService = {
  /**
   * Get all articles with filters and pagination
   */
  getArticles: async (filters?: ArticleFilters): Promise<PaginatedArticles> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/articles?${params.toString()}`);
    return response.data;
  },

  /**
   * Get single article by ID
   */
  getArticleById: async (id: string): Promise<Article | null> => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  /**
   * Get featured articles
   */
  getFeaturedArticles: async (): Promise<Article[]> => {
    const response = await api.get('/articles/featured');
    return response.data;
  },

  /**
   * Increment article view count
   * BUG FIX: endpoint is /views not /view
   */
  incrementViews: async (id: string): Promise<void> => {
    try {
      await api.post(`/articles/${id}/views`);
    } catch (error) {
      console.warn('[ArticleService] Failed to increment views:', error);
    }
  },

  /**
   * Get all unique categories
   */
  getCategories: async (): Promise<ArticleCategory[]> => {
    const response = await api.get('/articles/categories');
    return response.data;
  },

  /**
   * Get related articles by same category
   * BUG FIX: No /related endpoint - query by category instead
   */
  getRelatedArticles: async (articleId: string): Promise<Article[]> => {
    try {
      const article = await articleService.getArticleById(articleId);
      if (!article) return [];
      const response = await api.get(`/articles?category=${encodeURIComponent(article.category)}&limit=3`);
      // Exclude the current article
      return (response.data.data || []).filter((a: Article) => a._id !== articleId);
    } catch (error) {
      console.warn('[ArticleService] Failed to get related articles:', error);
      return [];
    }
  },
};