import Link from 'next/link';
import { Search, ShoppingCart, User, Package, LayoutDashboard, LogOut, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function Navbar({ searchQuery, onSearchChange }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2 font-bold text-xl text-pink-600">
          <Package className="h-6 w-6" />
          <span>Cakeme:)</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cakes or funny gifts..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-pink-600 transition-colors">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItems}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {user?.role === 'vendor' ? (
                <Link href="/vendor/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              ) : (
                <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors">
                  <UserCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              )}
              <button 
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/signup" className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors px-3">
                Sign Up
              </Link>
              <Link href="/login" className="p-2 text-gray-600 hover:text-pink-600 transition-colors">
                <User className="h-6 w-6" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
