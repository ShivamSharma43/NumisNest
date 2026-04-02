import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useMostViewedCoins } from '@/hooks/useDashboard';

const COLORS = ['hsl(43,74%,49%)', 'hsl(28,70%,50%)', 'hsl(20,60%,45%)', 'hsl(35,80%,55%)', 'hsl(15,50%,45%)'];

export function MostViewedCoinsChart() {
  const { data: response } = useMostViewedCoins(5);
  const data = response?.data ?? [
    { name: 'No data yet', views: 0 },
  ];

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">Most Viewed Coins</h3>
      {/* FIX: explicit pixel height on container prevents Recharts 0-dimension warning */}
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              dataKey="name"
              type="category"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={75}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Bar dataKey="views" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
