import React from 'react';
import { CartItem } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="bg-card rounded-2xl p-4 md:p-6 shadow-soft animate-fade-in">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden shrink-0">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
                {item.product.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(item.product.basePrice)} (base)
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Variations */}
          <div className="mt-2 space-y-1">
            {item.selectedVariations.map((v) => (
              <div key={v.variationId} className="text-sm">
                <span className="text-muted-foreground">{v.variationName}:</span>{' '}
                <span className="font-medium">{v.optionName}</span>
                {v.priceAdd > 0 && (
                  <span className="text-muted-foreground ml-1">
                    (+{formatCurrency(v.priceAdd)})
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Customizations */}
          {item.customizations.length > 0 && (
            <div className="mt-2 space-y-1">
              {item.customizations.map((c) => (
                <div key={c.optionId} className="text-sm">
                  <span className="text-muted-foreground">{c.optionName}:</span>{' '}
                  {c.value.startsWith('data:image') ? (
                    <span className="text-accent font-medium">Foto diunggah</span>
                  ) : (
                    <span className="font-medium">"{c.value}"</span>
                  )}
                  {c.priceAdd > 0 && (
                    <span className="text-muted-foreground ml-1">
                      (+{formatCurrency(c.priceAdd)})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quantity & Subtotal */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
