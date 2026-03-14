"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, User, LogOut, Menu as MenuIcon, ChefHat } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const { totalItems, toggleCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = session?.user?.email === "febiemosura983@gmail.com";

  return (
    <nav className="bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-orange-700 font-bold text-xl">KJ</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold">Kuya Jun's Atchup</h1>
              <p className="text-xs text-orange-200">Sabaw Eatery</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-amber-200 transition">Home</Link>
            <Link href="/menu" className="hover:text-amber-200 transition">Menu</Link>
            <Link href="/catering" className="hover:text-amber-200 transition">Catering</Link>
            <Link href="/about" className="hover:text-amber-200 transition">About</Link> {/* Changed from Contact to About */}
            
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-1 bg-amber-500 px-3 py-1 rounded-full text-sm">
                <ChefHat className="w-4 h-4" />
                Admin
              </Link>
            )}
            
            <button onClick={toggleCart} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-orange-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm">{session.user?.name}</span>
                </div>
                <button onClick={() => signOut()} className="bg-orange-800 p-2 rounded-full hover:bg-orange-900">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link href="/auth/signin" className="bg-amber-400 text-orange-900 px-4 py-2 rounded-lg font-semibold hover:bg-amber-300">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={toggleCart} className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-orange-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-500">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="hover:text-amber-200 transition" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/menu" className="hover:text-amber-200 transition" onClick={() => setIsMobileMenuOpen(false)}>Menu</Link>
              <Link href="/catering" className="hover:text-amber-200 transition" onClick={() => setIsMobileMenuOpen(false)}>Catering</Link>
              <Link href="/about" className="hover:text-amber-200 transition" onClick={() => setIsMobileMenuOpen(false)}>About</Link> {/* Changed from Contact to About */}
              
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-1 bg-amber-500 px-3 py-1 rounded-full text-sm w-fit">
                  <ChefHat className="w-4 h-4" />
                  Admin
                </Link>
              )}
              
              {session ? (
                <button onClick={() => signOut()} className="text-left">Sign Out</button>
              ) : (
                <Link href="/auth/signin">Sign In</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}