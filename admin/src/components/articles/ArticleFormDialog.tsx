import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Save, FileText } from 'lucide-react';
import type { Article } from '@/types/admin';

const articleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  category: z.string().min(1, 'Category is required'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleFormDialogProps {
  article?: Article | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: ArticleFormData, status: 'draft' | 'published') => void;
}

const categories = ['History', 'Education', 'Investment', 'Care', 'News', 'Guides',
  'Coin History', 'Grading Guides', 'Collecting Tips', 'Market Trends', 'Era Spotlights', 'Rare Finds'];

export function ArticleFormDialog({ article, open, onClose, onSave }: ArticleFormDialogProps) {
  const [tagInput, setTagInput] = useState('');

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: { title: '', category: '', content: '', tags: [], coverImage: '' },
  });

  // BUG FIX: reset form whenever article prop changes (edit pre-fill)
  useEffect(() => {
    if (open) {
      form.reset({
        title: article?.title || '',
        category: article?.category || '',
        content: article?.content || '',
        tags: article?.tags || [],
        coverImage: article?.coverImage || '',
      });
      setTagInput('');
    }
  }, [open, article]);

  const tags = form.watch('tags');

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      form.setValue('tags', [...tags, t]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) =>
    form.setValue('tags', tags.filter((t) => t !== tag));

  const handleSaveAsDraft = () => form.handleSubmit((data) => onSave(data, 'draft'))();
  const handlePublish = () => form.handleSubmit((data) => onSave(data, 'published'))();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {article ? 'Edit Article' : 'Create New Article'}
          </DialogTitle>
          <DialogDescription>{article ? 'Update the article details below.' : 'Fill in the details to create a new article.'}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl><Input placeholder="Article title" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {/* BUG FIX: value must never be empty string for controlled Select */}
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>


              <FormField control={form.control} name="coverImage" render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Cover Image URL (optional)</FormLabel>
                  <FormControl><Input placeholder="https://i.imgur.com/example.jpg" {...field} value={field.value || ''} /></FormControl>
                  <p className="text-xs text-muted-foreground">Paste a direct image link. Leave blank for a default image.</p>
                  <FormMessage />
                </FormItem>
              )} />

            <FormField control={form.control} name="tags" render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="Add a tag" className="flex-1" />
                  <Button type="button" variant="outline" onClick={handleAddTag}><Plus className="h-4 w-4" /></Button>
                </div>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="content" render={({ field }) => (
              <FormItem>
                <FormLabel>Content (Markdown supported)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your article content here..." className="min-h-[300px] font-mono text-sm resize-none" {...field} />
                </FormControl>
                <p className="text-xs text-muted-foreground">Use # for headings, **bold**, *italic*, - for lists</p>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="button" variant="secondary" onClick={handleSaveAsDraft}>
                <Save className="h-4 w-4 mr-2" />Save as Draft
              </Button>
              <Button type="button" onClick={handlePublish}>
                <FileText className="h-4 w-4 mr-2" />Publish
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
