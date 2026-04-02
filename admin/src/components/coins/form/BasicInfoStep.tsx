import { UseFormReturn } from 'react-hook-form';
import { Star } from 'lucide-react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CoinFormData, COIN_DENOMINATIONS } from '@/lib/coinFormSchema';

interface BasicInfoStepProps {
  form: UseFormReturn<CoinFormData>;
}

const materials = [
  'Gold',
  'Silver',
  'Bronze',
  'Copper',
  'Electrum',
  'Platinum',
  'Nickel',
  'Other',
];

function RarityStars({ value, onChange }: { value: number; onChange: (val: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 rounded hover:bg-muted transition-colors"
        >
          <Star
            className={cn(
              'h-6 w-6 transition-colors',
              star <= value
                ? 'fill-primary text-primary'
                : 'text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function BasicInfoStep({ form }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p className="text-sm text-muted-foreground">
          Enter the essential details about this coin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coin Name *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Gold Sovereign" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 1820 or -44 for BCE"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="denomination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coin Value *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select coin value" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {COIN_DENOMINATIONS.map((denom) => (
                    <SelectItem key={denom.value} value={denom.value}>
                      {denom.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Category for automatic grouping</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leader"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Leader</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Julius Caesar, George III" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>Monarch or leader at time of minting</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a material" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {materials.map((material) => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rarity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rarity *</FormLabel>
              <FormControl>
                <RarityStars value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>Rate from 1 (common) to 5 (extremely rare)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
