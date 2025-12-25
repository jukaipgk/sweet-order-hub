export interface ProductVariation {
  id: string;
  name: string;
  options: VariationOption[];
}

export interface VariationOption {
  id: string;
  name: string;
  priceAdd: number;
}

export interface CustomOption {
  id: string;
  name: string;
  type: 'text' | 'image';
  priceAdd: number;
  required: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  variations: ProductVariation[];
  customOptions: CustomOption[];
  isAvailable: boolean;
}

export interface CartItemVariation {
  variationId: string;
  variationName: string;
  optionId: string;
  optionName: string;
  priceAdd: number;
}

export interface CartItemCustom {
  optionId: string;
  optionName: string;
  value: string;
  priceAdd: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedVariations: CartItemVariation[];
  customizations: CartItemCustom[];
  subtotal: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  minDistance: number;
  maxDistance: number;
  price: number;
  minOrder: number;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface CustomerInfo {
  name: string;
  whatsapp: string;
  address: string;
  latitude: number;
  longitude: number;
  deliveryDate: string;
  deliveryTime: string;
  notes: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingId: string;
  items: CartItem[];
  customer: CustomerInfo;
  deliveryZone: DeliveryZone | null;
  deliveryFee: number;
  subtotal: number;
  total: number;
  paymentMethod: 'transfer' | 'midtrans';
  paymentProof?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
}

export type OrderStatus = 
  | 'pending_payment'
  | 'pending_confirmation'
  | 'paid'
  | 'processing'
  | 'shipping'
  | 'ready_pickup'
  | 'completed'
  | 'cancelled';

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Menunggu Pembayaran',
  pending_confirmation: 'Menunggu Konfirmasi',
  paid: 'Dibayar',
  processing: 'Diproses',
  shipping: 'Dikirim',
  ready_pickup: 'Siap Diambil',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  pending_confirmation: 'bg-orange-100 text-orange-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipping: 'bg-indigo-100 text-indigo-800',
  ready_pickup: 'bg-teal-100 text-teal-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
