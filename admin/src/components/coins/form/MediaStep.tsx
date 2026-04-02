import { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Image as ImageIcon, X } from 'lucide-react';
import {
  FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CoinFormData } from '@/lib/coinFormSchema';

interface MediaStepProps {
  form: UseFormReturn<CoinFormData>;
}

export function MediaStep({ form }: MediaStepProps) {
  const imageUrl = form.watch('imageUrl');
  const [preview, setPreview] = useState<string>(imageUrl || '');
  const [error, setError] = useState(false);

  useEffect(() => {
    setPreview(imageUrl || '');
    setError(false);
  }, [imageUrl]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Media</h2>
        <p className="text-sm text-muted-foreground">
          Paste a public image URL for this coin. Use Imgur, Cloudinary, or any direct image link.
        </p>
      </div>

      <FormField
        control={form.control}
        name="imageUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Image URL</FormLabel>
            <FormControl>
              <Input
                placeholder="https://i.imgur.com/example.jpg"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Paste a direct link to an image (JPG, PNG, WEBP). Free options: imgur.com or postimages.org
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Live preview */}
      <div className="rounded-xl border-2 border-dashed border-border p-4 min-h-[200px] flex items-center justify-center">
        {preview && !error ? (
          <div className="relative w-full">
            <img
              src={preview}
              alt="Coin preview"
              className="max-h-72 mx-auto rounded-lg object-contain"
              onError={() => setError(true)}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={() => { form.setValue('imageUrl', ''); setPreview(''); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center text-muted-foreground space-y-2">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm">
              {error ? '⚠️ Could not load image — check the URL' : 'Image preview will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
