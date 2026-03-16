import { NextRequest, NextResponse } from "next/server";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";

const TOKEN_NAME = "video_editor_admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export function createAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: TOKEN_NAME,
    value: "true",
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAdminCookie(response: NextResponse) {
  response.cookies.set({
    name: TOKEN_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

export function isAdminRequest(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const cookies = parseCookie(cookieHeader);
  return cookies[TOKEN_NAME] === "true";
}

export function validateAdminPassword(password: string) {
  return password === ADMIN_PASSWORD;
}
