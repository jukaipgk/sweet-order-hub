import React, { useState } from 'react';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';
import { formatCurrency, formatDateTime, generateWhatsAppLink } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Package, MessageCircle, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

const statusOrder: OrderStatus[] = [
  'pending_payment', 'pending_confirmation', 'paid', 'processing', 'shipping', 'ready_pickup', 'completed', 'cancelled'
];

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onStatusUpdate }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getWhatsAppLink = (order: Order, message: string) => {
    return generateWhatsAppLink(order.customer.whatsapp, message);
  };

  return (
    <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <h3 className="font-display text-lg font-semibold">Daftar Pesanan</h3>
            <span className="text-sm text-muted-foreground">({filteredOrders.length})</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
            >
              Semua
            </Button>
            <Button
              variant={filterStatus === 'pending_confirmation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('pending_confirmation')}
            >
              Perlu Konfirmasi
            </Button>
            <Button
              variant={filterStatus === 'processing' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('processing')}
            >
              Diproses
            </Button>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {filteredOrders.map((order) => (
            <div key={order.id} className="hover:bg-muted/30 transition-colors">
              <div
                className="p-4 md:p-6 cursor-pointer"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-semibold text-foreground">{order.orderNumber}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customer.name} • {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary whitespace-nowrap">
                      {formatCurrency(order.total)}
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="border-t border-border p-4 md:p-6 bg-muted/20 space-y-4">
                  {/* Customer Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">WhatsApp</span>
                      <span className="font-medium">{order.customer.whatsapp}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Alamat</span>
                      <span className="font-medium">{order.customer.address}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Tanggal Kirim</span>
                      <span className="font-medium">{order.customer.deliveryDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Jam Kirim</span>
                      <span className="font-medium">{order.customer.deliveryTime}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-background rounded-xl p-4">
                    <p className="text-sm font-medium mb-2">Item Pesanan:</p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.product.name} x{item.quantity}
                            {item.selectedVariations.length > 0 && (
                              <span className="text-muted-foreground ml-1">
                                ({item.selectedVariations.map(v => v.optionName).join(', ')})
                              </span>
                            )}
                          </span>
                          <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-2 flex justify-between text-sm">
                        <span>Ongkir ({order.deliveryZone?.name || 'Pickup'})</span>
                        <span>{formatCurrency(order.deliveryFee)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  {order.paymentProof && (
                    <div>
                      <p className="text-sm font-medium mb-2">Bukti Pembayaran:</p>
                      <a 
                        href={order.paymentProof} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Eye className="w-4 h-4" />
                        Lihat Bukti
                      </a>
                    </div>
                  )}

                  {/* Status Buttons */}
                  <div>
                    <p className="text-sm font-medium mb-2">Update Status:</p>
                    <div className="flex flex-wrap gap-2">
                      {statusOrder.map((status) => (
                        <Button
                          key={status}
                          variant={order.status === status ? 'default' : 'outline'}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusUpdate(order.id, status);
                          }}
                        >
                          {ORDER_STATUS_LABELS[status]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Button */}
                  <div className="flex gap-2">
                    <a
                      href={getWhatsAppLink(
                        order,
                        `Halo ${order.customer.name}! 👋\n\nUpdate pesanan ${order.orderNumber}:\nStatus: ${ORDER_STATUS_LABELS[order.status]}\n\nTerima kasih sudah memesan di JUKAI! 🍰`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button variant="default" className="bg-green-600 hover:bg-green-700">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Kirim WA Update
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTable;
