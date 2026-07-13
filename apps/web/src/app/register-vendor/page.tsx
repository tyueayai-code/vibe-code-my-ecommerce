'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerVendor } from '@/lib/api';
import { Cake, Store, User, MapPin, CheckCircle } from 'lucide-react';

export default function RegisterVendor() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    location: { lat: 0, lng: 0 },
    isHomeBaker: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to register as a vendor');
        router.push('/login');
        return;
      }

      const vendorData = {
        shop_name: formData.shopName,
        owner_name: formData.ownerName,
        location_lat: formData.location.lat,
        location_lng: formData.location.lng,
        is_home_baker: formData.isHomeBaker,
      };

      await registerVendor(vendorData, token);
      
      // Update local user role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({...user, role: 'vendor'}));
      
      router.push('/vendor/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message || 'Vendor registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-pink-600 p-8 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">Start Your Bakery</h1>
          <p className="text-pink-100 mt-2">Join our community of passionate bakers</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g. Sweet Treats Studio"
                  value={formData.shopName}
                  onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  required
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your full name"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shop Location</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    readOnly
                    type="text"
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-500 outline-none"
                    placeholder="Click 'Get Location' to auto-fill"
                    value={formData.location.lat === 0 ? '' : `${formData.location.lat.toFixed(4)}, ${formData.location.lng.toFixed(4)}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLocationClick}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-medium transition-colors"
                >
                  Get Location
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-2xl border border-pink-100">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Cake className="w-5 h-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-pink-900">Home Baker Bonus</p>
                <p className="text-xs text-pink-700">0% commission for your first 10 orders!</p>
              </div>
              <input
                type="checkbox"
                checked={formData.isHomeBaker}
                onChange={(e) => setFormData({...formData, isHomeBaker: e.target.checked})}
                className="w-5 h-5 accent-pink-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating your shop...' : 'Register My Shop'}
          </button>
        </form>
      </div>
    </div>
  );
}
