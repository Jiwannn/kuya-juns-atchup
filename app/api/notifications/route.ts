import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

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