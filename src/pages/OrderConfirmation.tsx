import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import OrderDetailsCard from '@/components/order/OrderDetailsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOrder } from '@/context/OrderContext';
import { bankAccounts } from '@/data/products';
import { formatCurrency, generateWhatsAppLink } from '@/utils/format';
import { toast } from 'sonner';
import { Upload, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';

const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, uploadPaymentProof } = useOrder();
  const [uploadedProof, setUploadedProof] = useState<string | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedProof(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProof = () => {
    if (!uploadedProof) {
      toast.error('Silakan upload bukti pembayaran terlebih dahulu');
      return;
    }
    uploadPaymentProof(order.id, uploadedProof);
    toast.success('Bukti pembayaran berhasil diupload!');
  };

  const copyToClipboard = (text: string, bankName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankName);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const trackingUrl = `${window.location.origin}/track/${order.trackingId}`;

  const whatsAppMessage = `Halo, saya ingin konfirmasi pesanan:
Nomor Order: ${order.orderNumber}
Total: ${formatCurrency(order.total)}
Link Tracking: ${trackingUrl}`;

  const whatsAppLink = generateWhatsAppLink('081234567890', whatsAppMessage);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="font-display text-2xl font-bold text-green-800 mb-2">
              Pesanan Berhasil Dibuat!
            </h1>
            <p className="text-green-700">
              Nomor pesanan Anda: <strong>{order.orderNumber}</strong>
            </p>
          </div>

          {/* Tracking Link */}
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
            <h2 className="font-display text-xl font-semibold mb-4">Link Tracking</h2>
            <div className="flex items-center gap-2 bg-secondary p-3 rounded-lg">
              <input
                type="text"
                value={trackingUrl}
                readOnly
                className="flex-1 bg-transparent text-sm outline-none"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(trackingUrl);
                  toast.success('Link berhasil disalin!');
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <a href={trackingUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Simpan link ini untuk melacak status pesanan Anda
            </p>
          </div>

          {/* Payment Section */}
          {order.status === 'pending_payment' && order.paymentMethod === 'transfer' && (
            <div className="bg-card rounded-2xl p-6 shadow-soft mb-8 space-y-6">
              <h2 className="font-display text-xl font-semibold">Pembayaran</h2>

              <div className="bg-accent/10 p-4 rounded-xl">
                <p className="text-lg font-bold text-primary">
                  Total: {formatCurrency(order.total)}
                </p>
              </div>

              {/* Bank Accounts */}
              <div className="space-y-3">
                <Label>Transfer ke salah satu rekening berikut:</Label>
                {bankAccounts.map((bank) => (
                  <div
                    key={bank.bank}
                    className="flex items-center justify-between bg-secondary p-4 rounded-xl"
                  >
                    <div>
                      <p className="font-semibold">{bank.bank}</p>
                      <p className="text-lg font-mono">{bank.accountNumber}</p>
                      <p className="text-sm text-muted-foreground">a.n. {bank.accountName}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(bank.accountNumber, bank.bank)}
                    >
                      {copiedBank === bank.bank ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>

              {/* Upload Proof */}
              <div className="space-y-3">
                <Label>Upload Bukti Transfer</Label>
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProofUpload}
                  />
                  {uploadedProof ? (
                    <img
                      src={uploadedProof}
                      alt="Bukti Transfer"
                      className="h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Upload className="w-10 h-10 mx-auto mb-2" />
                      <p>Klik untuk upload bukti transfer</p>
                    </div>
                  )}
                </label>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmitProof}
                  disabled={!uploadedProof}
                >
                  Kirim Bukti Pembayaran
                </Button>
              </div>
            </div>
          )}

          {/* WhatsApp Contact */}
          <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
            <h2 className="font-display text-xl font-semibold mb-4">Hubungi Kami</h2>
            <a href={whatsAppLink} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="lg" className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-5 h-5" />
                Chat via WhatsApp
              </Button>
            </a>
          </div>

          {/* Order Details */}
          <OrderDetailsCard order={order} />
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
