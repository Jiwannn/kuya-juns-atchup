import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { role } = await request.json();
    const userId = params.id;

    console.log(`🔄 Attempting to update user ${userId} to role: ${role}`);

    // Validate role
    if (!role || !['admin', 'customer'].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // Update the user role
    const result = await sql`
      UPDATE users 
      SET role = ${role}, updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, email, role
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log(`✅ User ${userId} updated to role: ${role}`);

    return NextResponse.json({ 
      success: true, 
      message: `User role updated to ${role}`,
      user: result[0]
    });
    
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}