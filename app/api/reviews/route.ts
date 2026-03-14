import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    console.log("📡 Fetching reviews. Product ID:", productId || "all");

    // Get all approved reviews - using proper tagged template literals
    let reviewsQuery;
    if (productId) {
      reviewsQuery = await sql`
        SELECT 
          r.id,
          r.product_id,
          r.rating,
          r.review,
          r.created_at,
          COALESCE(u.name, 'Anonymous') as user_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.is_approved = true AND r.product_id = ${productId}
        ORDER BY r.created_at DESC
      `;
    } else {
      reviewsQuery = await sql`
        SELECT 
          r.id,
          r.product_id,
          r.rating,
          r.review,
          r.created_at,
          COALESCE(u.name, 'Anonymous') as user_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.is_approved = true
        ORDER BY r.created_at DESC
      `;
    }

    const reviews = reviewsQuery;
    console.log(`✅ Found ${reviews.length} approved reviews`);

    // Get average ratings for all products
    const avgRatings = await sql`
      SELECT 
        product_id,
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(*) as total_reviews
      FROM reviews
      WHERE is_approved = true
      GROUP BY product_id
    `;

    return NextResponse.json({
      reviews: reviews,
      averageRatings: avgRatings
    });
  } catch (error) {
    console.error("❌ Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, product_id, order_id, rating, review } = body;

    console.log("📝 Submitting review:", { user_id, product_id, rating });

    // Check if user already reviewed this product
    const existing = await sql`
      SELECT id FROM reviews 
      WHERE user_id = ${user_id} AND product_id = ${product_id}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO reviews (user_id, product_id, order_id, rating, review, is_approved, created_at)
      VALUES (${user_id}, ${product_id}, ${order_id || null}, ${rating}, ${review}, false, NOW())
      RETURNING id
    `;

    // Create notification for admin
    await sql`
      INSERT INTO notifications (type, title, message, reference_id, created_at)
      VALUES (
        'new_review',
        'New Product Review',
        ${`New ${rating}-star review submitted for approval`},
        ${result[0].id},
        NOW()
      )
    `;

    return NextResponse.json({ 
      success: true, 
      id: result[0].id,
      message: "Review submitted for approval" 
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}