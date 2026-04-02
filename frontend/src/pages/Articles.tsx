import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { ArticleCardSkeleton } from '@/components/articles/ArticleCardSkeleton';
import { articleService, type Article } from '@/services/articleService';

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [articlesResponse, featured] = await Promise.all([
        articleService.getArticles({ limit: 100 }),
        articleService.getFeaturedArticles(),
      ]);
      setArticles(Array.isArray(articlesResponse.data) ? articlesResponse.data : []);
      setFeaturedArticles(Array.isArray(featured) ? featured : []);
    } catch (err) {
      console.error('Failed to load articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadArticles(); }, []);

  // Derive unique categories dynamically from actual articles
  const categories = useMemo(() => {
    const cats = new Set<string>();
    articles.forEach(a => { if (a.category) cats.add(a.category); });
    return ['All', ...Array.from(cats).sort()];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    let result = articles;
    if (selectedCategory !== 'All') {
      result = result.filter(a => a.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.excerpt || '').toLowerCase().includes(q) ||
        (a.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [articles, selectedCategory, searchQuery]);

  const featuredToShow = featuredArticles.slice(0, 1);
  const regularArticles = filteredArticles.filter(
    a => !featuredToShow.some(f => f._id === a._id)
  );

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm font-medium">Knowledge Hub</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Numismatic Articles</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Discover the fascinating world of coin collecting through expert articles,
              historical insights, and collecting guides.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search articles..." className="pl-10 bg-background/80 backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-border/50 bg-background sticky top-16 z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">

          {/* Error state */}
          {error && (
            <div className="text-center py-16">
              <p className="text-destructive mb-4">{error}</p>
              <Button variant="outline" onClick={loadArticles}>
                <RefreshCw className="w-4 h-4 mr-2" />Try Again
              </Button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => <ArticleCardSkeleton key={i} />)}
            </div>
          )}

          {/* Featured article */}
          {!isLoading && !error && featuredToShow.length > 0 && selectedCategory === 'All' && !searchQuery && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-semibold mb-6">Featured Article</h2>
              <ArticleCard article={featuredToShow[0]} featured />
            </div>
          )}

          {/* All articles grid */}
          {!isLoading && !error && (
            <>
              {regularArticles.length > 0 ? (
                <>
                  {(selectedCategory !== 'All' || searchQuery) && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {regularArticles.length} article{regularArticles.length !== 1 ? 's' : ''} found
                    </p>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularArticles.map((article, i) => (
                      <motion.div
                        key={article._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <ArticleCard article={article} />
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : articles.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">No articles yet</h3>
                  <p className="text-muted-foreground">Check back soon for new content.</p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No articles match your search.</p>
                  <Button variant="outline" className="mt-4"
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                    Clear Search
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
