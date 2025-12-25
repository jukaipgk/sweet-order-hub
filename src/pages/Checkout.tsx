import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import LocationMap from '@/components/checkout/LocationMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/context/CartContext';
import { useOrder } from '@/context/OrderContext';
import { formatCurrency, formatDate } from '@/utils/format';
import { getDeliveryZone, getDistanceFromStore, formatDistance } from '@/utils/distance';
import { timeSlots, cutOffHours, deliveryZones, maxDeliveryDistance } from '@/data/products';
import { DeliveryZone, CustomerInfo } from '@/types';
import { toast } from 'sonner';
import { MapPin, Calendar, Clock, CreditCard, Truck, AlertCircle } from 'lucide-react';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { createOrder } = useOrder();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    whatsapp: '',
    address: '',
    latitude: 0,
    longitude: 0,
    deliveryDate: '',
    deliveryTime: '',
    notes: '',
  });

  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'midtrans'>('transfer');
  const [isPickup, setIsPickup] = useState(false);
  const [minDeliveryDate, setMinDeliveryDate] = useState('');

  useEffect(() => {
    // Calculate minimum delivery date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDeliveryDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setCustomerInfo((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    const dist = getDistanceFromStore(lat, lng);
    setDistance(dist);

    if (dist > maxDeliveryDistance) {
      setSelectedZone(null);
      setIsPickup(true);
      toast.warning('Lokasi di luar area pengiriman. Hanya tersedia pickup.');
    } else {
      const zone = getDeliveryZone(lat, lng);
      setSelectedZone(zone);
      setIsPickup(false);

      if (zone && subtotal < zone.minOrder) {
        toast.warning(`Minimum order untuk ${zone.name} adalah ${formatCurrency(zone.minOrder)}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateCutOff = (): boolean => {
    if (!customerInfo.deliveryDate || !customerInfo.deliveryTime) return true;

    const deliveryDateTime = new Date(customerInfo.deliveryDate);
    const [startTime] = customerInfo.deliveryTime.split(' - ');
    const [hours] = startTime.split(':').map(Number);
    deliveryDateTime.setHours(hours, 0, 0, 0);

    const now = new Date();
    const cutOffTime = new Date(deliveryDateTime.getTime() - cutOffHours * 60 * 60 * 1000);

    return now < cutOffTime;
  };

  const canCheckout = (): boolean => {
    if (!customerInfo.name || !customerInfo.whatsapp || !customerInfo.address) return false;
    if (!customerInfo.deliveryDate || !customerInfo.deliveryTime) return false;
    if (!isPickup && customerInfo.latitude === 0) return false;
    if (!isPickup && selectedZone && subtotal < selectedZone.minOrder) return false;
    if (!validateCutOff()) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCheckout()) {
      toast.error('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    const deliveryFee = isPickup ? 0 : (selectedZone?.price || 0);
    const order = createOrder(items, customerInfo, selectedZone, deliveryFee, paymentMethod);
    
    clearCart();
    navigate(`/order/${order.id}`);
    toast.success('Pesanan berhasil dibuat!');
  };

  const deliveryFee = isPickup ? 0 : (selectedZone?.price || 0);
  const total = subtotal + deliveryFee;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="bg-card rounded-2xl p-6 shadow-soft space-y-4">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Informasi Pengiriman
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      placeholder="Nama Anda"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      value={customerInfo.whatsapp}
                      onChange={handleInputChange}
                      placeholder="08123456789"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan, Kota"
                    required
                    className="bg-background"
                    rows={3}
                  />
                </div>

                {/* Pickup Toggle */}
                <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
                  <input
                    type="checkbox"
                    id="pickup"
                    checked={isPickup}
                    onChange={(e) => setIsPickup(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="pickup" className="cursor-pointer">
                    Ambil sendiri di toko (Pickup)
                  </Label>
                </div>

                {/* Map */}
                {!isPickup && (
                  <div className="space-y-2">
                    <Label>Pin Lokasi Pengiriman *</Label>
                    <LocationMap
                      onLocationSelect={handleLocationSelect}
                      selectedLat={customerInfo.latitude}
                      selectedLng={customerInfo.longitude}
                    />
                    {distance > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-primary" />
                        <span>Jarak: {formatDistance(distance)}</span>
                        {selectedZone && (
                          <span className="bg-secondary px-2 py-1 rounded-full">
                            {selectedZone.name} - {formatCurrency(selectedZone.price)}
                          </span>
                        )}
                      </div>
                    )}
                    {distance > maxDeliveryDistance && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span>Di luar area pengiriman. Silakan pilih pickup.</span>
                      </div>
                    )}
                    {selectedZone && subtotal < selectedZone.minOrder && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4" />
                        <span>
                          Minimum order untuk {selectedZone.name}:{' '}
                          {formatCurrency(selectedZone.minOrder)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Delivery Schedule */}
              <div className="bg-card rounded-2xl p-6 shadow-soft space-y-4">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Jadwal Pengiriman
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Tanggal Pengiriman *</Label>
                    <Input
                      id="deliveryDate"
                      name="deliveryDate"
                      type="date"
                      value={customerInfo.deliveryDate}
                      onChange={handleInputChange}
                      min={minDeliveryDate}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Jam Pengiriman *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() =>
                            setCustomerInfo((prev) => ({
                              ...prev,
                              deliveryTime: slot.time,
                            }))
                          }
                          disabled={!slot.available}
                          className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                            customerInfo.deliveryTime === slot.time
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {!validateCutOff() && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      Pemesanan harus dilakukan minimal {cutOffHours} jam sebelum waktu pengiriman
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan (opsional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    placeholder="Catatan tambahan untuk pesanan..."
                    className="bg-background"
                    rows={2}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl p-6 shadow-soft space-y-4">
                <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Metode Pembayaran
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === 'transfer'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold">Transfer Bank</p>
                    <p className="text-sm text-muted-foreground">
                      Transfer manual ke rekening toko
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('midtrans')}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      paymentMethod === 'midtrans'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold">Midtrans</p>
                    <p className="text-sm text-muted-foreground">
                      E-wallet, VA, QRIS, dll
                    </p>
                  </button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24 space-y-4">
                <h2 className="font-display text-xl font-semibold">Ringkasan Pesanan</h2>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          x{item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-primary">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Ongkir</span>
                    <span className="font-medium text-foreground">
                      {isPickup ? 'Gratis (Pickup)' : formatCurrency(deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex items-center justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-xl text-primary">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={!canCheckout()}
                >
                  Buat Pesanan
                </Button>

                {!canCheckout() && (
                  <p className="text-xs text-muted-foreground text-center">
                    Lengkapi semua data untuk melanjutkan
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
