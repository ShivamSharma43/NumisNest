import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { format } from 'date-fns';
import type { Article } from '@/types/admin';

export type ArticleSortField = 'title' | 'category' | 'status' | 'views' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

interface ArticleTableProps {
  articles: Article[];
  sortField: ArticleSortField;
  sortDirection: SortDirection;
  onSort: (field: ArticleSortField) => void;
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
  onTogglePublish: (article: Article) => void;
  onToggleFeatured: (article: Article) => void;
}

const statusColors: Record<string, string> = {
  published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export function ArticleTable({
  articles,
  sortField,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onTogglePublish,
  onToggleFeatured,
}: ArticleTableProps) {
  const SortHeader = ({ field, children }: { field: ArticleSortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      onClick={() => onSort(field)}
    >
      {children}
      <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === field ? 'text-primary' : ''}`} />
    </Button>
  );

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[300px]">
              <SortHeader field="title">Title</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="category">Category</SortHeader>
            </TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>
              <SortHeader field="status">Status</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="views">Views</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="createdAt">Created</SortHeader>
            </TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No articles found
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article._id || article.id || article.title} className="group">
                <TableCell className="font-medium">
                  <div className="max-w-[280px] truncate" title={article.title}>
                    {article.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{article.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {article.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{article.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusColors[article.status]}>
                    {article.status}
                  </Badge>
                </TableCell>
                <TableCell>{article.views.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(article.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(article)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTogglePublish(article)}>
                        {article.status === 'published' ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleFeatured(article)}>
                        <Star className={`h-4 w-4 mr-2 ${article.featured ? 'fill-amber-400 text-amber-400' : ''}`} />
                        {article.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(article)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
