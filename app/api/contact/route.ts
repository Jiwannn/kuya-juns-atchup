import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    console.log("📝 Saving contact message:", { name, email, subject });

    // Save to database
    const result = await sql`
      INSERT INTO contact_messages (name, email, phone, subject, message, status, created_at)
      VALUES (${name}, ${email}, ${phone || ''}, ${subject}, ${message}, 'unread', NOW())
      RETURNING id
    `;

    console.log("✅ Message saved with ID:", result[0].id);

    // Create notification for admin
    await sql`
      INSERT INTO notifications (type, title, message, reference_id, is_read, created_at)
      VALUES (
        'contact', 
        'New Contact Message', 
        ${`From: ${name} - ${subject}`},
        ${result[0].id},
        false,
        NOW()
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving contact message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log("📡 Fetching all contact messages from database...");
    
    // Simple query to get all messages
    const messages = await sql`
      SELECT 
        id,
        name,
        email,
        phone,
        subject,
        message,
        status,
        created_at
      FROM contact_messages 
      ORDER BY created_at DESC
    `;
    
    console.log(`✅ Found ${messages.length} messages`);
    
    if (messages.length > 0) {
      console.log("📦 First message:", messages[0]);
    }
    
    return NextResponse.json({
      messages: messages,
      totalPages: 1,
      currentPage: 1,
      total: messages.length
    });
  } catch (error) {
    console.error("❌ Error fetching contact messages:", error);
    return NextResponse.json({ 
      messages: [], 
      totalPages: 1, 
      currentPage: 1, 
      total: 0 
    });
  }
}