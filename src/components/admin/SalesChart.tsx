import React, { useState } from 'react';
import { Order } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SalesChartProps {
  orders: Order[];
}

type TimeRange = '7days' | '30days' | 'all';

const SalesChart: React.FC<SalesChartProps> = ({ orders }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');

  const getFilteredOrders = () => {
    const now = new Date();
    const filtered = orders.filter(o => o.status !== 'cancelled');
    
    if (timeRange === '7days') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return filtered.filter(o => new Date(o.createdAt) >= weekAgo);
    } else if (timeRange === '30days') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return filtered.filter(o => new Date(o.createdAt) >= monthAgo);
    }
    return filtered;
  };

  const generateData = () => {
    const filteredOrders = getFilteredOrders();
    const dailySales: Record<string, { date: string; orders: number; revenue: number }> = {};
    
    // Generate date range
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 30;
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      dailySales[dateStr] = { date: displayDate, orders: 0, revenue: 0 };
    }

    // Count orders per day
    filteredOrders.forEach(order => {
      const dateStr = order.createdAt.split('T')[0];
      if (dailySales[dateStr]) {
        dailySales[dateStr].orders += 1;
        dailySales[dateStr].revenue += order.total;
      }
    });

    return Object.values(dailySales);
  };

  const data = generateData();
  const hasData = data.some(d => d.orders > 0);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Grafik Penjualan</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7days')}
          >
            7 Hari
          </Button>
          <Button
            variant={timeRange === '30days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30days')}
          >
            30 Hari
          </Button>
        </div>
      </div>
      
      {!hasData ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Belum ada data penjualan untuk periode ini
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                }}
                formatter={(value: number, name: string) => [
                  name === 'orders' ? `${value} pesanan` : `Rp ${value.toLocaleString('id-ID')}`,
                  name === 'orders' ? 'Pesanan' : 'Pendapatan'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="hsl(var(--primary))" 
                fill="url(#colorRevenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default SalesChart;
