'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, Product } from '@/lib/types';
import { apiService } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (product: Product, selectedColour: string, selectedSize: string, quantity?: number) => Promise<boolean>;
  removeFromCart: (itemId: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  // Helper getters
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Initialize cart when user logs in
  useEffect(() => {
    if (user && token) {
      refreshCart();
    } else {
      // Clear cart when user logs out
      setCart(null);
    }
  }, [user, token]);

  const refreshCart = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const response = await apiService.getCart();
      
      if (response.success && response.data) {
        setCart(response.data.cart);
      }
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      // Don't show error toast for cart fetch failures to avoid spam
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    product: Product, 
    selectedColour: string, 
    selectedSize: string, 
    quantity = 1
  ): Promise<boolean> => {
    if (!user || !token) {
      toast.error('Please login to add items to cart');
      return false;
    }

    // Validate product availability
    if (!product.inStock) {
      toast.error('This product is currently out of stock');
      return false;
    }

    if (product.totalStock < quantity) {
      toast.error(`Only ${product.totalStock} items available in stock`);
      return false;
    }

    // Validate colour and size match product
    if (selectedColour.toLowerCase() !== product.colour.toLowerCase()) {
      toast.error('Selected colour does not match product colour');
      return false;
    }

    if (selectedSize.toLowerCase() !== product.size.toLowerCase()) {
      toast.error('Selected size does not match product size');
      return false;
    }

    try {
      setLoading(true);
      const response = await apiService.addToCart({
        productId: product._id,
        quantity,
        selectedColour,
        selectedSize
      });

      if (response.success && response.data) {
        setCart(response.data.cart);
        toast.success(`${product.name} added to cart`);
        return true;
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
      return false;
    } finally {
      setLoading(false);
    }

    return false;
  };

  const removeFromCart = async (itemId: string): Promise<boolean> => {
    if (!user || !token) {
      toast.error('Please login to manage cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await apiService.removeFromCart(itemId);

      if (response.success && response.data) {
        setCart(response.data.cart);
        toast.success('Item removed from cart');
        return true;
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast.error(error.message || 'Failed to remove item from cart');
      return false;
    } finally {
      setLoading(false);
    }

    return false;
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    if (!user || !token) {
      toast.error('Please login to manage cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await apiService.updateCartItem(itemId, quantity);

      if (response.success && response.data) {
        setCart(response.data.cart);
        if (quantity === 0) {
          toast.success('Item removed from cart');
        } else {
          toast.success('Cart updated');
        }
        return true;
      }
    } catch (error: any) {
      console.error('Error updating cart:', error);
      toast.error(error.message || 'Failed to update cart');
      return false;
    } finally {
      setLoading(false);
    }

    return false;
  };

  const clearCart = async (): Promise<boolean> => {
    if (!user || !token) {
      toast.error('Please login to manage cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await apiService.clearCart();

      if (response.success && response.data) {
        setCart(response.data.cart);
        toast.success('Cart cleared');
        return true;
      }
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error(error.message || 'Failed to clear cart');
      return false;
    } finally {
      setLoading(false);
    }

    return false;
  };

  // Helper getters
  const totalItems = cart?.totalItems || 0;
  const totalAmount = cart?.totalAmount || 0;

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart,
      isOpen,
      setIsOpen,
      totalItems,
      totalAmount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}