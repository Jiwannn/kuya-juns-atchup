"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  PlusCircle,
  Eye,
  Calendar
} from "lucide-react";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  outOfStockProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  todayRevenue: number;
  newMessages: number;
  cateringInquiries: number;
}

interface RecentOrder {
  id: number;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

// Custom PHP Icon Component
const PhpIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <text x="6" y="18" fontSize="16" fontWeight="bold" fill="currentColor">₱</text>
  </svg>
);

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    newMessages: 0,
    cateringInquiries: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (session?.user?.role !== 'admin') {
      router.push("/");
      return;
    }

    fetchDashboardData();
  }, [session, status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch stats
      const statsRes = await fetch("/api/admin/stats");
      if (!statsRes.ok) throw new Error("Failed to fetch stats");
      const statsData = await statsRes.json();
      
      // Fetch recent orders
      const ordersRes = await fetch("/api/orders?limit=5");
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      const ordersData = await ordersRes.json();

      setStats({
        totalOrders: statsData.totalOrders || 0,
        pendingOrders: statsData.pendingOrders || 0,
        processingOrders: statsData.processingOrders || 0,
        completedOrders: statsData.completedOrders || 0,
        cancelledOrders: statsData.cancelledOrders || 0,
        totalProducts: statsData.totalProducts || 0,
        outOfStockProducts: statsData.outOfStockProducts || 0,
        totalCustomers: statsData.totalCustomers || 0,
        totalRevenue: statsData.totalRevenue || 0,
        todayRevenue: statsData.todayRevenue || 0,
        newMessages: statsData.newMessages || 0,
        cateringInquiries: statsData.cateringInquiries || 0
      });

      // Handle orders data
      if (Array.isArray(ordersData)) {
        setRecentOrders(ordersData.slice(0, 5));
      } else if (ordersData.orders) {
        setRecentOrders(ordersData.orders.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      currencyDisplay: 'symbol'
    }).format(amount).replace('PHP', '₱');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      subValue: `Today: ${formatCurrency(stats.todayRevenue)}`,
      icon: PhpIcon,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toString(),
      subValue: `Pending: ${stats.pendingOrders}`,
      icon: ShoppingBag,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      title: "Products",
      value: stats.totalProducts.toString(),
      subValue: `Out of stock: ${stats.outOfStockProducts}`,
      icon: Package,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      title: "Customers",
      value: stats.totalCustomers.toString(),
      subValue: "Registered users",
      icon: Users,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Messages",
      value: stats.newMessages.toString(),
      subValue: "Unread messages",
      icon: MessageSquare,
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700"
    },
    {
      title: "Catering",
      value: stats.cateringInquiries.toString(),
      subValue: "New inquiries",
      icon: Calendar,
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {session?.user?.name}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{card.subValue}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Status Summary */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          <p className="text-xs text-gray-600">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-600">{stats.processingOrders}</p>
          <p className="text-xs text-gray-600">Processing</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
          <p className="text-xs text-gray-600">Completed</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-600">{stats.cancelledOrders}</p>
          <p className="text-xs text-gray-600">Cancelled</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <ShoppingBag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-600">{stats.totalOrders}</p>
          <p className="text-xs text-gray-600">Total</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link
          href="/admin/products/new"
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <PlusCircle className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-1">Add Product</h3>
          <p className="text-orange-100 text-sm">Create new menu item</p>
        </Link>

        <Link
          href="/admin/orders?status=pending"
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <Clock className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-1">Pending Orders</h3>
          <p className="text-yellow-100 text-sm">{stats.pendingOrders} need attention</p>
        </Link>

        <Link
          href="/admin/messages"
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <MessageSquare className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-1">Messages</h3>
          <p className="text-pink-100 text-sm">{stats.newMessages} unread</p>
        </Link>

        <Link
          href="/admin/catering"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-bold mb-1">Catering</h3>
          <p className="text-purple-100 text-sm">{stats.cateringInquiries} inquiries</p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-orange-600 hover:text-orange-700 flex items-center gap-1">
            View All <Eye className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent orders</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-gray-600">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600">{formatCurrency(order.total_amount)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}