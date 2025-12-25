import React from 'react';
import { Order } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface TopProductsChartProps {
  orders: Order[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#f59e0b', '#10b981', '#6366f1'];

const TopProductsChart: React.FC<TopProductsChartProps> = ({ orders }) => {
  // Count product sales
  const productCounts: Record<string, { name: string; count: number; revenue: number }> = {};
  
  orders
    .filter(o => o.status !== 'cancelled')
    .forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id;
        if (!productCounts[productId]) {
          productCounts[productId] = {
            name: item.product.name,
            count: 0,
            revenue: 0,
          };
        }
        productCounts[productId].count += item.quantity;
        productCounts[productId].revenue += item.subtotal;
      });
    });

  const data = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      fullName: item.name,
      terjual: item.count,
      pendapatan: item.revenue,
    }));

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Produk Terlaris</h3>
        </div>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Belum ada data penjualan
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold">Produk Terlaris</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis 
              type="category" 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              width={100}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(value: number, name: string) => [
                name === 'terjual' ? `${value} item` : `Rp ${value.toLocaleString('id-ID')}`,
                name === 'terjual' ? 'Terjual' : 'Pendapatan'
              ]}
              labelFormatter={(label) => data.find(d => d.name === label)?.fullName || label}
            />
            <Bar dataKey="terjual" radius={[0, 8, 8, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;
