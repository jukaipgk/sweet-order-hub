import React from 'react';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Package, TrendingUp, MapPin, Clock } from 'lucide-react';

interface AdminStatsProps {
  orders: Order[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ orders }) => {
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const pendingOrders = orders.filter(o => 
    ['pending_payment', 'pending_confirmation', 'paid', 'processing'].includes(o.status)
  ).length;

  const stats = [
    {
      label: 'Total Pesanan',
      value: totalOrders.toString(),
      icon: Package,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Pendapatan',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'bg-green-100 text-green-700',
    },
    {
      label: 'Selesai',
      value: completedOrders.toString(),
      icon: MapPin,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Dalam Proses',
      value: pendingOrders.toString(),
      icon: Clock,
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-2xl p-4 md:p-6 shadow-soft"
        >
          <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon className="w-5 h-5" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
