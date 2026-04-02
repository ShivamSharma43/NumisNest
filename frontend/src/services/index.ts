/**
 * Service Layer Exports
 * 
 * All API services are exported from here for easy importing.
 * 
 * Usage:
 * import { coinService, authService, wishlistService } from '@/services';
 */

export { default as api } from './api';
export { checkApiHealth } from './api';
export { coinService } from './coinService';
export { authService } from './authService';
export { wishlistService } from './wishlistService';
export { inquiryService } from './inquiryService';
export { articleService } from './articleService';

// Re-export types
export type { ArticleFilters, PaginatedArticles } from './articleService';
export type { Article, ArticleCategory } from '@/data/articlesData';
