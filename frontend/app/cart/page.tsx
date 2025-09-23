'use client';

import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, X, Loader2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { 
    cart, 
    loading, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    totalItems, 
    totalAmount 
  } = useCart();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
          <p className="text-gray-600 mb-6">Please login to view your shopping cart</p>
          <div className="space-x-4">
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-1">
          {loading ? 'Loading...' : `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500">Loading cart...</span>
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Button asChild>
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Cart Items</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800"
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {cart.items.map((item, index) => (
                    <div key={item._id}>
                      <div className="flex space-x-4">
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.product.images && item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold text-lg">{item.product.name}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{item.product.description}</p>
                            <div className="flex space-x-2 mt-2">
                              <Badge variant="secondary" className="capitalize">
                                {item.selectedColour}
                              </Badge>
                              <Badge variant="secondary" className="uppercase">
                                {item.selectedSize}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-lg font-semibold">
                              ${item.priceAtTime.toFixed(2)}
                              {item.priceAtTime !== item.product.price && (
                                <span className="text-sm text-gray-500 ml-2 line-through">
                                  ${item.product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                  disabled={loading}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                
                                <span className="font-medium w-12 text-center">
                                  {item.quantity}
                                </span>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                  disabled={loading || item.quantity >= item.product.totalStock}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveItem(item._id)}
                                className="text-red-500 hover:text-red-700"
                                disabled={loading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {item.quantity >= item.product.totalStock && (
                            <p className="text-sm text-amber-600">
                              Maximum stock reached ({item.product.totalStock} available)
                            </p>
                          )}
                          
                          <div className="text-sm text-gray-500">
                            Subtotal: ${(item.priceAtTime * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {index < cart.items.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Items ({totalItems})</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 text-center">
                  <p>Secure checkout with SSL encryption</p>
                  <p>Free shipping on all orders</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}