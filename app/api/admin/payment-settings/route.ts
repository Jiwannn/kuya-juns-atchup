import { NextResponse } from "next/server";
import sql from "@/lib/db/neon";
// GET payment settings
export async function GET() {
  try {
    // Check if settings table exists
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'payment_settings'
      );
    `;

    // If table doesn't exist, create it
    if (!tableCheck[0].exists) {
      await sql`
        CREATE TABLE payment_settings (
          id SERIAL PRIMARY KEY,
          gcash_number VARCHAR(50) DEFAULT '0938 585 9744',
          gcash_name VARCHAR(100) DEFAULT 'Febie M.',
          bank_name VARCHAR(100) DEFAULT 'BDO',
          bank_account_name VARCHAR(200) DEFAULT 'Kuya Jun''s Atchup Sabaw',
          bank_account_number VARCHAR(50) DEFAULT '1234-5678-9012',
          bank_account_type VARCHAR(50) DEFAULT 'Savings',
          cod_available BOOLEAN DEFAULT true,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Insert default settings
      await sql`
        INSERT INTO payment_settings (
          gcash_number, gcash_name, bank_name, 
          bank_account_name, bank_account_number, 
          bank_account_type, cod_available
        ) VALUES (
          '0938 585 9744', 'Febie M.', 'BDO',
          'Kuya Jun''s Atchup Sabaw', '1234-5678-9012',
          'Savings', true
        )
      `;
    }

    // Get settings
    const settings = await sql`
      SELECT * FROM payment_settings ORDER BY id DESC LIMIT 1
    `;

    return NextResponse.json(settings[0] || {});
  } catch (error) {
    console.error("Error fetching payment settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST/PUT to update settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      gcash_number,
      gcash_name,
      bank_name,
      bank_account_name,
      bank_account_number,
      bank_account_type,
      cod_available
    } = body;

    // Check if settings exist
    const existing = await sql`
      SELECT id FROM payment_settings LIMIT 1
    `;

    if (existing.length > 0) {
      // Update existing
      await sql`
        UPDATE payment_settings SET
          gcash_number = ${gcash_number},
          gcash_name = ${gcash_name},
          bank_name = ${bank_name},
          bank_account_name = ${bank_account_name},
          bank_account_number = ${bank_account_number},
          bank_account_type = ${bank_account_type},
          cod_available = ${cod_available},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existing[0].id}
      `;
    } else {
      // Insert new
      await sql`
        INSERT INTO payment_settings (
          gcash_number, gcash_name, bank_name,
          bank_account_name, bank_account_number,
          bank_account_type, cod_available
        ) VALUES (
          ${gcash_number}, ${gcash_name}, ${bank_name},
          ${bank_account_name}, ${bank_account_number},
          ${bank_account_type}, ${cod_available}
        )
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating payment settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}