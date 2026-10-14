import { NextResponse } from "next/server";
import { randomInt, createHmac } from "node:crypto";
import { Resend } from "resend";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function hashCode(email, code) {
  return createHmac("sha256", process.env.NEXTAUTH_SECRET)
    .update(`${email}:${code}:signup`)
    .digest("hex");
}

export async function POST(request) {
  try {
    if (
      !process.env.RESEND_API_KEY ||
      !process.env.EMAIL_FROM ||
      !process.env.NEXTAUTH_SECRET
    ) {
      return NextResponse.json(
        { error: "Email service configuration is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (existing.rowCount > 0) {
      return NextResponse.json(
        { error: "This email already has an account. Please sign in." },
        { status: 409 }
      );
    }

    const recent = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM otp_codes
       WHERE email = $1
         AND purpose = 'signup'
         AND created_at > NOW() - INTERVAL '15 minutes'`,
      [email]
    );

    if (recent.rows[0].count >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const code = String(randomInt(0, 1000000)).padStart(6, "0");
    const codeHash = hashCode(email, code);

    await db.query(
      `UPDATE otp_codes
       SET consumed = TRUE
       WHERE email = $1
         AND purpose = 'signup'
         AND consumed = FALSE`,
      [email]
    );

    const inserted = await db.query(
      `INSERT INTO otp_codes
         (email, code, expires_at, attempts, verified, created_at,
          code_hash, purpose, consumed)
       VALUES ($1, '', NOW() + INTERVAL '10 minutes', 0, FALSE, NOW(),
               $2, 'signup', FALSE)
       RETURNING id`,
      [email, codeHash]
    );

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: "Your RESONANCE verification code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">
          <h2 style="color:#ef786b">Welcome to RESONANCE</h2>
          <p>Use this code to verify your email address:</p>
          <p style="font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p>
          <p>This code expires in 10 minutes. Do not share it.</p>
          <p>If you did not request this code, ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      await db.query(
        "DELETE FROM otp_codes WHERE id = $1",
        [inserted.rows[0].id]
      );

      console.error("Resend delivery error:", error.message);

      return NextResponse.json(
        { error: "Email could not be sent. Check your Resend sender settings." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "Verification code sent. Check your email."
    });
  } catch (error) {
    console.error("OTP request error:", error.message);

    return NextResponse.json(
      { error: "Unable to send a verification code. Please try again." },
      { status: 500 }
    );
  }
}
