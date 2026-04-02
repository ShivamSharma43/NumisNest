import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
  variant?: 'default' | 'gold' | 'bronze' | 'copper';
}

export function StatCard({ title, value, icon: Icon, trend, delay = 0, variant = 'default' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Count-up animation
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const variantStyles = {
    default: 'bg-card',
    gold: 'bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20',
    bronze: 'bg-gradient-to-br from-bronze/10 to-bronze/5 border-bronze/20',
    copper: 'bg-gradient-to-br from-copper/10 to-copper/5 border-copper/20',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    gold: 'bg-gold/20 text-gold',
    bronze: 'bg-bronze/20 text-bronze',
    copper: 'bg-copper/20 text-copper',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            className="text-3xl font-bold tracking-tight"
            key={displayValue}
          >
            {displayValue.toLocaleString()}
          </motion.p>
          {trend && (
            <p className={cn(
              "text-sm flex items-center gap-1",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{trend.value}% from last month</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
