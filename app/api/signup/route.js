import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Email verification is required. Please create your account through the verification flow." },
    { status: 403 }
  );
}
