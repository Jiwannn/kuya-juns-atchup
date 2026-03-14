import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [orders, products, messages, catering, pendingOrders] = await Promise.all([
      sql`SELECT COUNT(*) FROM orders`,
      sql`SELECT COUNT(*) FROM products`,
      sql`SELECT COUNT(*) FROM contact_messages WHERE status = 'unread'`,
      sql`SELECT COUNT(*) FROM catering_inquiries WHERE status = 'new'`,
      sql`SELECT COUNT(*) FROM orders WHERE status = 'pending'`
    ]);

    return NextResponse.json({
      totalOrders: parseInt(orders.rows[0].count),
      totalProducts: parseInt(products.rows[0].count),
      newMessages: parseInt(messages.rows[0].count),
      cateringInquiries: parseInt(catering.rows[0].count),
      pendingOrders: parseInt(pendingOrders.rows[0].count)
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}