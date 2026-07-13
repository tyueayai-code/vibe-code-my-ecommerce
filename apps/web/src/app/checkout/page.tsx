'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { MapPin, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function CheckoutPage() {
  const { totalPrice } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      localStorage.setItem('checkout_recipient', JSON.stringify(formData));
      router.push('/checkout/customize');
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500">Who is the lucky recipient?</p>
        </header>

        <Card className="p-0 overflow-hidden shadow-xl border-gray-100">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" /> Recipient Name
                </label>
                <Input
                  required
                  type="text"
                  placeholder="Jane Doe"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" /> Recipient Phone
                </label>
                <Input
                  required
                  type="text"
                  placeholder="08X-XXX-XXXX"
                  value={formData.recipientPhone}
                  onChange={(e) => setFormData({...formData, recipientPhone: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> Delivery Address
                </label>
                <textarea
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                  placeholder="House no, street, district, city..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-2xl border border-pink-100 space-y-3">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total Amount</span>
                <span>฿{(totalPrice + 60).toLocaleString()}</span>
              </div>
              <p className="text-xs text-pink-600">Includes ฿60 delivery fee</p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full shadow-lg shadow-pink-200"
            >
              {isSubmitting ? 'Processing...' : 'Continue to Customization'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
