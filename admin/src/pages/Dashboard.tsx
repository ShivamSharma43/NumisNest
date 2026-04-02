import { motion } from 'framer-motion';
import { Coins, Users, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { MostViewedCoinsChart } from '@/components/charts/MostViewedCoinsChart';
import { EraPopularityChart } from '@/components/charts/EraPopularityChart';
import { InquiryTrendsChart } from '@/components/charts/InquiryTrendsChart';
import { useDashboardStats } from '@/hooks/useDashboard';

export default function Dashboard() {
  const { data: statsResponse, isLoading, error } = useDashboardStats();
  
  const stats = statsResponse?.data || {
    totalCoins: 0,
    totalUsers: 0,
    totalInquiries: 0,
    newInquiriesToday: 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Failed to load dashboard. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your numismatic collection and user engagement
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          title="Total Coins"
          value={stats.totalCoins}
          icon={Coins}
          variant="gold"
          delay={0}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          variant="bronze"
          delay={0.1}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Inquiries"
          value={stats.totalInquiries}
          icon={MessageSquare}
          variant="copper"
          delay={0.2}
        />
        <StatCard
          title="New Today"
          value={stats.newInquiriesToday}
          icon={Sparkles}
          variant="default"
          delay={0.3}
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MostViewedCoinsChart />
        <EraPopularityChart />
      </div>

      {/* Full Width Chart */}
      <div className="grid grid-cols-1">
        <InquiryTrendsChart />
      </div>
    </div>
  );
}
