'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';

const ROUTES_WITHOUT_NAVBAR = [
  '/login',
  '/register'
];

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Check if current route should hide navbar
  const shouldHideNavbar = 
    // Check specific auth routes
    ROUTES_WITHOUT_NAVBAR.includes(pathname) ||
    // Hide navbar for all admin routes
    pathname.startsWith('/admin');

  // Don't render navbar on specified routes
  if (shouldHideNavbar) {
    return null;
  }

  return <Navbar />;
}
