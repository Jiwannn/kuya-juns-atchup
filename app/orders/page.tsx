"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck,
  ChevronRight,
  AlertCircle,
  ShoppingBag,
  Calendar,
  MapPin,
  CreditCard
} from "lucide-react";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: number;
  order_number: string;
  total_amount: number | string;
  status: string;
  payment_status: string;
  payment_method: string;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  special_instructions: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // IMPORTANT: Pass the user ID to get only their orders
      const response = await fetch(`/api/orders?userId=${session?.user?.id}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format currency safely
  const formatCurrency = (amount: number | string | undefined): string => {
    if (amount === undefined || amount === null) return '₱0.00';
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount as string);
    if (isNaN(numAmount)) return '₱0.00';
    return `₱${numAmount.toFixed(2)}`;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing': return <Package className="w-5 h-5 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
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

  const getEstimatedDelivery = (order: Order) => {
    if (order.status === 'completed') return 'Delivered';
    if (order.status === 'cancelled') return 'Cancelled';
    
    const deliveryDate = new Date(order.delivery_date);
    const today = new Date();
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return `Today at ${order.delivery_time}`;
    if (diffDays === 1) return `Tomorrow at ${order.delivery_time}`;
    return `${deliveryDate.toLocaleDateString()} at ${order.delivery_time}`;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 p-6">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchOrders}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4"
          >
            ← Back to Orders
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-orange-100 text-sm">Order Number</p>
                  <h1 className="text-2xl font-bold font-mono">{selectedOrder.order_number}</h1>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6 space-y-6">
              {/* Delivery Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Delivery Information</h2>
                <div className="bg-orange-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-600 mt-1" />
                    <p><span className="font-medium">Address:</span> {selectedOrder.delivery_address}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-orange-600 mt-1" />
                    <p><span className="font-medium">Date:</span> {new Date(selectedOrder.delivery_date).toLocaleDateString()} at {selectedOrder.delivery_time}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Truck className="w-4 h-4 text-orange-600 mt-1" />
                    <p><span className="font-medium">Estimated Delivery:</span> {getEstimatedDelivery(selectedOrder)}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h2>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-orange-600">{formatCurrency(item.subtotal)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-orange-600">{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-orange-800">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          <Link
            href="/menu"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Order More
          </Link>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't placed any orders.</p>
            <Link
              href="/menu"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Number</p>
                      <p className="font-mono font-semibold text-gray-800">{order.order_number}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="text-lg font-bold text-orange-600">{formatCurrency(order.total_amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivery Date</p>
                      <p className="text-sm text-gray-800">
                        {new Date(order.delivery_date).toLocaleDateString()} at {order.delivery_time}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
                      <p className="text-sm text-gray-800">{getEstimatedDelivery(order)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className="text-gray-600">
                        {order.items?.length || 0} item(s)
                      </span>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700 flex items-center gap-1">
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}