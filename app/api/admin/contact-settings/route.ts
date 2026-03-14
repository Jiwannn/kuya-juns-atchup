import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";

export async function GET() {
  try {
    // Check if settings table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'contact_settings'
      ) as exists
    `;

    // If table doesn't exist, create it with default values
    if (!tableCheck[0]?.exists) {
      await sql`
        CREATE TABLE contact_settings (
          id SERIAL PRIMARY KEY,
          phone VARCHAR(50) DEFAULT '0938 585 9744',
          email VARCHAR(100) DEFAULT 'febiemosura983@gmail.com',
          address TEXT DEFAULT 'Available on FoodPanda & GrabFood',
          business_hours VARCHAR(100) DEFAULT 'Monday - Sunday, 9:00 AM - 9:00 PM',
          facebook VARCHAR(255) DEFAULT '#',
          instagram VARCHAR(255) DEFAULT '#',
          twitter VARCHAR(255) DEFAULT '#',
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Insert default settings
      await sql`
        INSERT INTO contact_settings (phone, email, address, business_hours, facebook, instagram, twitter)
        VALUES (
          '0938 585 9744',
          'febiemosura983@gmail.com',
          'Available on FoodPanda & GrabFood',
          'Monday - Sunday, 9:00 AM - 9:00 PM',
          '#',
          '#',
          '#'
        )
      `;
    }

    // Get settings
    const settings = await sql`
      SELECT * FROM contact_settings ORDER BY id DESC LIMIT 1
    `;

    return NextResponse.json(settings[0] || {});
  } catch (error) {
    console.error("Error fetching contact settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      phone,
      email,
      address,
      business_hours,
      facebook,
      instagram,
      twitter
    } = body;

    // Check if settings exist
    const existing = await sql`
      SELECT id FROM contact_settings LIMIT 1
    `;

    if (existing.length > 0) {
      // Update existing
      await sql`
        UPDATE contact_settings SET
          phone = ${phone},
          email = ${email},
          address = ${address},
          business_hours = ${business_hours},
          facebook = ${facebook},
          instagram = ${instagram},
          twitter = ${twitter},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `;
    } else {
      // Insert new
      await sql`
        INSERT INTO contact_settings (
          phone, email, address, business_hours, facebook, instagram, twitter
        ) VALUES (
          ${phone}, ${email}, ${address}, ${business_hours}, ${facebook}, ${instagram}, ${twitter}
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating contact settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}