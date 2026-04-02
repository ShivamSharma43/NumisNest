import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye, Star } from 'lucide-react';
import type { Coin } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600&q=80';

// Map all possible denomination/CoinType values to display labels
const denominationLabel = (coin: Coin): string => {
  const raw = coin.denomination || coin.CoinType || '';
  const map: Record<string, string> = {
    'old_coin': 'Old Coin', 'old': 'Old Coin',
    '1_rupee': '₹1', '1-rupee': '₹1',
    '2_rupees': '₹2', '2-rupees': '₹2',
    '5_rupees': '₹5', '5-rupees': '₹5',
    '10_rupees': '₹10', '10-rupees': '₹10',
    '20_rupees': '₹20', '20-rupees': '₹20',
  };
  return map[raw] || raw || 'Coin';
};

const coinImage = (coin: Coin): string => {
  if (coin.images && coin.images.length > 0 && coin.images[0]) return coin.images[0];
  if (coin.imageUrl) return coin.imageUrl;
  return PLACEHOLDER;
};

interface CoinCardProps { coin: Coin; index?: number; }

export function CoinCard({ coin, index = 0 }: CoinCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(coin._id);
  const imgSrc = coinImage(coin);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/coins/${coin._id}`} className="block group">
        <div className="bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-glow border border-border transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={imgSrc}
              alt={coin.name}
              className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-secondary-foreground font-medium bg-primary/90 px-4 py-2 rounded-full text-sm">
                View Details
              </span>
            </div>
            <motion.button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(coin._id, coin.name); }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                inWishlist ? 'bg-red-500 text-white' : 'bg-background/80 backdrop-blur-sm text-foreground hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
            </motion.button>
            <Badge className="absolute bottom-3 left-3 bg-secondary/90 text-secondary-foreground border-0 text-xs">
              {denominationLabel(coin)}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {coin.name}
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              {coin.year < 0 ? `${Math.abs(coin.year)} BCE` : `${coin.year} CE`}
              {(coin.ruler || coin.leader) && ` • ${coin.ruler || coin.leader}`}
            </p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < coin.rarity ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                ))}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <Eye className="w-4 h-4" />
                <span>{(coin.views || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
