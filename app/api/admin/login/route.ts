import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, checkPassword } from "@/lib/admin";

export async function POST(req: Request) {
  const form = await req.formData();
  const ok = checkPassword(String(form.get("password") ?? ""));
  const res = NextResponse.redirect(new URL(ok ? "/admin" : "/admin?error=1", req.url), 303);
  if (ok) {
    res.cookies.set(ADMIN_COOKIE, adminToken()!, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
