import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { articleCategories, type ArticleCategory } from '@/data/articlesData';

interface CategoryFilterProps {
  selectedCategory: ArticleCategory | 'All';
  onCategoryChange: (category: ArticleCategory | 'All') => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button
        variant={selectedCategory === 'All' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onCategoryChange('All')}
        className="relative"
      >
        All Articles
        {selectedCategory === 'All' && (
          <motion.div
            layoutId="categoryIndicator"
            className="absolute inset-0 bg-primary rounded-md -z-10"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Button>
      {articleCategories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="relative"
        >
          {category}
          {selectedCategory === category && (
            <motion.div
              layoutId="categoryIndicator"
              className="absolute inset-0 bg-primary rounded-md -z-10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
        </Button>
      ))}
    </div>
  );
}