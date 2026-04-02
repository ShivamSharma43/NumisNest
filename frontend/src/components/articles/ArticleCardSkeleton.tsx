import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ArticleCardSkeletonProps {
  featured?: boolean;
}

export function ArticleCardSkeleton({ featured = false }: ArticleCardSkeletonProps) {
  if (featured) {
    return (
      <Card className="overflow-hidden border-border/50">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-80">
            <Skeleton className="absolute inset-0" />
          </div>
          <CardContent className="p-6 md:p-8 flex flex-col justify-center space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden border-border/50">
      <div className="relative h-48">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex gap-1 pt-1">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

interface ArticleGridSkeletonProps {
  count?: number;
}

export function ArticleGridSkeleton({ count = 8 }: ArticleGridSkeletonProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}