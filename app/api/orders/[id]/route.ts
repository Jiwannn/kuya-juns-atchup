import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, payment_status } = body;

    console.log(`Updating order ${params.id} with:`, { status, payment_status });

    // Build the update query based on what's provided
    if (status) {
      await sql`
        UPDATE orders 
        SET status = ${status}, updated_at = NOW()
        WHERE id = ${params.id}
      `;
      console.log(`✅ Order ${params.id} status updated to ${status}`);
    }
    
    if (payment_status) {
      await sql`
        UPDATE orders 
        SET payment_status = ${payment_status}, updated_at = NOW()
        WHERE id = ${params.id}
      `;
      console.log(`✅ Order ${params.id} payment status updated to ${payment_status}`);
    }

    // Verify the update
    const verify = await sql`
      SELECT status, payment_status FROM orders WHERE id = ${params.id}
    `;
    console.log(`📊 Order after update:`, verify[0]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orders = await sql`
      SELECT 
        o.*,
        COALESCE(u.name, 'Guest') as customer_name,
        COALESCE(u.email, 'guest@example.com') as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ${params.id}
    `;

    if (orders.length === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = await sql`
      SELECT 
        oi.*,
        p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${params.id}
    `;

    return NextResponse.json({
      ...orders[0],
      items
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}