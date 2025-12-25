import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useOrder } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';
import { formatCurrency, formatDateTime, generateWhatsAppLink } from '@/utils/format';
import { Package, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

const statusOrder: OrderStatus[] = [
  'pending_payment', 'pending_confirmation', 'paid', 'processing', 'shipping', 'ready_pickup', 'completed', 'cancelled'
];

const Admin: React.FC = () => {
  const { orders, updateOrderStatus } = useOrder();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const getWhatsAppLink = (order: typeof orders[0], message: string) => {
    return generateWhatsAppLink(order.customer.whatsapp, message);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
          Admin Dashboard
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Belum ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-card rounded-2xl shadow-soft overflow-hidden">
                <div
                  className="p-4 md:p-6 cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customer.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
                      {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="border-t border-border p-4 md:p-6 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div><span className="text-muted-foreground">WhatsApp:</span><br/>{order.customer.whatsapp}</div>
                      <div><span className="text-muted-foreground">Alamat:</span><br/>{order.customer.address}</div>
                      <div><span className="text-muted-foreground">Tanggal:</span><br/>{order.customer.deliveryDate}</div>
                      <div><span className="text-muted-foreground">Jam:</span><br/>{order.customer.deliveryTime}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {statusOrder.map((status) => (
                        <Button
                          key={status}
                          variant={order.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusUpdate(order.id, status)}
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </Button>
                      ))}
                    </div>

                    <a
                      href={getWhatsAppLink(order, `Update pesanan ${order.orderNumber}: Status sekarang ${ORDER_STATUS_LABELS[order.status]}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="default" className="bg-green-600 hover:bg-green-700">
                        <MessageCircle className="w-4 h-4" /> Kirim WA
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Admin;
