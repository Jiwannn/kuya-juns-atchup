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
  Heart,
  TrendingUp,
  Package,
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

interface ContactSettings {
  phone: string;
  email: string;
  address: string;
  business_hours: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
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
  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    phone: "0938 585 9744",
    email: "febiemosura983@gmail.com",
    address: "Available on FoodPanda & GrabFood",
    business_hours: "Monday - Sunday, 9:00 AM - 9:00 PM",
    facebook: "#",
    instagram: "#",
    twitter: "#"
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    if (session) {
      fetchDashboardData();
      fetchContactSettings();
    }
  }, [status, router, session, mounted]);

  const fetchContactSettings = async () => {
    try {
      const response = await fetch('/api/admin/contact-settings');
      if (response.ok) {
        const data = await response.json();
        setContactSettings({
          phone: data.phone || "0938 585 9744",
          email: data.email || "febiemosura983@gmail.com",
          address: data.address || "Available on FoodPanda & GrabFood",
          business_hours: data.business_hours || "Monday - Sunday, 9:00 AM - 9:00 PM",
          facebook: data.facebook || "#",
          instagram: data.instagram || "#",
          twitter: data.twitter || "#"
        });
        console.log("Contact settings loaded:", data);
      }
    } catch (error) {
      console.error("Error fetching contact settings:", error);
    }
  };

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

      // Fetch stats if user is admin
      if (session?.user?.role === 'admin') {
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

  // Helper function to format currency
  const formatCurrency = (amount: number | string | undefined): string => {
    if (amount === undefined || amount === null) return '₱0.00';
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount as string);
    if (isNaN(numAmount)) return '₱0.00';
    return `₱${numAmount.toFixed(2)}`;
  };

  // Don't render anything until mounted
  if (!mounted || status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.user?.role === 'admin';
  const firstName = session.user?.name?.split(' ')[0] || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50">
      {/* Main Content - NO NAVBAR HERE! The navbar comes from components/Navbar.tsx */}
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
                  {isAdmin 
                    ? "Your restaurant is doing great! Here's what's happening today."
                    : "Ready to satisfy your cravings? Check out our delicious menu."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Only for Admin */}
        {isAdmin && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatCurrency(stats.totalRevenue)}
              </p>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
              <p className="text-sm text-gray-500">Total Customers</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pendingOrders} Pending
              </p>
              <p className="text-sm text-gray-500">Pending Orders</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              href="/menu" 
              className="group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100 overflow-hidden"
            >
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

        {/* Admin Section - Only for Admin */}
        {isAdmin && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Controls</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link 
                href="/admin/products/new" 
                className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white"
              >
                <ChefHat className="w-8 h-8 mb-3 group-hover:scale-110 transition" />
                <h3 className="text-xl font-bold mb-1">Add New Product</h3>
                <p className="text-orange-100 text-sm">Create a new menu item</p>
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

        {/* Popular Items */}
        {popularProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Today</h2>
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
                      <span className="text-xl font-bold text-orange-600">{formatCurrency(product.price)}</span>
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

        {/* Recent Orders */}
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
                      {new Date(order.created_at).toLocaleDateString()} • {formatCurrency(order.total_amount)}
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

        {/* Contact Section - Using settings from database */}
        <div id="contact-section" className="scroll-mt-20">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Contact Information - NOW USING DATABASE SETTINGS */}
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
                      <a href={`tel:${contactSettings.phone.replace(/\s/g, '')}`} className="text-xl font-semibold hover:text-orange-200 transition">
                        {contactSettings.phone}
                      </a>
                      <p className="text-sm text-orange-200 mt-1">{contactSettings.business_hours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-200 mb-1">Email</p>
                      <a href={`mailto:${contactSettings.email}`} className="text-xl font-semibold hover:text-orange-200 transition break-all">
                        {contactSettings.email}
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
                      <p className="text-xl font-semibold">{contactSettings.address}</p>
                      <p className="text-sm text-orange-200 mt-1">Order through the apps</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-200 mb-1">Business Hours</p>
                      <p className="text-xl font-semibold">{contactSettings.business_hours}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm text-orange-200 mb-3">Follow us on social media</p>
                  <div className="flex gap-3">
                    {contactSettings.facebook && contactSettings.facebook !== '#' && (
                      <a href={contactSettings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center hover:bg-white/30 transition">
                        <span className="font-bold">f</span>
                      </a>
                    )}
                    {contactSettings.instagram && contactSettings.instagram !== '#' && (
                      <a href={contactSettings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center hover:bg-white/30 transition">
                        <span className="font-bold">ig</span>
                      </a>
                    )}
                    {contactSettings.twitter && contactSettings.twitter !== '#' && (
                      <a href={contactSettings.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center hover:bg-white/30 transition">
                        <span className="font-bold">t</span>
                      </a>
                    )}
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
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="Your Name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="Email Address"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      placeholder="Subject"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={4}
                      placeholder="Your Message"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    ></textarea>
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition disabled:opacity-50"
                    >
                      {contactLoading ? "Sending..." : "Send Message"}
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