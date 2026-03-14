import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const products = await sql`
      SELECT * FROM products WHERE id = ${params.id}
    `;

    if (products.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(products[0]);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, category, image_url, is_available } = body;

    console.log("Updating product:", { id: params.id, name, price, category });

    // Check if product exists
    const existing = await sql`
      SELECT id FROM products WHERE id = ${params.id}
    `;

    if (existing.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the product
    const result = await sql`
      UPDATE products 
      SET name = ${name},
          description = ${description},
          price = ${price},
          category = ${category},
          image_url = ${image_url || ''},
          is_available = ${is_available}
      WHERE id = ${params.id}
      RETURNING id, name, price, category, is_available
    `;

    console.log("Product updated successfully:", result[0]);

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    console.log(`🔍 Attempting to delete product with ID: ${id}`);

    // First check if product exists
    const product = await sql`
      SELECT id, name FROM products WHERE id = ${id}
    `;

    if (product.length === 0) {
      console.log(`❌ Product with ID ${id} not found`);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Found product: ${product[0].name}`);

    // Check if product has any order items
    const orderItems = await sql`
      SELECT id FROM order_items WHERE product_id = ${id} LIMIT 1
    `;

    if (orderItems.length > 0) {
      console.log(`⚠️ Product has order items, marking as unavailable`);
      
      // If product has orders, just mark as unavailable
      await sql`
        UPDATE products 
        SET is_available = false 
        WHERE id = ${id}
      `;
      
      return NextResponse.json({ 
        success: true, 
        message: "Product has existing orders. It has been marked as unavailable instead of deleted." 
      });
    }

    // No order items, safe to delete
    console.log(`✅ No order items found, deleting product`);
    
    // Delete the product
    await sql`
      DELETE FROM products WHERE id = ${id}
    `;

    console.log(`✅ Product ${id} deleted successfully`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Product deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    
    // Return detailed error for debugging
    return NextResponse.json(
      { 
        error: "Failed to delete product", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { is_available } = body;

    console.log(`Updating product ${params.id} availability to:`, is_available);

    const result = await sql`
      UPDATE products 
      SET is_available = ${is_available}
      WHERE id = ${params.id}
      RETURNING id, name, is_available
    `;

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Error updating product availability:", error);
    return NextResponse.json(
      { error: "Failed to update product availability" },
      { status: 500 }
    );
  }
}