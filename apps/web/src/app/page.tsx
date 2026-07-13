'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [location, setLocation] = useState<{ lat: string; lng: string } | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Sweet Surprises, <span className="text-pink-600">Delivered.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find the perfect cake or funny gift to brighten someone's day.
          </p>
        </header>

        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-sm text-gray-500">Max Budget: ฿</span>
            <input
              type="number"
              placeholder="e.g. 1000"
              className="w-24 border-none bg-transparent text-sm font-medium outline-none"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <section>
          <ProductGrid 
            search={searchQuery} 
            maxPrice={maxPrice} 
            lat={location?.lat} 
            lng={location?.lng} 
          />
        </section>
      </div>
    </main>
  );
}
