'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div className="text-center p-12">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-pink-600" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{user?.name || 'User'}</h1>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl">
            <h3 className="font-bold text-gray-900">Account Details</h3>
            <p className="text-gray-600">Manage your preferences and orders here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
