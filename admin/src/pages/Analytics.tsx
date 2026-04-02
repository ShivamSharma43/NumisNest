import { TrendingUp, Star, Coins, FileText, MessageSquare, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useDashboard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['hsl(43,74%,49%)', 'hsl(28,70%,50%)', 'hsl(160,60%,45%)', 'hsl(210,70%,55%)', 'hsl(280,60%,55%)'];
const tooltipStyle = { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' };

const EMPTY = {
  totalCoinViews: 0, totalArticleViews: 0, avgRarity: 0, totalInquiries: 0,
  materialDistribution: [], rarityBreakdown: [], topViewedCoins: [], inquiryByStatus: [],
};

export default function Analytics() {
  const { data: analyticsResponse, isLoading, error } = useAnalytics();
  const analytics = analyticsResponse?.data ?? EMPTY;
  const isEmpty = analytics.totalCoinViews === 0 && analytics.totalArticleViews === 0 && analytics.totalInquiries === 0;

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (error) return <div className="flex items-center justify-center h-64"><p className="text-destructive">Failed to load analytics. Please try again.</p></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights and engagement metrics</p>
      </div>

      {isEmpty && (
        <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center text-muted-foreground">
          No data yet — add some coins, articles and inquiries to see analytics here.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Coins,         label: 'Coin Views',      value: analytics.totalCoinViews.toLocaleString(),    color: 'text-amber-400' },
          { icon: FileText,      label: 'Article Views',   value: analytics.totalArticleViews.toLocaleString(), color: 'text-emerald-400' },
          { icon: Star,          label: 'Avg Rarity',      value: `${analytics.avgRarity.toFixed(1)} ★`,        color: 'text-yellow-400' },
          { icon: MessageSquare, label: 'Total Inquiries', value: analytics.totalInquiries.toLocaleString(),    color: 'text-blue-400' },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted"><s.icon className={`h-5 w-5 ${s.color}`} /></div>
                <div><p className="text-2xl font-bold">{s.value}</p><p className="text-xs text-muted-foreground">{s.label}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analytics.topViewedCoins.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Top Viewed Coins</CardTitle></CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.topViewedCoins} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }} angle={-35} textAnchor="end" interval={0} />
                      <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="views" fill="hsl(43,74%,49%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {analytics.materialDistribution.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Material Distribution</CardTitle></CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analytics.materialDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {analytics.materialDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {analytics.rarityBreakdown.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Rarity Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.rarityBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))' }} />
                      <YAxis tick={{ fill: 'hsl(var(--foreground))' }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="value" fill="hsl(28,70%,50%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {analytics.inquiryByStatus.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Inquiry Status</CardTitle></CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={analytics.inquiryByStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}>
                        {analytics.inquiryByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
