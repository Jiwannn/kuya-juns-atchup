"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Users, 
  Calendar, 
  MessageSquare, 
  ChefHat, 
  UtensilsCrossed,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Star,
  Heart,
  TrendingUp,
  Package,
  Coffee,
  Pizza,
  Settings,
  LogOut,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Send
} from "lucide-react";

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  averageRating: number;
  pendingOrders: number;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState("");
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    averageRating: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    if (session) {
      fetchDashboardData();
    }
  }, [status, router, session]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch recent orders
      try {
        const ordersRes = await fetch('/api/orders?limit=3');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setRecentOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }

      // Fetch popular products
      try {
        const productsRes = await fetch('/api/products/popular?limit=3');
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setPopularProducts(Array.isArray(productsData) ? productsData : []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }

      // Fetch stats if owner or test account
      if (session?.user?.email === "febiemosura983@gmail.com" || session?.user?.email === "test@gmail.com") {
        try {
          const statsRes = await fetch('/api/admin/stats');
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats({
              totalOrders: statsData.totalOrders || 0,
              totalRevenue: statsData.totalRevenue || 0,
              totalCustomers: statsData.totalCustomers || 0,
              averageRating: statsData.averageRating || 0,
              pendingOrders: statsData.pendingOrders || 0
            });
          }
        } catch (error) {
          console.error('Error fetching stats:', error);
        }
      }
    } catch (error) {
      console.error('Error in fetchDashboardData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm)
      });

      if (response.ok) {
        setContactSubmitted(true);
        setContactForm({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });
        setTimeout(() => setContactSubmitted(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
    } finally {
      setContactLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 text-orange-600 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Kuya Jun's Atchup Sabaw</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isOwner = session.user?.email === "febiemosura983@gmail.com" || session.user?.email === "test@gmail.com";
  const firstName = session.user?.name?.split(' ')[0] || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-orange-100 sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800">Kuya Jun's</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition">
                <Bell className="w-5 h-5" />
                {stats.pendingOrders > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingOrders}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-orange-100">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {isOwner ? 'Owner' : 'Customer'}
                    {session.user?.email === "test@gmail.com" && " (Test Account)"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-lg">
                    {session.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl shadow-xl overflow-hidden">
            <div className="relative px-8 py-12">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='white'/%3E%3C/svg%3E')",
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-orange-100 mb-3">
                  <Heart className="w-5 h-5 fill-current" />
                  <span className="text-sm font-medium">Welcome back!</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                  {greeting}, {firstName}! 👋
                </h1>
                <p className="text-xl text-orange-100 max-w-2xl">
                  {isOwner 
                    ? "Your restaurant is doing great! Here's what's happening today."
                    : "Ready to satisfy your cravings? Check out our delicious menu."}
                </p>
                
                <div className="flex flex-wrap gap-6 mt-8">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-orange-100 text-sm">Member since</p>
                    <p className="text-white font-semibold">2024</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                    <p className="text-orange-100 text-sm">Orders</p>
                    <p className="text-white font-semibold">{recentOrders.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Only for Owner/Test Account */}
        {isOwner && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  {stats?.totalRevenue > 0 ? '+12%' : '0%'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₱{stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
              </p>
              <p className="text-sm text-gray-500">Today's Revenue</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  {stats?.totalOrders > 0 ? '+5%' : '0%'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalOrders || 0}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  {stats?.totalCustomers > 0 ? '+8%' : '0%'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalCustomers || 0}</p>
              <p className="text-sm text-gray-500">Total Customers</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-green-500 text-sm font-semibold">
                  {stats?.averageRating > 0 ? stats.averageRating.toFixed(1) : '0'}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.averageRating > 0 ? '⭐'.repeat(Math.floor(stats.averageRating)) : 'No ratings'}
              </p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
            <Link href="/menu" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/menu" 
              className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-3xl -mr-8 -mt-8 group-hover:bg-orange-100 transition"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <ShoppingBag className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Browse Menu</h3>
                <p className="text-sm text-gray-500">Explore our dishes</p>
              </div>
            </Link>

            <Link 
              href="/catering" 
              className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-3xl -mr-8 -mt-8 group-hover:bg-orange-100 transition"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Calendar className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Catering</h3>
                <p className="text-sm text-gray-500">Plan your event</p>
              </div>
            </Link>

            <Link 
              href="/about" 
              className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-3xl -mr-8 -mt-8 group-hover:bg-orange-100 transition"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Users className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">About Us</h3>
                <p className="text-sm text-gray-500">Our story</p>
              </div>
            </Link>

            <div 
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100 overflow-hidden cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-50 rounded-bl-3xl -mr-8 -mt-8 group-hover:bg-orange-100 transition"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <MessageSquare className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Contact Us</h3>
                <p className="text-sm text-gray-500">Get in touch</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Section - Only for Owner/Test Account */}
        {isOwner && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Admin Controls</h2>
              <Link href="/admin" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                Admin Dashboard <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Link 
                href="/admin/products" 
                className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white"
              >
                <ChefHat className="w-8 h-8 mb-3 group-hover:scale-110 transition" />
                <h3 className="text-xl font-bold mb-1">Manage Products</h3>
                <p className="text-orange-100 text-sm">Add, edit, or remove menu items</p>
              </Link>

              <Link 
                href="/admin/orders" 
                className="group bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white"
              >
                <ShoppingBag className="w-8 h-8 mb-3 group-hover:scale-110 transition" />
                <h3 className="text-xl font-bold mb-1">View Orders</h3>
                <p className="text-amber-100 text-sm">Track and manage customer orders</p>
              </Link>

              <Link 
                href="/admin/catering" 
                className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white"
              >
                <Calendar className="w-8 h-8 mb-3 group-hover:scale-110 transition" />
                <h3 className="text-xl font-bold mb-1">Catering Inquiries</h3>
                <p className="text-purple-100 text-sm">Respond to catering requests</p>
              </Link>
            </div>
          </div>
        )}

        {/* Popular Items - Real Data */}
        {popularProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Popular Today</h2>
              <Link href="/menu" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                View Full Menu <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {popularProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group">
                  <div 
                    className="h-40 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${product.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1887&q=80'})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 text-white font-semibold">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-orange-600">₱{product.price}</span>
                      <Link 
                        href={`/menu?id=${product.id}`}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition"
                      >
                        Order Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Orders - Real Data */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 p-3 bg-orange-50 rounded-xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Order #{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()} • ₱{order.total_amount}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No orders yet</p>
              <Link href="/menu" className="inline-block mt-4 text-orange-600 hover:text-orange-700 font-semibold">
                Start Browsing Menu →
              </Link>
            </div>
          )}
        </div>

        {/* Contact Section - At the bottom */}
        <div id="contact-section" className="scroll-mt-20">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Contact Information */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-orange-100 mb-8">
                  Have questions? We'd love to hear from you. Reach out to us through any of these channels.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-200 mb-1">Call or Text</p>
                      <a href="tel:09385859744" className="text-xl font-semibold hover:text-orange-200 transition">
                        0938 585 9744
                      </a>
                      <p className="text-sm text-orange-200 mt-1">Mon-Sun, 9:00 AM - 9:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-200 mb-1">Email</p>
                      <a href="mailto:febiemosura983@gmail.com" className="text-xl font-semibold hover:text-orange-200 transition break-all">
                        febiemosura983@gmail.com
                      </a>
                      <p className="text-sm text-orange-200 mt-1">We reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-200 mb-1">Delivery Partners</p>
                      <p className="text-xl font-semibold">FoodPanda • GrabFood</p>
                      <p className="text-sm text-orange-200 mt-1">Order through the apps</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-200 mb-1">Business Hours</p>
                      <p className="text-xl font-semibold">Monday - Sunday</p>
                      <p className="text-xl font-semibold text-orange-200">9:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm text-orange-200 mb-3">Follow us on social media</p>
                  <div className="flex gap-3">
                    <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center hover:bg-white/30 transition">
                      <span className="font-bold">f</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center hover:bg-white/30 transition">
                      <span className="font-bold">ig</span>
                    </a>
                    <a href="#" className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center hover:bg-white/30 transition">
                      <span className="font-bold">t</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                
                {contactSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We'll get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="What is this about?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Type your message here..."
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {contactLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}