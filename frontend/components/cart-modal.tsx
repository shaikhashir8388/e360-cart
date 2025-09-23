'use client';

import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, X, Loader2, ShoppingBag, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CartModal() {
  const { user } = useAuth();
  const { 
    cart, 
    loading, 
    isOpen, 
    setIsOpen, 
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    totalAmount 
  } = useCart();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
          </SheetTitle>
          <SheetDescription>
            {!user ? (
              'Please login to view your cart'
            ) : loading ? (
              'Loading cart...'
            ) : !cart || cart.items.length === 0 ? (
              'Your cart is empty'
            ) : (
              `${totalItems} ${totalItems === 1 ? 'item' : 'items'} in your cart`
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {!user ? (
            // Not logged in
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <LogIn className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">Login Required</p>
                <p className="text-gray-500 mb-4">Please login to view and manage your cart</p>
              </div>
              <div className="space-y-2 w-full max-w-xs">
                <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                <Button variant="outline" asChild className="w-full" onClick={() => setIsOpen(false)}>
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            </div>
          ) : loading ? (
            // Loading state
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading cart...</span>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            // Empty cart
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</p>
                <p className="text-gray-500 mb-4">Add some products to get started</p>
              </div>
              <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
            </div>
          ) : (
            // Cart with items
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex space-x-4 border-b pb-4 last:border-b-0">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-medium text-sm leading-tight">{item.product.name}</h4>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {item.selectedColour}
                        </Badge>
                        <Badge variant="secondary" className="text-xs uppercase">
                          {item.selectedSize}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium">${item.priceAtTime.toFixed(2)}</span>
                        {item.priceAtTime !== item.product.price && (
                          <span className="text-gray-500 ml-1">
                            (was ${item.product.price.toFixed(2)})
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="h-6 w-6 p-0"
                          disabled={loading}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="h-6 w-6 p-0"
                          disabled={loading || item.quantity >= item.product.totalStock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item._id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          disabled={loading}
                        >
                          {loading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {item.quantity >= item.product.totalStock && (
                      <p className="text-xs text-amber-600">
                        Maximum stock reached ({item.product.totalStock} available)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {user && cart && cart.items.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <Separator />
            
            {/* Cart Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <Button asChild className="w-full" onClick={() => setIsOpen(false)}>
                <Link href="/cart">View Full Cart</Link>
              </Button>
              <Button 
                asChild 
                className="w-full bg-green-600 hover:bg-green-700" 
                onClick={() => setIsOpen(false)}
              >
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full text-sm" 
              onClick={() => setIsOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}