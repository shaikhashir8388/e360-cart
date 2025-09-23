'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedColor, setSelectedColor] = useState(product.colour);
  const [selectedSize, setSelectedSize] = useState(product.size);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    
    if (!selectedColor || !selectedSize) {
      toast.error('Please select color and size');
      return;
    }

    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return;
    }

    if (quantity > product.totalStock) {
      toast.error(`Only ${product.totalStock} items available in stock`);
      return;
    }

    await addToCart(product, selectedColor, selectedSize, quantity);
  };

  const availableColors = ['blue', 'red', 'black', 'white', 'gray'];
  const availableSizes = ['sm', 'md', 'lg', 'xl'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <nav className="flex space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg border">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square relative overflow-hidden rounded border">
                  <img
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.soldCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-gray-900">${product.price}</span>
            {product.inStock ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                In Stock ({product.totalStock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
              <div className="flex space-x-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <Select value={selectedSize} onValueChange={(value: "sm" | "md" | "lg" | "xl") => setSelectedSize(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <Select value={quantity.toString()} onValueChange={(val) => setQuantity(parseInt(val))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(Math.min(10, product.totalStock))].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock || loading}
              className="flex-1"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {loading ? 'Adding...' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-500">On orders over $50</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Quality Guarantee</p>
                    <p className="text-sm text-gray-500">Premium quality products</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center space-x-3">
                  <RefreshCw className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-gray-500">Easy return policy</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
