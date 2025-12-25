import React from 'react';
import { Order } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { MapPin } from 'lucide-react';

interface DeliveryZonesChartProps {
  orders: Order[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const DeliveryZonesChart: React.FC<DeliveryZonesChartProps> = ({ orders }) => {
  // Count orders by zone
  const zoneCounts: Record<string, number> = {};
  
  orders
    .filter(o => o.status !== 'cancelled')
    .forEach(order => {
      const zoneName = order.deliveryZone?.name || 'Pickup';
      zoneCounts[zoneName] = (zoneCounts[zoneName] || 0) + 1;
    });

  const data = Object.entries(zoneCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">Zona Pengiriman</h3>
        </div>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          Belum ada data pengiriman
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-display text-lg font-semibold">Zona Pengiriman Teramai</h3>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
              }}
              formatter={(value: number) => [`${value} pesanan`, 'Jumlah']}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DeliveryZonesChart;
