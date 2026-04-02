import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { wishlistService } from '@/services/wishlistService';
import { useToast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (coinId: string) => boolean;
  toggleWishlist: (coinId: string, coinName: string) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlistIds([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const coins = await wishlistService.getWishlist();
      setWishlistIds(coins.map(coin => coin._id));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (coinId: string) => wishlistIds.includes(coinId);

  const toggleWishlist = async (coinId: string, coinName: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to add coins to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInWishlist(coinId)) {
        await wishlistService.removeFromWishlist(coinId);
        setWishlistIds(prev => prev.filter(id => id !== coinId));
        toast({
          title: "Removed from Wishlist",
          description: `${coinName} has been removed from your wishlist.`,
        });
      } else {
        await wishlistService.addToWishlist(coinId);
        setWishlistIds(prev => [...prev, coinId]);
        toast({
          title: "Added to Wishlist",
          description: `${coinName} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <WishlistContext.Provider 
      value={{ wishlistIds, isInWishlist, toggleWishlist, isLoading }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
