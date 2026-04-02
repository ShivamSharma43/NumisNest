import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { ArticleTable, type ArticleSortField, type SortDirection } from '@/components/articles/ArticleTable';
import { ArticleFormDialog } from '@/components/articles/ArticleFormDialog';
import { DeleteArticleDialog } from '@/components/articles/DeleteArticleDialog';
import { CoinPagination } from '@/components/coins/CoinPagination';
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle, useToggleArticlePublish, useToggleArticleFeatured } from '@/hooks/useArticles';
import { toast } from 'sonner';
import type { Article } from '@/types/admin';

const ITEMS_PER_PAGE = 8;

export default function ManageArticles() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState<ArticleSortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // API hooks
  const { data: articlesResponse, isLoading, error } = useArticles({
    search: searchQuery || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortField,
    sortDirection,
  });

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const togglePublish = useToggleArticlePublish();
  const toggleFeatured = useToggleArticleFeatured();

  // Get articles from response or empty array
  const articles = articlesResponse?.data || [];
  const totalPages = articlesResponse?.totalPages || 1;
  const totalItems = articlesResponse?.total || 0;

  // Calculate stats from current data
  const stats = {
    total: totalItems,
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
    totalViews: articles.reduce((sum, a) => sum + a.views, 0),
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleSort = (field: ArticleSortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleAddNew = () => {
    setSelectedArticle(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setFormDialogOpen(true);
  };

  const handleDelete = (article: Article) => {
    setSelectedArticle(article);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedArticle) {
      try {
        await deleteArticle.mutateAsync(selectedArticle._id || selectedArticle.id);
        toast.success('Article deleted successfully');
        setDeleteDialogOpen(false);
        setSelectedArticle(null);
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  const handleToggleFeatured = async (article: Article) => {
    try {
      await toggleFeatured.mutateAsync(article._id || article.id || '');
      toast.success(`Article ${article.featured ? 'removed from' : 'added to'} featured`);
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const handleTogglePublish = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      await togglePublish.mutateAsync({ id: article._id || article.id || '', status: newStatus });
      toast.success(`Article ${newStatus === 'published' ? 'published' : 'unpublished'}`);
    } catch (error) {
      toast.error('Failed to update article status');
    }
  };

  const handleSave = async (data: { title: string; category: string; content: string; tags: string[] }, status: 'draft' | 'published') => {
    try {
      if (selectedArticle) {
        await updateArticle.mutateAsync({
          id: selectedArticle._id || selectedArticle.id,
          data: { ...data, status },
        });
        toast.success('Article updated successfully');
      } else {
        await createArticle.mutateAsync({ ...data, status });
        toast.success(`Article ${status === 'published' ? 'published' : 'saved as draft'}`);
      }
      setFormDialogOpen(false);
      setSelectedArticle(null);
    } catch (error) {
      toast.error('Failed to save article');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load articles. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Manage Articles</h1>
          <p className="text-muted-foreground mt-1">
            Create and publish educational content
          </p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Articles</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Eye className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.published}</p>
              <p className="text-xs text-muted-foreground">Published</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <EyeOff className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.draft}</p>
              <p className="text-xs text-muted-foreground">Drafts</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Eye className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ArticleFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusFilterChange}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryFilterChange}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <ArticleTable
              articles={articles}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onTogglePublish={handleTogglePublish}
              onToggleFeatured={handleToggleFeatured}
            />

            {totalPages > 1 && (
              <CoinPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </motion.div>

      <ArticleFormDialog
        article={selectedArticle}
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setSelectedArticle(null);
        }}
        onSave={handleSave}
      />

      <DeleteArticleDialog
        article={selectedArticle}
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedArticle(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
