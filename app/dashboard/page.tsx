"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, ArrowRight, Sparkles, Heart } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalCustomers: number;
}

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (session) {
      fetchStats();
    }
  }, [status, router, session]);

  const fetchStats = async () => {
    try {
      // Fetch product count
      const productsRes = await fetch('/api/products');
      if (productsRes.ok) {
        const products = await productsRes.json();
        setStats(prev => ({ ...prev, totalProducts: products.length || 0 }));
      }

      // For customer count, you might need a separate API endpoint
      // This is just an example - adjust based on your actual API
      const customersRes = await fetch('/api/admin/stats');
      if (customersRes.ok) {
        const data = await customersRes.json();
        setStats(prev => ({ ...prev, totalCustomers: data.totalCustomers || 0 }));
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-orange-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const firstName = session.user?.name?.split(' ')[0] || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-orange-400 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-14 h-14 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Kuya Jun's</h1>
            <p className="text-gray-500 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Atchup Sabaw Eatery
              <Sparkles className="w-4 h-4 text-orange-400" />
            </p>
          </div>

          {/* Welcome Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-6 border border-orange-100">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-orange-500 fill-current" />
              <span className="text-sm font-medium text-orange-600 uppercase tracking-wider">Welcome</span>
              <Heart className="w-5 h-5 text-orange-500 fill-current" />
            </div>

            <h2 className="text-3xl font-bold text-center mb-2">
              <span className="text-gray-800">Hello, </span>
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {firstName}!
              </span>
            </h2>
            
            <p className="text-gray-600 text-center mb-8">
              We're thrilled to have you join our foodie family. Get ready for an amazing culinary journey!
            </p>

            {/* User Info Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 mb-8 border border-orange-200">
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Signed in as
              </p>
              <div className="bg-white rounded-xl p-3 border border-orange-100">
                <p className="text-gray-700 font-mono text-sm break-all">
                  {session.user?.email}
                </p>
              </div>
            </div>

            {/* Stats removed - no hardcoded data! */}

            {/* Call to Action Button */}
            <Link
              href="/"
              className="group relative inline-flex items-center justify-center gap-3 w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-5 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative flex items-center gap-2">
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-400">
            Your culinary adventure starts now
          </p>
        </div>
      </div>
    </div>
  );
}