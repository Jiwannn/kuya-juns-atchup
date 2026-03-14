"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Users, MessageSquare, Plus, TrendingUp, Award } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    newMessages: 0,
    cateringInquiries: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-orange-800 mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">₱{stats.totalRevenue?.toLocaleString() || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Products</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">New Messages</p>
              <p className="text-3xl font-bold text-gray-800">{stats.newMessages}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Catering Inquiries</p>
              <p className="text-3xl font-bold text-gray-800">{stats.cateringInquiries}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <Link 
          href="/admin/products/new" 
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <Plus className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-bold mb-2">Add New Product</h3>
          <p className="text-orange-100 text-sm">Create a new menu item with image and details</p>
        </Link>

        <Link 
          href="/admin/products" 
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <Package className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-bold mb-2">Manage Products</h3>
          <p className="text-blue-100 text-sm">Edit, delete, or update product availability</p>
        </Link>

        <Link 
          href="/admin/orders" 
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <ShoppingBag className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-bold mb-2">View Orders</h3>
          <p className="text-green-100 text-sm">Track and manage customer orders</p>
        </Link>
      </div>
    </div>
  );
}