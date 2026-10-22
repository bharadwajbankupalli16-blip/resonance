
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

function hashCode(email, code, purpose) {
  return createHmac("sha256", process.env.NEXTAUTH_SECRET)
    .update(`${email}:${code}:${purpose}`)
    .digest("hex");
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "Email verification code",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Verification code", type: "text" },
        name: { label: "Full name", type: "text" },
        purpose: { label: "Purpose", type: "text" },
      },

      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const code = String(credentials?.code || "");
        const name = String(credentials?.name || "").trim();
        const purpose = String(credentials?.purpose || "signin");

        if (
          !process.env.NEXTAUTH_SECRET ||
          !email ||
          !/^\d{6}$/.test(code) ||
          !["signin", "signup"].includes(purpose)
        ) {
          return null;
        }

        if (purpose === "signup" && (!name || name.length > 120)) {
          return null;
        }

        const otpResult = await db.query(
          `SELECT id, code_hash, expires_at, attempts, consumed
           FROM otp_codes
           WHERE email = $1 AND purpose = $2
           ORDER BY created_at DESC
           LIMIT 1`,
          [email, purpose]
        );

        const otp = otpResult.rows[0];

        if (
          !otp ||
          otp.consumed ||
          otp.attempts >= 5 ||
          new Date(otp.expires_at).getTime() <= Date.now()
        ) {
          return null;
        }

        const expected = Buffer.from(String(otp.code_hash || ""), "hex");
        const supplied = Buffer.from(
          hashCode(email, code, purpose),
          "hex"
        );

        const valid =
          expected.length === supplied.length &&
          timingSafeEqual(expected, supplied);

        if (!valid) {
          await db.query(
            `UPDATE otp_codes
             SET attempts = attempts + 1
             WHERE id = $1 AND consumed = FALSE`,
            [otp.id]
          );
          return null;
        }

        let user;

        if (purpose === "signup") {
          // Generate a random, undisclosed password hash to preserve
          // compatibility with databases requiring password_hash.
          const randomPassword = randomBytes(32).toString("hex");
          const passwordHash = await bcrypt.hash(randomPassword, 12);

          const created = await db.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             ON CONFLICT (email) DO NOTHING
             RETURNING id, name, email`,
            [name, email, passwordHash]
          );

          user = created.rows[0];

          if (!user) {
            return null;
          }
        } else {
          const found = await db.query(
            `SELECT id, name, email
             FROM users
             WHERE email = $1
             LIMIT 1`,
            [email]
          );

          user = found.rows[0];

          if (!user) {
            return null;
          }
        }

        // Atomically consume the code to prevent reuse.
        const consumed = await db.query(
          `UPDATE otp_codes
           SET consumed = TRUE, verified = TRUE
           WHERE id = $1
             AND consumed = FALSE
             AND expires_at > NOW()
             AND attempts < 5
           RETURNING id`,
          [otp.id]
        );

        if (consumed.rowCount !== 1) {
          return null;
        }

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (session.user) session.user.id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
