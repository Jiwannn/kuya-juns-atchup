"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, User, LogOut, Menu as MenuIcon, ChefHat, Package, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems, toggleCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isAdmin = session?.user?.role === 'admin';
  const isLoggedIn = !!session;

  const handleSignOut = async () => {
    try {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies by calling logout API
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Sign out from NextAuth with no redirect
      await signOut({ 
        redirect: false
      });
      
      // Force hard redirect to login page
      window.location.href = '/auth/signin';
    } catch (error) {
      console.error('Logout error:', error);
      // Ultimate fallback
      window.location.href = '/auth/signin';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-orange-700 font-bold text-xl">KJ</span>
            </div>
            <div>
              <span className="font-bold text-white text-lg block">Kuya Jun's</span>
              <span className="text-xs text-orange-200">Atchup Sabaw Eatery</span>
            </div>
          </Link>

          {/* Desktop Menu - Right side */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <Link href="/" className="hover:text-amber-200 transition text-base font-medium">
              Home
            </Link>
            <Link href="/menu" className="hover:text-amber-200 transition text-base font-medium">
              Menu
            </Link>
            <Link href="/catering" className="hover:text-amber-200 transition text-base font-medium">
              Catering
            </Link>
            <Link href="/about" className="hover:text-amber-200 transition text-base font-medium">
              About
            </Link>
            
            {/* My Orders link - only for logged in users */}
            {isLoggedIn && (
              <Link href="/orders" className="hover:text-amber-200 transition text-base font-medium flex items-center gap-1">
                <Package className="w-5 h-5" />
                Orders
              </Link>
            )}
            
            {/* Admin Dashboard Button - ONLY for admin users */}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center gap-2 bg-amber-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-400 transition shadow-md"
              >
                <LayoutDashboard className="w-5 h-5" />
                Admin
              </Link>
            )}
            
            {/* Cart button */}
            <button onClick={toggleCart} className="relative p-2 hover:text-amber-200 transition">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-orange-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Notification Bell - ONLY for admin users */}
            {isAdmin && <NotificationBell />}

            {/* User section */}
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{session.user?.name}</p>
                    <p className="text-xs text-orange-200">{isAdmin ? 'Administrator' : 'Customer'}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="bg-orange-800 p-2 rounded-full hover:bg-orange-900 transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/signin" 
                className="bg-amber-400 text-orange-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-300 transition shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={toggleCart} className="relative p-2">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-orange-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Notification Bell for mobile - ONLY for admin */}
            {isAdmin && <NotificationBell />}
            
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-500">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="hover:text-amber-200 transition px-3 py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/menu" className="hover:text-amber-200 transition px-3 py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                Menu
              </Link>
              <Link href="/catering" className="hover:text-amber-200 transition px-3 py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                Catering
              </Link>
              <Link href="/about" className="hover:text-amber-200 transition px-3 py-2 text-base" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              
              {isLoggedIn && (
                <Link href="/orders" className="hover:text-amber-200 transition px-3 py-2 text-base flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Package className="w-5 h-5" />
                  My Orders
                </Link>
              )}
              
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="flex items-center gap-2 bg-amber-500 px-4 py-2.5 rounded-lg text-sm font-semibold w-fit mx-3" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Admin Dashboard
                </Link>
              )}
              
              {session ? (
                <div className="flex items-center justify-between pt-3 border-t border-orange-500 mt-2 px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {session.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{session.user?.name}</p>
                      <p className="text-xs text-orange-200">{isAdmin ? 'Administrator' : 'Customer'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="bg-orange-800 p-2 rounded-full hover:bg-orange-900 transition"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/auth/signin" className="bg-amber-400 text-orange-900 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-300 transition inline-block w-fit mx-3" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}