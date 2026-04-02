import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Tag, 
  Share2, 
  Bookmark,
  ChevronRight 
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { articleService, type Article } from '@/services/articleService';
import { useToast } from '@/hooks/use-toast';

export default function ArticleDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const foundArticle = await articleService.getArticleById(id);
        if (!foundArticle) {
          navigate('/articles');
          return;
        }
        setArticle(foundArticle);
        
        // Load related articles
        const related = await articleService.getRelatedArticles(id);
        setRelatedArticles(related.slice(0, 3));
        
        // Increment view count
        articleService.incrementViews(id);
      } catch (error) {
        console.error('Failed to load article:', error);
        navigate('/articles');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  if (!article) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Article not found</h2>
            <Button onClick={() => navigate('/articles')}>Back to Articles</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Estimate read time based on content length (average 200 words per minute)
  const wordCount = article.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleShare = async () => {
    try {
      await navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Article link has been copied to clipboard.',
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: 'Article saved!',
      description: 'This article has been added to your reading list.',
    });
  };

  // Parse content with markdown-like formatting
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        return (
          <h3 key={index} className="font-serif text-xl font-semibold mt-8 mb-4 text-foreground">
            {paragraph.replace(/\*\*/g, '')}
          </h3>
        );
      }
      if (paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {items.map((item, i) => (
              <li key={i}>{item.replace('- ', '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-muted-foreground leading-relaxed mb-4">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 h-[50vh]">
          <img
            src={article.coverImage && article.coverImage.startsWith("http") ? article.coverImage : "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=1200&q=80"}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=1200&q=80"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />
        </div>

        <div className="relative container mx-auto px-4 pt-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/articles" className="hover:text-primary transition-colors">
              Articles
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/articles')}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Button>

          {/* Article Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              {article.category}
            </Badge>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              {article.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              {article.excerpt}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {readTime} min read
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleBookmark} className="gap-2">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-none prose prose-lg dark:prose-invert"
            >
              <Card className="border-border/50">
                <CardContent className="p-8 md:p-12">
                  {renderContent(article.content)}

                  <Separator className="my-8" />

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author Card */}
              <Card className="border-border/50 sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{article.author}</p>
                      <p className="text-sm text-muted-foreground">Numismatic Expert</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contributing writer specializing in {article.category.toLowerCase()} and 
                    coin collecting education.
                  </p>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Explore More</h3>
                  <div className="space-y-2">
                    <Link 
                      to="/coins" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      → Browse Coin Collection
                    </Link>
                    <Link 
                      to="/articles" 
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      → More Articles
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-2xl font-semibold mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle._id} article={relatedArticle} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}