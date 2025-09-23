'use client';

import { Product } from '@/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart, loading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    // Add to cart with product's default colour and size
    await addToCart(product, product.colour, product.size, 1);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-sm hover:shadow-blue-100">
      <CardContent className="p-0">
        <Link href={`/product/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-sm">
                <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
              </Button>
            </div>
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm px-3 py-1">Out of Stock</Badge>
              </div>
            )}
          </div>
        </Link>
      </CardContent>
      <CardFooter className="p-5">
        <div className="w-full space-y-2">
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{product.description}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.soldCount > 100 && (
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-green-600 font-medium">Popular</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-3 gap-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Badge variant="outline" className="text-xs capitalize">
                {product.colour}
              </Badge>
              <Badge variant="outline" className="text-xs uppercase">
                {product.size}
              </Badge>
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50"
              onClick={handleAddToCart}
              disabled={loading || !product.inStock}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.inStock ? 'Add' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}