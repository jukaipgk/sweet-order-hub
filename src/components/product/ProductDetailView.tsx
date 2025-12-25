import React, { useState } from 'react';
import { Product, CartItemVariation, CartItemCustom, VariationOption } from '@/types';
import { formatCurrency } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ProductDetailViewProps {
  product: Product;
}

const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, VariationOption>>({});
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<Record<string, string>>({});

  const handleVariationSelect = (variationId: string, option: VariationOption) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [variationId]: option,
    }));
  };

  const handleCustomChange = (optionId: string, value: string) => {
    setCustomizations((prev) => ({
      ...prev,
      [optionId]: value,
    }));
  };

  const handleImageUpload = (optionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prev) => ({
          ...prev,
          [optionId]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const allVariationsSelected = product.variations.every(
    (v) => selectedVariations[v.id]
  );

  const calculateTotal = () => {
    let total = product.basePrice;
    Object.values(selectedVariations).forEach((option) => {
      total += option.priceAdd;
    });
    product.customOptions.forEach((option) => {
      if (option.type === 'image' && uploadedImages[option.id]) {
        total += option.priceAdd;
      }
    });
    return total * quantity;
  };

  const handleAddToCart = () => {
    if (!allVariationsSelected) {
      toast.error('Silakan pilih semua variasi terlebih dahulu');
      return;
    }

    const variations: CartItemVariation[] = product.variations.map((v) => ({
      variationId: v.id,
      variationName: v.name,
      optionId: selectedVariations[v.id].id,
      optionName: selectedVariations[v.id].name,
      priceAdd: selectedVariations[v.id].priceAdd,
    }));

    const customs: CartItemCustom[] = [];
    product.customOptions.forEach((option) => {
      if (option.type === 'text' && customizations[option.id]) {
        customs.push({
          optionId: option.id,
          optionName: option.name,
          value: customizations[option.id],
          priceAdd: option.priceAdd,
        });
      }
      if (option.type === 'image' && uploadedImages[option.id]) {
        customs.push({
          optionId: option.id,
          optionName: option.name,
          value: uploadedImages[option.id],
          priceAdd: option.priceAdd,
        });
      }
    });

    addItem(product, quantity, variations, customs);
    toast.success('Berhasil ditambahkan ke keranjang!');
    navigate('/cart');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image */}
      <div className="aspect-square rounded-2xl overflow-hidden shadow-medium">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="space-y-6">
        <div>
          <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium mb-3">
            {product.category}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {product.name}
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            {product.description}
          </p>
        </div>

        <div className="text-2xl font-bold text-primary font-body">
          Mulai dari {formatCurrency(product.basePrice)}
        </div>

        {/* Variations */}
        <div className="space-y-6">
          {product.variations.map((variation) => (
            <div key={variation.id} className="space-y-3">
              <Label className="font-display text-lg font-semibold">
                {variation.name} <span className="text-destructive">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variation.options.map((option) => {
                  const isSelected = selectedVariations[variation.id]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVariationSelect(variation.id, option)}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <p className="font-semibold text-foreground">{option.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {option.priceAdd > 0 ? `+ ${formatCurrency(option.priceAdd)}` : 'Termasuk'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Options */}
        {product.customOptions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold">Opsi Kustomisasi</h3>
            {product.customOptions.map((option) => (
              <div key={option.id} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {option.name}
                  {option.priceAdd > 0 && (
                    <span className="text-sm text-muted-foreground">
                      (+ {formatCurrency(option.priceAdd)})
                    </span>
                  )}
                </Label>
                {option.type === 'text' ? (
                  <Input
                    placeholder={`Masukkan ${option.name.toLowerCase()}`}
                    value={customizations[option.id] || ''}
                    onChange={(e) => handleCustomChange(option.id, e.target.value)}
                    className="bg-background"
                  />
                ) : (
                  <div className="space-y-2">
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(option.id, e)}
                      />
                      {uploadedImages[option.id] ? (
                        <img
                          src={uploadedImages[option.id]}
                          alt="Preview"
                          className="h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Upload className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Upload foto</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <Label className="font-display text-lg font-semibold">Jumlah</Label>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-xl font-bold w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Total & Add to Cart */}
        <div className="bg-secondary rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-muted-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!allVariationsSelected}
          >
            <ShoppingCart className="w-5 h-5" />
            Tambah ke Keranjang
          </Button>
          {!allVariationsSelected && (
            <p className="text-sm text-destructive text-center">
              Pilih semua variasi untuk melanjutkan
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
