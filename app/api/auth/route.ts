import { NextRequest, NextResponse } from "next/server";
import { clearAdminCookie, createAdminCookie, isAdminRequest, validateAdminPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: isAdminRequest(req) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const password = String(body.password ?? "");

  if (!validateAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  createAdminCookie(res);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAdminCookie(res);
  return res;
}
