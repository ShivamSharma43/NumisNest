import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Eye, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';
import { wishlistService } from '@/services/wishlistService';
import { useToast } from '@/hooks/use-toast';
import type { Coin } from '@/types';
import { mockCoins, coinTypeLabels } from '@/data/mockData';

const WishlistTab = () => {
  const { wishlistIds, toggleWishlist, isLoading: contextLoading } = useWishlist();
  const { toast } = useToast();
  const [wishlistCoins, setWishlistCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadWishlist();
  }, [wishlistIds]);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API, fallback to mock data
      try {
        const coins = await wishlistService.getWishlist();
        setWishlistCoins(coins);
      } catch {
        // Fallback to mock data filtering by wishlist IDs
        const filteredCoins = mockCoins.filter(coin => wishlistIds.includes(coin._id));
        setWishlistCoins(filteredCoins);
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (coin: Coin) => {
    await toggleWishlist(coin._id, coin.name);
  };

  const filteredCoins = wishlistCoins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.CoinType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRarityStars = (rarity: number) => {
    return '★'.repeat(rarity) + '☆'.repeat(5 - rarity);
  };

  if (isLoading || contextLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-heading flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive" />
                My Wishlist
              </CardTitle>
              <CardDescription>
                {wishlistCoins.length} coin{wishlistCoins.length !== 1 ? 's' : ''} saved
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCoins.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? 'No coins found' : 'Your wishlist is empty'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Try a different search term' 
                  : 'Browse our collection and add coins you love!'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link to="/coins">Explore Coins</Link>
                </Button>
              )}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {filteredCoins.map((coin, index) => (
                  <motion.div
                    key={coin._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    {/* Coin Image */}
                    <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img 
                        src={coin.images?.[0] || coin.imageUrl || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80'} 
                        alt={coin.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Coin Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground truncate">
                            {coin.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {coin.year} • {coinTypeLabels[coin.CoinType]}
                          </p>
                        </div>
                        <Badge variant="outline" className="hidden sm:inline-flex">
                          {coin.material}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-primary font-medium">
                          {getRarityStars(coin.rarity)}
                        </span>
                        {coin.ruler && (
                          <span className="text-muted-foreground">
                            {coin.ruler}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="flex items-center gap-2"
                      >
                        <Link to={`/coins/${coin._id}`}>
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemove(coin)}
                        className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Remove</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WishlistTab;