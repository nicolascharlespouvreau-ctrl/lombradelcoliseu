import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

// Accès admin : un mot de passe unique défini dans Vercel (ADMIN_PASSWORD).
// Le cookie contient une signature dérivée du mot de passe, jamais le mot de passe lui-même.
export const ADMIN_COOKIE = "ombra_admin";

export function adminToken() {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  if (!pw) return null;
  return createHmac("sha256", pw).update("ombra-admin-v1").digest("hex");
}

export function checkPassword(input: string) {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  if (!pw) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin() {
  const token = adminToken();
  if (!token) return false;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!c || c.length !== token.length) return false;
  return timingSafeEqual(Buffer.from(c), Buffer.from(token));
}
