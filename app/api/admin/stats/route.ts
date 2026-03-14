import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET() {
  try {
    // Get order stats
    const orders = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_amount ELSE 0 END), 0) as today_revenue
      FROM orders
    `;

    // Get product stats
    const products = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN is_available = false THEN 1 END) as out_of_stock
      FROM products
    `;

    // Get customer count
    const customers = await sql`
      SELECT COUNT(DISTINCT id) as total FROM users
    `;

    // Get unread messages
    const messages = await sql`
      SELECT COUNT(*) as total FROM contact_messages WHERE status = 'unread'
    `;

    // Get new catering inquiries
    const catering = await sql`
      SELECT COUNT(*) as total FROM catering_inquiries WHERE status = 'new'
    `;

    const orderStats = orders[0] || {};

    return NextResponse.json({
      totalOrders: parseInt(orderStats.total) || 0,
      pendingOrders: parseInt(orderStats.pending) || 0,
      processingOrders: parseInt(orderStats.processing) || 0,
      completedOrders: parseInt(orderStats.completed) || 0,
      cancelledOrders: parseInt(orderStats.cancelled) || 0,
      totalRevenue: parseFloat(orderStats.total_revenue) || 0,
      todayRevenue: parseFloat(orderStats.today_revenue) || 0,
      totalProducts: parseInt(products[0]?.total) || 0,
      outOfStockProducts: parseInt(products[0]?.out_of_stock) || 0,
      totalCustomers: parseInt(customers[0]?.total) || 0,
      newMessages: parseInt(messages[0]?.total) || 0,
      cateringInquiries: parseInt(catering[0]?.total) || 0
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      todayRevenue: 0,
      totalProducts: 0,
      outOfStockProducts: 0,
      totalCustomers: 0,
      newMessages: 0,
      cateringInquiries: 0
    });
  }
}