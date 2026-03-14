import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products ORDER BY category, name
    `;
    return NextResponse.json(products.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, image_url, is_available } = body;

    const result = await sql`
      INSERT INTO products (name, description, price, category, image_url, is_available)
      VALUES (${name}, ${description}, ${price}, ${category}, ${image_url}, ${is_available})
      RETURNING *
    `;

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}