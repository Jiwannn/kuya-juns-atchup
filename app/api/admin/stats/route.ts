import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET() {
  try {
    const orders = await sql`SELECT COUNT(*) as count FROM orders`;
    const products = await sql`SELECT COUNT(*) as count FROM products`;
    const messages = await sql`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'`;
    const catering = await sql`SELECT COUNT(*) as count FROM catering_inquiries WHERE status = 'new'`;
    const pendingOrders = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`;

    return NextResponse.json({
      totalOrders: parseInt(orders[0]?.count || '0'),
      totalProducts: parseInt(products[0]?.count || '0'),
      newMessages: parseInt(messages[0]?.count || '0'),
      cateringInquiries: parseInt(catering[0]?.count || '0'),
      pendingOrders: parseInt(pendingOrders[0]?.count || '0')
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ 
      totalOrders: 0,
      totalProducts: 0,
      newMessages: 0,
      cateringInquiries: 0,
      pendingOrders: 0
    });
  }
}