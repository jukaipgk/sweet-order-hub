import React from 'react';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import { formatCurrency, formatDate, formatDateTime } from '@/utils/format';
import { Check, Clock, Package, Truck, Home, XCircle } from 'lucide-react';

interface OrderTimelineProps {
  order: Order;
}

const statusIcons = {
  pending_payment: Clock,
  pending_confirmation: Clock,
  paid: Check,
  processing: Package,
  shipping: Truck,
  ready_pickup: Home,
  completed: Check,
  cancelled: XCircle,
};

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  return (
    <div className="space-y-4">
      {order.statusHistory.map((history, index) => {
        const Icon = statusIcons[history.status];
        const isLatest = index === order.statusHistory.length - 1;

        return (
          <div key={index} className="flex gap-4">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isLatest
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {index < order.statusHistory.length - 1 && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-8 bg-border" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    ORDER_STATUS_COLORS[history.status]
                  }`}
                >
                  {ORDER_STATUS_LABELS[history.status]}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDateTime(history.timestamp)}
              </p>
              {history.note && (
                <p className="text-sm text-foreground mt-1">{history.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
