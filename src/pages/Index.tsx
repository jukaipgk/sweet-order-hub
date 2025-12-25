import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/data/products';
import { ArrowRight, Cake, Truck, Clock, Award } from 'lucide-react';

const Index: React.FC = () => {
  const featuredProducts = products.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative gradient-hero overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left animate-fade-in">
              <span className="inline-block bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold">
                🎂 Pre-order Sekarang
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Kue Spesial untuk{' '}
                <span className="text-primary">Momen Berharga</span> Anda
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Dibuat dengan cinta dan bahan premium. Pesan sekarang untuk hari istimewa Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/catalog">
                  <Button variant="hero" size="xl">
                    Lihat Katalog
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/track">
                  <Button variant="outline" size="xl">
                    Lacak Pesanan
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-accent/30 rounded-full blur-3xl animate-float" />
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80"
                  alt="Kue cantik"
                  className="relative z-10 w-full h-full object-cover rounded-3xl shadow-medium"
                />
                <div className="absolute -bottom-4 -right-4 bg-card p-4 rounded-2xl shadow-medium z-20 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">500+</p>
                      <p className="text-sm text-muted-foreground">Pelanggan Puas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Cake,
                title: 'Bahan Premium',
                description: 'Menggunakan bahan-bahan berkualitas tinggi untuk rasa terbaik',
              },
              {
                icon: Truck,
                title: 'Pengiriman Aman',
                description: 'Dikemas dengan hati-hati dan diantar tepat waktu',
              },
              {
                icon: Clock,
                title: 'Pre-order Mudah',
                description: 'Pesan minimal H-1 untuk persiapan yang sempurna',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-soft text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kue Favorit
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pilihan terbaik dari pelanggan kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/catalog">
              <Button variant="outline" size="lg">
                Lihat Semua Kue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Siap Memesan?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Pesan sekarang dan nikmati kue spesial untuk momen istimewa Anda
          </p>
          <Link to="/catalog">
            <Button
              variant="secondary"
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Mulai Pesan
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
