import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    
    const offset = (page - 1) * limit;

    console.log("📡 Fetching users from database...");

    // Get total count
    const countResult = await sql`SELECT COUNT(*) as total FROM users`;
    const total = parseInt(countResult[0]?.total || '0');

    // Get users
    const users = await sql`
      SELECT 
        id,
        name,
        email,
        role,
        provider,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT ${limit} 
      OFFSET ${offset}
    `;
    
    console.log(`✅ Found ${users.length} users`);

    return NextResponse.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
    
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}