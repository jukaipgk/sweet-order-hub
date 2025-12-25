import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductDetailView from '@/components/product/ProductDetailView';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">
            Produk tidak ditemukan
          </h1>
          <Link to="/catalog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Katalog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Katalog
        </Link>
        
        <ProductDetailView product={product} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
