import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      address,
      deliveryDate,
      deliveryTime,
      specialInstructions,
      items,
      totalAmount,
      paymentMethod,
      userId
    } = body;

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const orderResult = await sql`
      INSERT INTO orders (
        user_id, order_number, total_amount, payment_method, 
        delivery_address, delivery_date, delivery_time, special_instructions
      ) VALUES (
        ${userId || null}, ${orderNumber}, ${totalAmount}, ${paymentMethod},
        ${address}, ${deliveryDate}, ${deliveryTime}, ${specialInstructions}
      ) RETURNING id
    `;

    const orderId = orderResult[0].id;

    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
        VALUES (${orderId}, ${item.id}, ${item.quantity}, ${item.price}, ${item.price * item.quantity})
      `;
    }

    await sql`
      INSERT INTO notifications (type, title, message, reference_id)
      VALUES (
        'new_order', 
        'New Order Received', 
        ${`Order #${orderNumber} from ${fullName} - ₱${totalAmount}`},
        ${orderId}
      )
    `;

    return NextResponse.json({ success: true, orderId, orderNumber });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = `
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;

    if (status) {
      query += ` WHERE o.status = '${status}'`;
    }

    query += " ORDER BY o.created_at DESC";

    const result = await sql(query);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}