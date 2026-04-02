import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import type { CoinType } from '@/types';
import { coinTypeLabels, coinTypeDescriptions } from '@/data/mockData';
import oldCoin from "@/assets/old_coin.png"
import oneRupee from "@/assets/1_rupee.png";
import twoRupees from "@/assets/2_rupee.png";
import fiveRupees from "@/assets/5_rupee.png";
import tenRupees from "@/assets/10_rupee.png";
import twentyRupees from "@/assets/20_rupee.png";

const coinTypeImages: Record<CoinType, string> = {
  'old': oldCoin,
  '1-rupee': oneRupee,
  '2-rupees': twoRupees,
  '5-rupees': fiveRupees,
  '10-rupees': tenRupees,
  '20-rupees': twentyRupees,
};

const coinTypeColors: Record<CoinType, string> = {
  'old': 'from-amber/80 to-copper/80',
  '1-rupee': 'from-emerald/80 to-sage/80',
  '2-rupees': 'from-sapphire/80 to-royal-purple/80',
  '5-rupees': 'from-primary/80 to-amber/80',
  '10-rupees': 'from-ruby/80 to-copper/80',
  '20-rupees': 'from-gold/80 to-amber/80',
};

const coinTypeBorderColors: Record<CoinType, string> = {
  'old': 'border-amber',
  '1-rupee': 'border-emerald',
  '2-rupees': 'border-sapphire',
  '5-rupees': 'border-primary',
  '10-rupees': 'border-ruby',
  '20-rupees': 'border-gold',
};


const denominationMap: Record<CoinType, string> = {
  'old': 'old_coin',
  '1-rupee': '1_rupee',
  '2-rupees': '2_rupees',
  '5-rupees': '5_rupees',
  '10-rupees': '10_rupees',
  '20-rupees': '20_rupees',
};

const coinTypes: CoinType[] = ['old', '1-rupee', '2-rupees', '5-rupees', '10-rupees', '20-rupees'];

export function CoinTypeHighlights() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Aesthetic gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted/50" />
      
      {/* Animated decorative elements */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-copper/10 blur-2xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Browse by Denomination
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Explore by <span className="text-gold-gradient">Coin Type</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our collection organized by denomination, from historic old coins to modern rupee series.
          </p>
        </motion.div>

        {/* Coin Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coinTypes.map((coinType, index) => (
            <motion.div
              key={coinType}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Link
                to={`/coins?denomination=${denominationMap[coinType]}`}
                className={`block group relative overflow-hidden rounded-xl aspect-[4/3] bg-card shadow-medium hover:shadow-glow transition-all duration-300 border-2 border-transparent hover:${coinTypeBorderColors[coinType]}`}
              >
                {/* Background Image */}
                <img
                  src={coinTypeImages[coinType]}
                  alt={coinTypeLabels[coinType]}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Colorful Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${coinTypeColors[coinType]} opacity-60 group-hover:opacity-70 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <motion.h3 
                    className="font-serif text-xl sm:text-2xl font-bold text-card-foreground group-hover:text-primary transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    {coinTypeLabels[coinType]}
                  </motion.h3>
                  <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                    {coinTypeDescriptions[coinType]}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Explore Collection</span>
                    <motion.span
                      className="inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>

                {/* Heritage corner decoration */}
                <motion.div 
                  className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
                <motion.div 
                  className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}