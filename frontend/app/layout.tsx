import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/auth-context';
import { CartProvider } from '@/context/cart-context';
import { Footer } from '@/components/footer';
import { CartModal } from '@/components/cart-modal';
import { Toaster } from '@/components/ui/sonner';
import { ConditionalNavbar } from '@/components/conditional-navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'e360 cart - Your Ultimate Shopping Destination',
  description: 'Discover amazing products with great prices and excellent quality.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <ConditionalNavbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartModal />
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}