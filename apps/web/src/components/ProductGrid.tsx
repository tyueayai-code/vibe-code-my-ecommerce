'use client';

import React, { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  category?: string;
  search?: string;
  maxPrice?: string;
  lat?: string;
  lng?: string;
}

export default function ProductGrid({ category, search, maxPrice, lat, lng }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = {
          ...(category ? { category } : {}),
          ...(search ? { search } : {}),
          ...(maxPrice ? { maxPrice } : {}),
          ...(lat ? { lat } : {}),
          ...(lng ? { lng } : {}),
        };
        const data = await getProducts(params);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [category, search, maxPrice, lat, lng]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        No products found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
