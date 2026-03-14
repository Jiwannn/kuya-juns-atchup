import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();
    const id = params.id;

    console.log(`🔄 Updating catering inquiry ${id} to status: ${status}`);

    // Validate status - INCLUDING 'completed'
    const validStatuses = ['new', 'contacted', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: new, contacted, confirmed, completed, cancelled" },
        { status: 400 }
      );
    }

    // Update the status
    const result = await sql`
      UPDATE catering_inquiries 
      SET status = ${status}
      WHERE id = ${id}
      RETURNING id, status
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Catering inquiry not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Catering inquiry ${id} updated to ${status}`);

    return NextResponse.json({ 
      success: true, 
      message: `Status updated to ${status}` 
    });
  } catch (error) {
    console.error("❌ Error updating catering inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}