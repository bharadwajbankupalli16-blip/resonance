import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function hashCode(email, code) {
  return createHmac("sha256", process.env.NEXTAUTH_SECRET)
    .update(`${email}:${code}:signup`)
    .digest("hex");
}

export async function POST(request) {
  try {
    if (!process.env.NEXTAUTH_SECRET) {
      return NextResponse.json({ error: "Authentication is not configured." }, { status: 500 });
    }

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const code = String(body.code || "");

    if (!name || name.length > 120 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255 ||
        password.length < 8 || password.length > 128 ||
        !/^\d{6}$/.test(code)) {
      return NextResponse.json({ error: "Please check your details and six-digit code." }, { status: 400 });
    }

    const existing = await db.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
    if (existing.rowCount > 0) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    }

    const result = await db.query(
      `SELECT id, code_hash, expires_at, attempts, consumed
       FROM otp_codes
       WHERE email = $1 AND purpose = 'signup'
       ORDER BY created_at DESC
       LIMIT 1`,
      [email]
    );

    const record = result.rows[0];
    if (!record || record.consumed || new Date(record.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ error: "The code has expired or is no longer valid. Request a new code." }, { status: 400 });
    }

    if (record.attempts >= 5) {
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }

    const expected = Buffer.from(String(record.code_hash || ""), "hex");
    const supplied = Buffer.from(hashCode(email, code), "hex");
    const valid = expected.length === supplied.length && timingSafeEqual(expected, supplied);

    if (!valid) {
      await db.query("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = $1 AND consumed = FALSE", [record.id]);
      return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
    }

    // Consume the code atomically so it cannot be used twice.
    const consumed = await db.query(
      `UPDATE otp_codes
       SET consumed = TRUE, verified = TRUE
       WHERE id = $1 AND consumed = FALSE AND expires_at > NOW() AND attempts < 5
       RETURNING id`,
      [record.id]
    );

    if (consumed.rowCount !== 1) {
      return NextResponse.json({ error: "The code is no longer valid. Request a new one." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [name, email, passwordHash]
    );

    if (created.rowCount !== 1) {
      return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
    }

    return NextResponse.json({ message: "Email verified and account created. Please sign in." }, { status: 201 });
  } catch (error) {
    console.error("OTP verification failed:", error.message);
    return NextResponse.json({ error: "Unable to verify the code. Please try again." }, { status: 500 });
  }
}
