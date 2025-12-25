import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useOrder } from '@/context/OrderContext';
import { OrderStatus } from '@/types';
import AdminStats from '@/components/admin/AdminStats';
import TopProductsChart from '@/components/admin/TopProductsChart';
import DeliveryZonesChart from '@/components/admin/DeliveryZonesChart';
import SalesChart from '@/components/admin/SalesChart';
import PopularTimesChart from '@/components/admin/PopularTimesChart';
import OrdersTable from '@/components/admin/OrdersTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Package, BarChart3 } from 'lucide-react';

const Admin: React.FC = () => {
  const { orders, updateOrderStatus } = useOrder();

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola pesanan dan lihat laporan penjualan
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-card shadow-soft">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Pesanan</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Laporan</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <AdminStats orders={orders} />

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart orders={orders} />
              <TopProductsChart orders={orders} />
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="font-display text-lg font-semibold mb-4">Pesanan Terbaru</h2>
              <OrdersTable 
                orders={orders.slice(0, 5)} 
                onStatusUpdate={handleStatusUpdate}
              />
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTable 
              orders={orders} 
              onStatusUpdate={handleStatusUpdate}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {/* Stats */}
            <AdminStats orders={orders} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart orders={orders} />
              <TopProductsChart orders={orders} />
              <DeliveryZonesChart orders={orders} />
              <PopularTimesChart orders={orders} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
