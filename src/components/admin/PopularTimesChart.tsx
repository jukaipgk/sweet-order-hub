import React from 'react';
import { Order } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock } from 'lucide-react';

interface PopularTimesChartProps {
  orders: Order[];
}

const PopularTimesChart: React.FC<PopularTimesChartProps> = ({ orders }) => {
  // Count orders by delivery time
  const timeCounts: Record<string, number> = {};
  
  orders
    .filter(o => o.status !== 'cancelled')
    .forEach(order => {
      const time = order.customer.deliveryTime;
      timeCounts[time] = (timeCounts[time] || 0) + 1;
    });

  const data = Object.entries(timeCounts)
    .map(([time, count]) => ({ time, pesanan: count }))
    .sort((a, b) => a.time.localeCompare(b.time));

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Jam Pemesanan Favorit</h3>
        </div>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Belum ada data jam pemesanan
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold">Jam Pengiriman Favorit</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(value: number) => [`${value} pesanan`, 'Jumlah']}
            />
            <Bar 
              dataKey="pesanan" 
              fill="hsl(var(--accent))" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PopularTimesChart;
