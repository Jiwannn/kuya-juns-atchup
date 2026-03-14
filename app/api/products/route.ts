import { NextResponse } from "next/server";
import { query, sql } from "@/lib/db/neon";

export async function GET() {
  try {
    const result = await sql`
      SELECT * FROM products ORDER BY category, name
    `;
    // result is already the rows array
    return NextResponse.json(result || []);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, image_url, is_available } = body;

    const result = await sql`
      INSERT INTO products (name, description, price, category, image_url, is_available)
      VALUES (${name}, ${description}, ${price}, ${category}, ${image_url}, ${is_available})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: result[0]?.id });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}