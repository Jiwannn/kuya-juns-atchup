"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ChefHat, Package, ShoppingBag, Calendar, Home, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated" && session?.user?.role !== 'admin') {
      router.push("/");
      return;
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Admin Header - This replaces the main navbar for admin pages */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-orange-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-xs text-orange-200">Welcome, {session.user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">View Site</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation - Below header */}
      <div className="bg-white border-b border-orange-100 fixed top-16 left-0 right-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-6 py-3">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <ChefHat className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link 
              href="/admin/catering" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Catering</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-32 container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}