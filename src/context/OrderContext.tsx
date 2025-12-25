import React, { createContext, useContext, useState, useCallback } from 'react';
import { Order, OrderStatus, CartItem, CustomerInfo, DeliveryZone } from '@/types';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (
    items: CartItem[],
    customer: CustomerInfo,
    deliveryZone: DeliveryZone | null,
    deliveryFee: number,
    paymentMethod: 'transfer' | 'midtrans'
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  uploadPaymentProof: (orderId: string, proofUrl: string) => void;
  getOrderByTracking: (trackingId: string) => Order | undefined;
  getOrderByNumberAndWhatsApp: (orderNumber: string, whatsapp: string) => Order | undefined;
  setCurrentOrder: (order: Order | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const generateOrderNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${random}`;
};

const generateTrackingId = () => {
  return Math.random().toString(36).substring(2, 12).toUpperCase();
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = useCallback(
    (
      items: CartItem[],
      customer: CustomerInfo,
      deliveryZone: DeliveryZone | null,
      deliveryFee: number,
      paymentMethod: 'transfer' | 'midtrans'
    ): Order => {
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      const now = new Date().toISOString();

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        trackingId: generateTrackingId(),
        items,
        customer,
        deliveryZone,
        deliveryFee,
        subtotal,
        total: subtotal + deliveryFee,
        paymentMethod,
        status: 'pending_payment',
        createdAt: now,
        updatedAt: now,
        statusHistory: [
          {
            status: 'pending_payment',
            timestamp: now,
            note: 'Pesanan dibuat',
          },
        ],
      };

      setOrders((prev) => [...prev, newOrder]);
      setCurrentOrder(newOrder);
      return newOrder;
    },
    []
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, note?: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedOrder = {
            ...order,
            status,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              { status, timestamp: now, note },
            ],
          };
          return updatedOrder;
        }
        return order;
      })
    );
  }, []);

  const uploadPaymentProof = useCallback((orderId: string, proofUrl: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            paymentProof: proofUrl,
            status: 'pending_confirmation' as OrderStatus,
            updatedAt: now,
            statusHistory: [
              ...order.statusHistory,
              {
                status: 'pending_confirmation' as OrderStatus,
                timestamp: now,
                note: 'Bukti pembayaran diupload',
              },
            ],
          };
        }
        return order;
      })
    );
  }, []);

  const getOrderByTracking = useCallback(
    (trackingId: string) => {
      return orders.find((order) => order.trackingId === trackingId);
    },
    [orders]
  );

  const getOrderByNumberAndWhatsApp = useCallback(
    (orderNumber: string, whatsapp: string) => {
      return orders.find(
        (order) =>
          order.orderNumber === orderNumber && order.customer.whatsapp === whatsapp
      );
    },
    [orders]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        createOrder,
        updateOrderStatus,
        uploadPaymentProof,
        getOrderByTracking,
        getOrderByNumberAndWhatsApp,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
