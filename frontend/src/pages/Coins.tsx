import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { CoinCard } from '@/components/coins/CoinCard';
import { CoinGridSkeleton } from '@/components/coins/CoinCardSkeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { coinService } from '@/services/coinService';
import { useDebounce } from '@/hooks/useDebounce';
import type { Coin } from '@/types';

const denominationOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'old_coin', label: 'Old Coins' },
  { value: '1_rupee', label: '₹1 Rupee' },
  { value: '2_rupees', label: '₹2 Rupees' },
  { value: '5_rupees', label: '₹5 Rupees' },
  { value: '10_rupees', label: '₹10 Rupees' },
  { value: '20_rupees', label: '₹20 Rupees' },
];

const materialOptions = [
  { value: 'all', label: 'All Materials' },
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'copper', label: 'Copper' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'nickel', label: 'Nickel' },
  { value: 'other', label: 'Other' },
];

const sortOptions = [
  { value: 'views', label: 'Most Viewed' },
  { value: 'newest', label: 'Newest' },
  { value: 'rarity', label: 'Rarity' },
  { value: 'year', label: 'Year' },
];

// ─── FilterPanel defined OUTSIDE Coins component ────────────────────────────
// This is critical: defining it inside would create a new component type on every
// render → React unmounts + remounts → Input loses focus after each keystroke.
interface FilterPanelProps {
  search: string;
  onSearchChange: (v: string) => void;
  denomination: string;
  onDenominationChange: (v: string) => void;
  material: string;
  onMaterialChange: (v: string) => void;
  rarityRange: number[];
  onRarityChange: (v: number[]) => void;
  sortBy: string;
  onSortByChange: (v: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

function FilterPanel({
  search, onSearchChange,
  denomination, onDenominationChange,
  material, onMaterialChange,
  rarityRange, onRarityChange,
  sortBy, onSortByChange,
  hasActiveFilters, onClearFilters,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium">Search</Label>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search coins..."
            className="pl-10"
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Denomination</Label>
        <Select value={denomination} onValueChange={onDenominationChange}>
          <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
          <SelectContent>
            {denominationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">Material</Label>
        <Select value={material} onValueChange={onMaterialChange}>
          <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
          <SelectContent>
            {materialOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium">
          Rarity: {rarityRange[0]}★ – {rarityRange[1]}★
        </Label>
        <div className="mt-3 px-1">
          <Slider min={1} max={5} step={1} value={rarityRange}
            onValueChange={onRarityChange} className="w-full" />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium">Sort By</Label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
          <SelectContent>
            {sortOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />Clear Filters
        </Button>
      )}
    </div>
  );
}

// ─── Main Coins Page ─────────────────────────────────────────────────────────
const Coins = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [denomination, setDenomination] = useState(
    searchParams.get('denomination') || searchParams.get('coinType') || 'all'
  );
  const [material, setMaterial] = useState('all');
  const [rarityRange, setRarityRange] = useState([1, 5]);
  const [sortBy, setSortBy] = useState('views');

  // Debounced search — API fires 500ms after typing stops, input stays responsive
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await coinService.getCoins({
          search: debouncedSearch || undefined,
          CoinType: denomination !== 'all' ? denomination as any : undefined,
          material: material !== 'all' ? material as any : undefined,
          minRarity: rarityRange[0],
          maxRarity: rarityRange[1],
          sortBy: sortBy as 'views' | 'newest' | 'rarity' | 'year',
        });
        setCoins(response.data || []);
      } catch {
        setError('Failed to load coins. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [debouncedSearch, denomination, material, rarityRange, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setDenomination('all');
    setMaterial('all');
    setRarityRange([1, 5]);
    setSortBy('views');
    setSearchParams({});
  };

  const hasActiveFilters = !!(search || denomination !== 'all' || material !== 'all' ||
    rarityRange[0] !== 1 || rarityRange[1] !== 5 || sortBy !== 'views');

  const filterProps: FilterPanelProps = {
    search, onSearchChange: setSearch,
    denomination, onDenominationChange: setDenomination,
    material, onMaterialChange: setMaterial,
    rarityRange, onRarityChange: setRarityRange,
    sortBy, onSortByChange: setSortBy,
    hasActiveFilters, onClearFilters: clearFilters,
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 pt-28">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Coin Catalog</h1>
          <p className="text-muted-foreground mt-2">Explore our curated collection of historical Indian coins</p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold mb-4">Filters</h2>
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter toggle */}
            <div className="lg:hidden mb-4 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search coins..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={() => setIsMobileFilterOpen(true)}>
                <SlidersHorizontal className="w-4 h-4 mr-2" />Filters
              </Button>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {isMobileFilterOpen && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileFilterOpen(false)} />
                  <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border z-50 p-6 overflow-y-auto lg:hidden">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold">Filters</h2>
                      <Button variant="ghost" size="icon" onClick={() => setIsMobileFilterOpen(false)}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <FilterPanel {...filterProps} />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Results */}
            {loading ? (
              <CoinGridSkeleton />
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">Reset Filters</Button>
              </div>
            ) : coins.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No coins found</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    <X className="w-4 h-4 mr-2" />Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {coins.length} coin{coins.length !== 1 ? 's' : ''} found
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {coins.map((coin, i) => <CoinCard key={coin._id} coin={coin} index={i} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Coins;
