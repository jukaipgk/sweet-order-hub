import React from 'react';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';
import OrderTimeline from './OrderTimeline';
import { MapPin, Calendar, Clock, User, Phone, FileText, CreditCard, Truck } from 'lucide-react';

interface OrderDetailsCardProps {
  order: Order;
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Nomor Pesanan</p>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {order.orderNumber}
            </h2>
          </div>
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              ORDER_STATUS_COLORS[order.status]
            }`}
          >
            {ORDER_STATUS_LABELS[order.status]}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-card rounded-2xl p-6 shadow-soft space-y-4">
        <h3 className="font-display text-lg font-semibold">Informasi Pengiriman</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Nama</p>
              <p className="font-medium">{order.customer.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">WhatsApp</p>
              <p className="font-medium">{order.customer.whatsapp}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 md:col-span-2">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Alamat</p>
              <p className="font-medium">{order.customer.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Tanggal Pengiriman</p>
              <p className="font-medium">{formatDate(order.customer.deliveryDate)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Jam Pengiriman</p>
              <p className="font-medium">{order.customer.deliveryTime}</p>
            </div>
          </div>
          {order.customer.notes && (
            <div className="flex items-start gap-3 md:col-span-2">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Catatan</p>
                <p className="font-medium">{order.customer.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card rounded-2xl p-6 shadow-soft space-y-4">
        <h3 className="font-display text-lg font-semibold">Pesanan</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground">{item.product.name}</h4>
                <div className="text-sm text-muted-foreground space-y-0.5">
                  {item.selectedVariations.map((v) => (
                    <p key={v.variationId}>
                      {v.variationName}: {v.optionName}
                    </p>
                  ))}
                  {item.customizations.map((c) => (
                    <p key={c.optionId}>
                      {c.optionName}: {c.value.startsWith('data:') ? 'Foto' : c.value}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-card rounded-2xl p-6 shadow-soft space-y-4">
        <h3 className="font-display text-lg font-semibold">Ringkasan Pembayaran</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Ongkir ({order.deliveryZone?.name || 'Pickup'})
            </span>
            <span className="font-medium">{formatCurrency(order.deliveryFee)}</span>
          </div>
          <div className="border-t border-border pt-2 flex items-center justify-between">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl text-primary">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CreditCard className="w-4 h-4" />
          <span>
            {order.paymentMethod === 'transfer' ? 'Transfer Bank' : 'Midtrans'}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-2xl p-6 shadow-soft">
        <h3 className="font-display text-lg font-semibold mb-4">Timeline Pesanan</h3>
        <OrderTimeline order={order} />
      </div>
    </div>
  );
};

export default OrderDetailsCard;
