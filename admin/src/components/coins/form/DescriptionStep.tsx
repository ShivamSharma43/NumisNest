import { UseFormReturn } from 'react-hook-form';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import type { CoinFormData } from '@/lib/coinFormSchema';

interface DescriptionStepProps {
  form: UseFormReturn<CoinFormData>;
}

export function DescriptionStep({ form }: DescriptionStepProps) {
  const insertMarkdown = (fieldName: 'description' | 'historicalContext', prefix: string, suffix: string = '') => {
    const editorId = `${fieldName}-editor`;
    const textarea = document.getElementById(editorId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = form.getValues(fieldName) || '';
    const selectedText = text.substring(start, end);
    
    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    form.setValue(fieldName, newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const renderToolbar = (fieldName: 'description' | 'historicalContext') => (
    <div className="flex items-center gap-1 p-2 bg-muted/30 border-b">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => insertMarkdown(fieldName, '**', '**')}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => insertMarkdown(fieldName, '*', '*')}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => insertMarkdown(fieldName, '- ')}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => insertMarkdown(fieldName, '1. ')}
        title="Numbered List"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Description & History</h2>
        <p className="text-sm text-muted-foreground">
          Write a detailed description and historical context for the coin.
        </p>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Coin Description</FormLabel>
            <div className="rounded-lg border bg-background overflow-hidden">
              {renderToolbar('description')}
              <FormControl>
                <Textarea
                  id="description-editor"
                  placeholder="Describe the coin's design, condition, provenance..."
                  className="min-h-[120px] border-0 rounded-none resize-none focus-visible:ring-0"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
            </div>
            <FormDescription>
              Use Markdown for formatting: **bold**, *italic*, - bullet points
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="historicalContext"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Historical Context</FormLabel>
            <div className="rounded-lg border bg-background overflow-hidden">
              {renderToolbar('historicalContext')}
              <FormControl>
                <Textarea
                  id="historicalContext-editor"
                  placeholder="Provide historical background, significance, era context..."
                  className="min-h-[120px] border-0 rounded-none resize-none focus-visible:ring-0"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
            </div>
            <FormDescription>
              Describe the historical significance and context of this coin
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
