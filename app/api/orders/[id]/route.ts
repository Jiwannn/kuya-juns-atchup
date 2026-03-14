import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await sql`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ${params.id}
    `;

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = await sql`
      SELECT oi.*, p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${params.id}
    `;

    return NextResponse.json({
      ...orders[0],
      items: items
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, payment_status } = body;

    await sql`
      UPDATE orders 
      SET status = COALESCE(${status}, status),
          payment_status = COALESCE(${payment_status}, payment_status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}