"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Users, Calendar, MessageSquare, ChefHat, LogOut } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isOwner = session.user?.email === "febiemosura983@gmail.com";

  return (
    <div className="min-h-screen bg-orange-50 py-12">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-orange-800 mb-2">
                Welcome back, {session.user?.name}! 👋
              </h1>
              <p className="text-gray-600">
                {isOwner 
                  ? "You have owner privileges. Manage your restaurant from here."
                  : "View your orders and manage your account."}
              </p>
            </div>
            {isOwner && (
              <div className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-semibold">
                Owner Account
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link 
            href="/menu" 
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
              <ShoppingBag className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Browse Menu</h3>
            <p className="text-sm text-gray-500">Explore our delicious offerings</p>
          </Link>

          {isOwner ? (
            <>
              <Link 
                href="/admin/products" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Manage Menu</h3>
                <p className="text-sm text-gray-500">Add or edit products</p>
              </Link>

              <Link 
                href="/admin/orders" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">View Orders</h3>
                <p className="text-sm text-gray-500">Manage customer orders</p>
              </Link>

              <Link 
                href="/admin/catering" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Catering</h3>
                <p className="text-sm text-gray-500">Manage inquiries</p>
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/catering" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Catering</h3>
                <p className="text-sm text-gray-500">Plan your event</p>
              </Link>

              <Link 
                href="/about" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">About Us</h3>
                <p className="text-sm text-gray-500">Learn our story</p>
              </Link>

              <Link 
                href="/contact" 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Contact</h3>
                <p className="text-sm text-gray-500">Get in touch</p>
              </Link>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-orange-800 mb-6">Recent Activity</h2>
          <div className="text-center text-gray-500 py-8">
            <p>Your recent orders and activity will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}