import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, Product, CartItemVariation, CartItemCustom } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (
    product: Product,
    quantity: number,
    variations: CartItemVariation[],
    customizations: CartItemCustom[]
  ) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const calculateSubtotal = (
    product: Product,
    quantity: number,
    variations: CartItemVariation[],
    customizations: CartItemCustom[]
  ) => {
    const variationTotal = variations.reduce((sum, v) => sum + v.priceAdd, 0);
    const customTotal = customizations.reduce((sum, c) => sum + c.priceAdd, 0);
    return (product.basePrice + variationTotal + customTotal) * quantity;
  };

  const addItem = useCallback(
    (
      product: Product,
      quantity: number,
      variations: CartItemVariation[],
      customizations: CartItemCustom[]
    ) => {
      const subtotal = calculateSubtotal(product, quantity, variations, customizations);
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        selectedVariations: variations,
        customizations,
        subtotal,
      };
      setItems((prev) => [...prev, newItem]);
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newSubtotal = calculateSubtotal(
            item.product,
            quantity,
            item.selectedVariations,
            item.customizations
          );
          return { ...item, quantity, subtotal: newSubtotal };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
