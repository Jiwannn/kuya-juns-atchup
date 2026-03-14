import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function GET() {
  try {
    const notifications = await sql`
      SELECT * FROM notifications 
      WHERE is_read = false 
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();

    await sql`
      UPDATE notifications 
      SET is_read = true 
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}

// Optional: POST to create a notification manually
export async function POST(request: Request) {
  try {
    const { type, title, message, reference_id } = await request.json();

    const result = await sql`
      INSERT INTO notifications (type, title, message, reference_id)
      VALUES (${type}, ${title}, ${message}, ${reference_id})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: result[0].id });
  } catch (error) {
    console.error("Error creating notification:", error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}