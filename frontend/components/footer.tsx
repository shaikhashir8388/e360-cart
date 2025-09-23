import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">e360 cart</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your ultimate shopping destination for quality products at unbeatable prices. 
                Discover amazing deals and exceptional customer service.
              </p>
            </div>
            
            {/* Social Media */}
            <div>
              <h4 className="font-semibold text-white mb-3">Follow Us</h4>
              <div className="flex space-x-3">
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-blue-600 hover:text-white">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-blue-400 hover:text-white">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-pink-600 hover:text-white">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0 hover:bg-red-600 hover:text-white">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Connected</h4>
            
            {/* Newsletter */}
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-3">
                Subscribe to get updates on new products and exclusive offers.
              </p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                />
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 px-4">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@e360cart.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce St, City, ST 12345</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Free Shipping</h5>
                <p className="text-gray-300 text-xs">On orders over $50</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Secure Payment</h5>
                <p className="text-gray-300 text-xs">100% secure transactions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-white text-sm">Quality Guarantee</h5>
                <p className="text-gray-300 text-xs">Premium products only</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 e360 cart. All rights reserved. Made with{' '}
                <Heart className="inline h-4 w-4 text-red-500 mx-1" />
                for shopping enthusiasts.
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <CreditCard className="h-3 w-3 text-white" />
                </div>
                <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                  <CreditCard className="h-3 w-3 text-white" />
                </div>
                <div className="w-8 h-5 bg-yellow-600 rounded flex items-center justify-center">
                  <CreditCard className="h-3 w-3 text-white" />
                </div>
                <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
                  <CreditCard className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
