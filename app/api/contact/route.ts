import { NextResponse } from "next/server";
import { sql } from "@/lib/db/neon";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Save to database
    const result = await sql`
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (${name}, ${email}, ${phone}, ${subject}, ${message})
      RETURNING id
    `;

    // Create notification for owner
    await sql`
      INSERT INTO notifications (type, title, message, reference_id)
      VALUES (
        'contact', 
        'New Contact Message', 
        ${`From: ${name} - ${subject}`},
        ${result[0].id}
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving contact message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await sql`
      SELECT * FROM contact_messages ORDER BY created_at DESC
    `;
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}