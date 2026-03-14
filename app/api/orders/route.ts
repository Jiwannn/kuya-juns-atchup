import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET() {
  try {
    console.log("🔍 Fetching all orders...");
    
    // Simple query to get all orders with user info
    const orders = await sql`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.payment_status,
        o.payment_method,
        o.delivery_address,
        o.delivery_date,
        o.delivery_time,
        o.special_instructions,
        o.created_at,
        COALESCE(u.name, 'Guest') as customer_name,
        COALESCE(u.email, 'guest@example.com') as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    
    console.log(`✅ Found ${orders.length} orders`);
    console.log("First order:", orders[0]);
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: String(error) },
      { status: 500 }
    );
  }
}

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

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    console.log('Creating order for:', { fullName, email, userId });

    // Insert order
    const orderResult = await sql`
      INSERT INTO orders (
        user_id, order_number, total_amount, payment_method, 
        delivery_address, delivery_date, delivery_time, special_instructions,
        status, payment_status, created_at, updated_at
      ) VALUES (
        ${userId || null}, ${orderNumber}, ${totalAmount}, ${paymentMethod},
        ${address}, ${deliveryDate}, ${deliveryTime}, ${specialInstructions || ''},
        'pending', 'pending', NOW(), NOW()
      ) RETURNING id
    `;

    const orderId = orderResult[0].id;

    // Insert order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price, subtotal)
        VALUES (${orderId}, ${item.id}, ${item.quantity}, ${item.price}, ${item.price * item.quantity})
      `;
    }

    // Create notification for admin
    await sql`
      INSERT INTO notifications (type, title, message, reference_id, is_read, created_at)
      VALUES (
        'new_order', 
        'New Order Received', 
        ${`Order #${orderNumber} from ${fullName} - ₱${totalAmount}`},
        ${orderId},
        false,
        NOW()
      )
    `;

    return NextResponse.json({ 
      success: true, 
      orderId, 
      orderNumber 
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to create order" 
    }, { status: 500 });
  }
}