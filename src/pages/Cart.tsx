import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CartItemCard from '@/components/cart/CartItemCard';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/format';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const Cart: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">
              Keranjang Kosong
            </h1>
            <p className="text-muted-foreground mb-8">
              Anda belum menambahkan produk apapun ke keranjang
            </p>
            <Link to="/catalog">
              <Button variant="hero" size="lg">
                Mulai Belanja
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Keranjang Belanja
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            Hapus Semua
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-soft sticky top-24">
              <h2 className="font-display text-xl font-semibold mb-4">Ringkasan</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal ({items.length} item)</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Ongkir</span>
                  <span className="text-sm">Dihitung saat checkout</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Link to="/checkout" className="block">
                  <Button variant="hero" size="lg" className="w-full">
                    Lanjut ke Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/catalog" className="block">
                  <Button variant="ghost" size="lg" className="w-full">
                    <ArrowLeft className="w-4 h-4" />
                    Lanjut Belanja
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
