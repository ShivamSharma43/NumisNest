export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  author: string;
  publishedAt: string;
  readTime: number;
  imageUrl: string;
  tags: string[];
  featured?: boolean;
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

// Empty mock articles - data will come from API
export const mockArticles: Article[] = [];