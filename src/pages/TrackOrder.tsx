import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import OrderDetailsCard from '@/components/order/OrderDetailsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrder } from '@/context/OrderContext';
import { Search, Package } from 'lucide-react';

const TrackOrder: React.FC = () => {
  const { trackingId } = useParams<{ trackingId?: string }>();
  const { getOrderByTracking, getOrderByNumberAndWhatsApp } = useOrder();

  const [searchMode, setSearchMode] = useState<'link' | 'manual'>('manual');
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [foundOrder, setFoundOrder] = useState<ReturnType<typeof getOrderByTracking>>(undefined);
  const [searched, setSearched] = useState(false);

  // If trackingId is provided in URL, try to find order
  React.useEffect(() => {
    if (trackingId) {
      const order = getOrderByTracking(trackingId);
      setFoundOrder(order);
      setSearched(true);
    }
  }, [trackingId, getOrderByTracking]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const order = getOrderByNumberAndWhatsApp(orderNumber, whatsapp);
    setFoundOrder(order);
    setSearched(true);
  };

  // If URL has tracking ID, show order or not found
  if (trackingId) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-12">
          {foundOrder ? (
            <div className="max-w-4xl mx-auto">
              <OrderDetailsCard order={foundOrder} />
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-4">
                Pesanan Tidak Ditemukan
              </h1>
              <p className="text-muted-foreground mb-8">
                Link tracking tidak valid atau pesanan tidak ditemukan
              </p>
              <Link to="/track">
                <Button variant="outline">Cari Pesanan</Button>
              </Link>
            </div>
          )}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Lacak Pesanan
            </h1>
            <p className="text-muted-foreground">
              Masukkan nomor pesanan dan nomor WhatsApp untuk melacak pesanan Anda
            </p>
          </div>

          {!searched || !foundOrder ? (
            <div className="bg-card rounded-2xl p-6 shadow-soft">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Nomor Pesanan</Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="ORD-20241225-XXXX"
                    required
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="08123456789"
                    required
                    className="bg-background"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <Search className="w-5 h-5" />
                  Lacak Pesanan
                </Button>
              </form>

              {searched && !foundOrder && (
                <div className="mt-6 text-center p-4 bg-destructive/10 rounded-xl">
                  <p className="text-destructive">
                    Pesanan tidak ditemukan. Pastikan nomor pesanan dan WhatsApp benar.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => {
                  setFoundOrder(undefined);
                  setSearched(false);
                  setOrderNumber('');
                  setWhatsapp('');
                }}
              >
                ← Cari Pesanan Lain
              </Button>
              <OrderDetailsCard order={foundOrder} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
