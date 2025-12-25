import React from 'react';
import { Product } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
            <span className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-semibold">
              Habis
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3">
        <h3 className="font-display text-xl font-semibold text-foreground line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 font-body">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-sm text-muted-foreground">Mulai dari</span>
            <p className="text-lg font-bold text-primary font-body">
              {formatCurrency(product.basePrice)}
            </p>
          </div>
          <Link to={`/product/${product.id}`}>
            <Button
              variant="default"
              size="sm"
              disabled={!product.isAvailable}
            >
              Pilih
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
