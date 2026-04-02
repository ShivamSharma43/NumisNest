import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Mail, 
  ChevronLeft, 
  Star, 
  Eye, 
  MapPin, 
  Scale, 
  Ruler, 
  Calendar,
  Crown,
  Coins as CoinsIcon,
  X,
  Loader2
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CoinCard } from '@/components/coins/CoinCard';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { coinTypeLabels } from '@/data/mockData';
import { coinService } from '@/services/coinService';
import { inquiryService } from '@/services/inquiryService';
import type { Coin } from '@/types';

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coin, setCoin] = useState<Coin | null>(null);
  const [relatedCoins, setRelatedCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Fetch coin data
  useEffect(() => {
    const fetchCoin = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const [coinData, related] = await Promise.all([
          coinService.getCoin(id),
          coinService.getRelatedCoins(id),
        ]);
        setCoin(coinData);
        setRelatedCoins(related);
        
        // Increment views
        coinService.incrementViews(id);
      } catch (err) {
        setError('Failed to load coin details.');
        console.error('Error fetching coin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !coin) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
              Coin Not Found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The coin you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link to="/coins">Back to Catalog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const inWishlist = isInWishlist(coin._id);

  const handleInquirySubmit = async () => {
    if (!inquiryMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message for your inquiry.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await inquiryService.createInquiry({
        coinId: coin._id,
        coinName: coin.name,
        message: inquiryMessage,
      });
      
      toast({
        title: "Inquiry Sent!",
        description: "We'll get back to you within 24-48 hours.",
      });
      
      setIsInquiryOpen(false);
      setInquiryMessage('');
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to send inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInquiryClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to send an inquiry.",
        variant: "destructive",
      });
      return;
    }
    setIsInquiryOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-parchment-dark py-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/coins"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Catalog
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <motion.div 
                className="relative aspect-square bg-parchment-dark rounded-lg overflow-hidden shadow-elevated"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src={coin.images?.[selectedImage] || coin.imageUrl || 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80'}
                  alt={coin.name}
                  className="w-full h-full object-contain p-4"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&q=80'; }}
                />
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground border-0">
                  {coin.CoinType ? coinTypeLabels[coin.CoinType] : (coin.denomination || "Coin").replace("_"," ")}
                </Badge>
                
                {/* Image count indicator */}
                {(coin.images?.length || 0) > 1 && (
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-foreground">
                    {selectedImage + 1} / {coin.images?.length || 1}
                  </div>
                )}
              </motion.div>

              {/* Thumbnails - Only show if more than 1 image */}
              {(coin.images?.length || 0) > 1 && (
                <div className="flex gap-3 flex-wrap">
                  {(coin.images?.length ? coin.images : coin.imageUrl ? [coin.imageUrl] : []).map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index
                          ? 'border-primary shadow-glow'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${coin.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Title & Year */}
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                {coin.name}
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {coin.year < 0 ? `${Math.abs(coin.year)} BCE` : `${coin.year} CE`}
                {coin.ruler && ` • ${coin.ruler}`}
              </p>

              {/* Rarity & Views */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < coin.rarity
                          ? 'text-primary fill-primary'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-muted-foreground">Rarity</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="w-5 h-5" />
                  {coin.views.toLocaleString()} views
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  variant={inWishlist ? 'default' : 'outline'}
                  onClick={() => toggleWishlist(coin._id, coin.name)}
                  className="flex-1"
                >
                  <Heart className={`w-4 h-4 mr-2 ${inWishlist ? 'fill-current' : ''}`} />
                  {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button onClick={handleInquiryClick} className="flex-1">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Inquiry
                </Button>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 mt-8 p-6 bg-parchment-dark rounded-lg">
                {coin.dynasty && (
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Dynasty</p>
                      <p className="font-medium">{coin.dynasty}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <CoinsIcon className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Material</p>
                    <p className="font-medium capitalize">{coin.material}</p>
                  </div>
                </div>
                {coin.weight && (
                  <div className="flex items-start gap-3">
                    <Scale className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Weight</p>
                      <p className="font-medium">{coin.weight}g</p>
                    </div>
                  </div>
                )}
                {coin.diameter && (
                  <div className="flex items-start gap-3">
                    <Ruler className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Diameter</p>
                      <p className="font-medium">{coin.diameter}mm</p>
                    </div>
                  </div>
                )}
                {coin.mintLocation && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mint Location</p>
                      <p className="font-medium">{coin.mintLocation}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Year</p>
                    <p className="font-medium">
                      {coin.year < 0 ? `${Math.abs(coin.year)} BCE` : `${coin.year} CE`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h3 className="font-serif text-xl font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{coin.description}</p>
              </div>

              {/* Historical Context */}
              {coin.historicalContext && (
                <div className="mt-8">
                  <h3 className="font-serif text-xl font-semibold mb-3">Historical Context</h3>
                  <p className="text-muted-foreground leading-relaxed">{coin.historicalContext}</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Related Coins */}
          {relatedCoins.length > 0 && (
            <section className="mt-16 lg:mt-24">
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-8">
                Related Coins
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedCoins.map((relatedCoin, index) => (
                  <CoinCard key={relatedCoin._id} coin={relatedCoin} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Inquiry Dialog — using shadcn Dialog for guaranteed centering on all screens */}
        <Dialog open={isInquiryOpen} onOpenChange={(open) => { if (!open) { setIsInquiryOpen(false); setInquiryMessage(''); } }}>
          <DialogContent className="w-full max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">Send Inquiry</DialogTitle>
            <DialogDescription>Send a message about {coin?.name} and we'll get back to you via email.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground">Coin</p>
                  <p className="font-medium text-sm">{coin.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Your Email</p>
                  <p className="font-medium text-sm truncate">{user?.email}</p>
                </div>
              </div>
              <div>
                <Label htmlFor="inquiry-message">Message</Label>
                <Textarea
                  id="inquiry-message"
                  placeholder="I'm interested in this coin and would like to know more about..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="mt-2 min-h-[120px] resize-none"
                />
              </div>
              <Button onClick={handleInquirySubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Inquiry'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default CoinDetails;