import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '3';
    
    console.log(`📡 Fetching popular products with limit: ${limit}`);
    
    const products = await sql`
      SELECT p.*, COUNT(oi.id) as order_count
      FROM products p
      LEFT JOIN order_items oi ON p.id = oi.product_id
      GROUP BY p.id
      ORDER BY order_count DESC
      LIMIT ${limit}
    `;
    
    console.log(`✅ Found ${products.length} popular products`);
    
    return NextResponse.json(products || []);
  } catch (error) {
    console.error("Error fetching popular products:", error);
    return NextResponse.json([]);
  }
}