import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";  // Changed from { sql } to sql

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, event_type, event_date, estimated_guests, budget_range, message } = body;

    const result = await sql`
      INSERT INTO catering_inquiries (name, email, phone, event_type, event_date, estimated_guests, budget_range, message, status, created_at)
      VALUES (${name}, ${email}, ${phone}, ${event_type}, ${event_date}, ${estimated_guests}, ${budget_range}, ${message}, 'new', NOW())
      RETURNING id
    `;

    await sql`
      INSERT INTO notifications (type, title, message, reference_id, is_read, created_at)
      VALUES (
        'catering', 
        'New Catering Inquiry', 
        ${`From: ${name} - ${event_type} for ${estimated_guests} guests`},
        ${result[0].id},
        false,
        NOW()
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving catering inquiry:", error);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const inquiries = await sql`
      SELECT * FROM catering_inquiries ORDER BY created_at DESC
    `;
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching catering inquiries:", error);
    return NextResponse.json([]);
  }
}