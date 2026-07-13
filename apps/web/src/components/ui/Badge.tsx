import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cake' | 'gift' | 'default';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variants = {
    cake: 'bg-pink-100 text-pink-600 border-pink-200',
    gift: 'bg-yellow-100 text-yellow-600 border-yellow-200',
    default: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
