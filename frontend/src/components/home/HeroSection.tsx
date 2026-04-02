import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const floatingCoins = [
  { size: 'w-20 h-20', pos: 'top-[15%] left-[8%]', delay: 0, color: 'from-amber-500/30 to-yellow-600/20' },
  { size: 'w-14 h-14', pos: 'top-[25%] right-[12%]', delay: 0.5, color: 'from-primary/30 to-amber-500/20' },
  { size: 'w-10 h-10', pos: 'bottom-[30%] left-[15%]', delay: 1, color: 'from-copper/30 to-amber-700/20' },
  { size: 'w-16 h-16', pos: 'bottom-[20%] right-[8%]', delay: 0.8, color: 'from-yellow-500/30 to-primary/20' },
  { size: 'w-8 h-8', pos: 'top-[45%] left-[5%]', delay: 1.2, color: 'from-amber-400/40 to-yellow-500/20' },
];

const stats = [
  { label: 'Rare Coins', value: '500+' },
  { label: 'Historical Eras', value: '4' },
  { label: 'Articles', value: '50+' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Multi-layer background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />

      {/* Ambient glows */}
      <motion.div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/8 blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

      {/* Floating coin decorations */}
      {floatingCoins.map((coin, i) => (
        <motion.div key={i}
          className={`absolute ${coin.pos} ${coin.size} rounded-full bg-gradient-to-br ${coin.color} border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-lg`}
          animate={{ y: [0, -18, 0], rotate: [0, i % 2 === 0 ? 12 : -12, 0] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: coin.delay }}>
          <div className="w-1/2 h-1/2 rounded-full border border-white/20" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="tracking-wide uppercase text-xs">India's Numismatic Heritage</span>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
            <span className="text-foreground">Discover </span>
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-amber-500 to-primary bg-clip-text text-transparent bg-[length:200%] animate-[shimmer_3s_linear_infinite]">
                Rare Coins
              </span>
              <motion.span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.6 }} />
            </span>
            <br className="hidden sm:block" />
            <span className="text-foreground/80"> from Ancient India</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Explore a curated collection of historical Indian coins spanning ancient empires, 
            medieval dynasties, and modern republic — each piece a portal to the past.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" asChild className="group rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
              <Link to="/coins" className="flex items-center gap-2">
                Explore Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="rounded-full px-8 border-border/60 hover:border-primary/40 hover:bg-primary/5 backdrop-blur-sm">
              <Link to="/articles">Read Articles</Link>
            </Button>
          </motion.div>

          {/* Stats bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 pt-8 border-t border-border/30">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} className="text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.1 }}>
                <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
            <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <div className="flex items-center gap-1 justify-center">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-primary text-primary" />)}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wide">Trusted Platform</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
