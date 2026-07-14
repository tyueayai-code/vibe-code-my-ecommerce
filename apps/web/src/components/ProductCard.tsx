import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isCake = product.category === 'CAKE';

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
        {/* Placeholder for product image */}
        <div className={cn(
          "w-full h-full flex items-center justify-center text-gray-400",
          isCake ? "bg-pink-50" : "bg-yellow-50"
        )}>
          {isCake ? (
            <span className="text-4xl">🎂</span>
          ) : (
            <span className="text-4xl">🤡</span>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <span className={cn(
            "rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider",
            isCake ? "bg-pink-100 text-pink-600" : "bg-yellow-100 text-yellow-600"
          )}>
            {isCake ? 'Cake' : 'Funny Gift'}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 h-10">
          {product.product_name}
        </h3>
        <p className="mt-1 text-lg font-bold text-gray-900">
          ฿{product.price.toLocaleString()}
        </p>

        <div className="mt-auto pt-4">
          <button 
            onClick={() => addToCart(product)}
            className="w-full rounded-lg bg-gray-900 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-800"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

