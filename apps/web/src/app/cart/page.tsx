'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 space-y-6">
        <div className="p-6 bg-white rounded-full shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-300" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-500">Looks like you haven't picked any surprises yet.</p>
        </div>
        <Button 
          onClick={() => router.push('/')}
          size="lg"
          className="px-8 shadow-lg shadow-pink-200"
        >
          Explore Cakes & Gifts
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-pink-600" /> Your Cart
          </h1>
          <Badge variant="default">{totalItems} {totalItems === 1 ? 'item' : 'items'}</Badge>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.product_id} className="flex items-center gap-4 p-0 overflow-hidden">
                <div className="w-24 h-24 bg-gray-100 flex-shrink-0 flex items-center justify-center text-3xl">
                  {item.category === 'CAKE' ? '🎂' : '🤡'}
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.product_name}</h3>
                      <p className="text-sm text-gray-500">฿{item.price.toLocaleString()}</p>
                    </div>
                    <Badge variant={item.category === 'CAKE' ? 'cake' : 'gift'}>
                      {item.category === 'CAKE' ? 'Cake' : 'Gift'}
                    </Badge>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
                      <Button 
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => removeFromCart(item.product_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card title="Order Summary" className="h-fit sticky top-24">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>฿60</span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>฿{(totalPrice + 60).toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-6">
                <Button 
                  onClick={() => router.push('/checkout')}
                  className="w-full shadow-lg shadow-pink-200"
                >
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
