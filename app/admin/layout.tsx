"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { 
  ChefHat, 
  Package, 
  ShoppingBag, 
  Calendar, 
  Home, 
  Settings,
  Wallet,
  Users,
  MessageSquare,
  BarChart
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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

  // Add style to hide any stray navbars
  useEffect(() => {
    // Hide any existing navbars on admin pages
    const style = document.createElement('style');
    style.innerHTML = `
      nav:not(.admin-nav) { display: none !important; }
      .bg-white\\/80 { display: none !important; }
      [class*="backdrop-blur"] { display: none !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      style.remove();
    };
  }, []);

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
      {/* Admin Header - This is the ONLY navbar on admin pages */}
      <div className="bg-gradient-to-r from-orange-700 to-orange-600 text-white shadow-lg fixed top-0 left-0 right-0 z-[100] admin-nav">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shadow-md">
                <ChefHat className="w-7 h-7 text-orange-700" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-orange-200">Welcome, {session.user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                <Home className="w-5 h-5" />
                <span className="text-sm">View Site</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation - Below header */}
      <div className="bg-white border-b border-orange-100 fixed top-20 left-0 right-0 z-[90] shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex gap-2 py-4 min-w-max">
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <BarChart className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/products" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <Package className="w-5 h-5" />
              <span>Products</span>
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            <Link 
              href="/admin/catering" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <Calendar className="w-5 h-5" />
              <span>Catering</span>
            </Link>
            <Link 
              href="/admin/messages" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </Link>
            <Link 
              href="/admin/users" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <Users className="w-5 h-5" />
              <span>Users</span>
            </Link>
            <Link 
              href="/admin/settings/payments" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <Wallet className="w-5 h-5" />
              <span>Payments</span>
            </Link>
            <Link 
              href="/admin/settings" 
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-32 pb-8 min-h-screen">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </div>
    </div>
  );
}