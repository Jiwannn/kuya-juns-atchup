import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    console.log("📡 Fetching reviews with status:", status);

    // Simple query to get all reviews with user and product info
    const reviews = await sql`
      SELECT 
        r.*,
        COALESCE(u.name, 'Anonymous') as user_name,
        COALESCE(p.name, 'Unknown Product') as product_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `;
    
    console.log(`✅ Found ${reviews.length} reviews`);

    // Filter in JavaScript instead of SQL to avoid syntax issues
    let filteredReviews = reviews;
    if (status === 'pending') {
      filteredReviews = reviews.filter(r => !r.is_approved);
    } else if (status === 'approved') {
      filteredReviews = reviews.filter(r => r.is_approved);
    }

    return NextResponse.json({ reviews: filteredReviews });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: String(error) },
      { status: 500 }
    );
  }
}