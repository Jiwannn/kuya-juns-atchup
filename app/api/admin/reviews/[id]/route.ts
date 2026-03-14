import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const { is_approved } = body;

    console.log(`🔄 Attempting to update review ${id} with is_approved:`, is_approved);

    if (typeof is_approved !== 'boolean') {
      return NextResponse.json(
        { error: "Invalid data: is_approved must be a boolean" },
        { status: 400 }
      );
    }

    // First check if review exists
    const review = await sql`
      SELECT id FROM reviews WHERE id = ${id}
    `;

    if (review.length === 0) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Update the review
    const result = await sql`
      UPDATE reviews 
      SET is_approved = ${is_approved}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, is_approved
    `;

    console.log(`✅ Review ${id} updated successfully:`, result[0]);

    return NextResponse.json({ 
      success: true, 
      message: `Review ${is_approved ? 'approved' : 'unapproved'} successfully`,
      review: result[0]
    });
  } catch (error) {
    console.error("❌ Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review", details: String(error) },
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

    console.log(`🗑️ Attempting to delete review ${id}`);

    // First check if review exists
    const review = await sql`
      SELECT id FROM reviews WHERE id = ${id}
    `;

    if (review.length === 0) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    const result = await sql`
      DELETE FROM reviews WHERE id = ${id} RETURNING id
    `;

    console.log(`✅ Review ${id} deleted successfully`);

    return NextResponse.json({ 
      success: true, 
      message: "Review deleted successfully" 
    });
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review", details: String(error) },
      { status: 500 }
    );
  }
}