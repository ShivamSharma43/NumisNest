import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { CoinFormData } from '@/lib/coinFormSchema';

interface SpecificationsStepProps {
  form: UseFormReturn<CoinFormData>;
}

export function SpecificationsStep({ form }: SpecificationsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Specifications</h2>
        <p className="text-sm text-muted-foreground">
          Add physical specifications and historical context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (grams)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 7.99"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormDescription>Weight in grams</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diameter (mm)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 22.05"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                />
              </FormControl>
              <FormDescription>Diameter in millimeters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mint Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Royal Mint, London" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>Where the coin was minted</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dynasty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dynasty / Period</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Julio-Claudian Dynasty" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>Historical dynasty or period</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
