"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ArrowRight, UtensilsCrossed, CheckCircle, PartyPopper, Sparkles, Coffee } from "lucide-react";
import { signIn } from "next-auth/react";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [userName, setUserName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        // Auto login after successful registration
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: "/"
        });

        if (result?.error) {
          setError("Account created but login failed. Please try signing in.");
          router.push("/auth/signin");
        } else {
          // Show welcome screen before redirecting
          setUserName(formData.name.split(' ')[0]);
          setRegistered(true);
          // Redirect to home after 3 seconds
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Modern Welcome Screen After Registration
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 p-4">
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out;
          }
          .animate-bounce-slow {
            animation: bounce 2s infinite;
          }
          .animate-progress {
            animation: progress 3s linear forwards;
          }
        `}</style>

        <div className="max-w-md w-full">
          {/* Main Welcome Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden transform animate-fadeIn border border-orange-100">
            {/* Decorative Top Bar */}
            <div className="h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>
            
            <div className="p-8 text-center relative">
              {/* Background Decoration */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
              </div>

              {/* Success Animation */}
              <div className="relative mb-6">
                <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-500 rounded-full mx-auto flex items-center justify-center animate-bounce-slow shadow-xl">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
                
                {/* Floating Icons */}
                <PartyPopper className="absolute -top-2 -right-2 w-8 h-8 text-orange-500 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -left-2 w-8 h-8 text-amber-500 animate-pulse delay-300" />
                <Coffee className="absolute top-1/2 -left-8 w-6 h-6 text-orange-400 animate-pulse delay-700 opacity-50" />
              </div>

              {/* Welcome Message */}
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome, <span className="text-orange-600">{userName}!</span>
              </h1>
              
              <p className="text-gray-600 mb-4">
                Your account has been successfully created.
              </p>

              <div className="bg-orange-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-700">
                  🎉 You're now part of the Kuya Jun's family! Get ready to explore our delicious menu.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full animate-progress"></div>
                </div>
                <p className="text-sm text-gray-400">
                  Redirecting you to your dashboard in a moment...
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">50+</div>
                  <div className="text-xs text-gray-500">Menu Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">15+</div>
                  <div className="text-xs text-gray-500">Years Serving</div>
                </div>
              </div>

              {/* Manual Redirect */}
              <p className="text-xs text-gray-400 mt-4">
                Not redirected?{' '}
                <Link href="/" className="text-orange-600 hover:underline font-medium">
                  Click here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 to-orange-700/90 z-10 mix-blend-multiply"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80')",
          }}
        ></div>
        
        <div className="relative z-20 h-full flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Kuya Jun's</h2>
                <p className="text-orange-200">Atchup Sabaw Eatery</p>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Join Our<br />
            <span className="text-orange-300">Foodie</span><br />
            Family!
          </h1>
          
          <p className="text-lg text-orange-100 mb-8 max-w-md">
            Create an account to enjoy exclusive offers, track orders, and more.
          </p>

          {/* Feature List */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-orange-100">Exclusive member discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-orange-100">Order history & tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-orange-100">Save your favorite items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-4 transform hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-orange-800">Create Account</h2>
            <p className="text-gray-600">Join Kuya Jun's family today</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-shake">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur"></div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur"></div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur"></div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur"></div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="w-5 h-5 text-orange-600 border-gray-300 rounded-lg focus:ring-orange-500 transition"
                required
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-600 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/signin" 
              className="text-orange-600 font-semibold hover:text-orange-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}