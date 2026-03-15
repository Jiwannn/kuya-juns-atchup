"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { UtensilsCrossed, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const firstName = session.user?.name?.split(' ')[0] || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-600 to-orange-500 rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <UtensilsCrossed className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-orange-800">Kuya Jun's</h1>
          <p className="text-gray-500">Atchup Sabaw Eatery</p>
        </div>

        {/* Welcome Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6 border border-orange-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, <span className="text-orange-600">{firstName}</span>! 👋
          </h2>
          <p className="text-gray-600 mb-8">
            We're glad to have you here. Ready to explore our delicious menu?
          </p>

          {/* User Info Card */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-8 text-left border border-orange-100">
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-medium text-orange-600">Email:</span>
            </p>
            <p className="text-gray-800 font-mono text-sm bg-white p-2 rounded-lg border border-orange-100">
              {session.user?.email}
            </p>
          </div>

          {/* Button to Home */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all transform hover:scale-[1.02] shadow-lg group"
          >
            Go to Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Footer */}
        <p className="text-sm text-gray-400">
          You'll be redirected to your personalized dashboard
        </p>
      </div>

      {/* Add animation */}
      <style jsx>{`
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2s infinite;
        }
      `}</style>
    </div>
  );
}