import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '3';
    
    const products = await sql`
      SELECT p.*, COUNT(oi.id) as order_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT ${limit}
    `;
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return NextResponse.json([]);
  }
}