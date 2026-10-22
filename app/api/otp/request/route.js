
import { NextResponse } from "next/server";
import { randomInt, createHmac } from "node:crypto";
import { Resend } from "resend";
import { db } from "@/lib/db";

export const runtime = "nodejs";

function hashCode(email, code, purpose) {
  return createHmac("sha256", process.env.NEXTAUTH_SECRET)
    .update(`${email}:${code}:${purpose}`)
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
    const purpose = String(body.purpose || "signin");

    if (!["signin", "signup"].includes(purpose)) {
      return NextResponse.json(
        { error: "Invalid verification request." },
        { status: 400 }
      );
    }

    if (
      email.length > 255 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const account = await db.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email]
    );

    if (purpose === "signup" && account.rowCount > 0) {
      return NextResponse.json(
        { error: "This email already has an account. Please sign in." },
        { status: 409 }
      );
    }

    if (purpose === "signin" && account.rowCount === 0) {
      return NextResponse.json(
        { error: "No account found. Please create an account first." },
        { status: 404 }
      );
    }

    const recent = await db.query(
      `SELECT COUNT(*)::int AS count
       FROM otp_codes
       WHERE email = $1
         AND purpose = $2
         AND created_at > NOW() - INTERVAL '15 minutes'`,
      [email, purpose]
    );

    if (recent.rows[0].count >= 3) {
      return NextResponse.json(
        { error: "Too many requests. Try again in 15 minutes." },
        { status: 429 }
      );
    }

    const code = String(randomInt(0, 1000000)).padStart(6, "0");
    const codeHash = hashCode(email, code, purpose);

    await db.query(
      `UPDATE otp_codes
       SET consumed = TRUE
       WHERE email = $1
         AND purpose = $2
         AND consumed = FALSE`,
      [email, purpose]
    );

    const inserted = await db.query(
      `INSERT INTO otp_codes
       (email, code, expires_at, attempts, verified, created_at,
        code_hash, purpose, consumed)
       VALUES ($1, '', NOW() + INTERVAL '10 minutes',
               0, FALSE, NOW(), $2, $3, FALSE)
       RETURNING id`,
      [email, codeHash, purpose]
    );

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [email],
      subject: "Your RESONANCE sign-in code",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px">
          <h2 style="color:#ef786b">RESONANCE</h2>
          <p>Your verification code is:</p>
          <p style="font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p>
          <p>This code expires in 10 minutes and can only be used once.</p>
          <p>Do not share this code with anyone.</p>
        </div>
      `,
    });

    if (error) {
      await db.query(
        "DELETE FROM otp_codes WHERE id = $1",
        [inserted.rows[0].id]
      );

      console.error("Email delivery error:", error.message);

      return NextResponse.json(
        { error: "Email could not be sent. Check your email sender settings." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: "Verification code sent. Check your email.",
    });
  } catch (error) {
    console.error("OTP request error:", error.message);

    return NextResponse.json(
      { error: "Unable to send a code. Please try again." },
      { status: 500 }
    );
  }
}
