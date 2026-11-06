import crypto from "crypto";
import { cookies } from "next/headers";

export const SUPERADMIN_COOKIE_NAME = "superadmin_session";
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

export function getSuperadminSecret(): string {
  return process.env.SUPERADMIN_SECRET_KEY || "Jorg3lin!";
}

/**
 * Creates a cryptographically signed HMAC token for the session.
 */
export function createSessionToken(secret: string): string {
  const timestamp = Date.now().toString();
  const payload = `superadmin:${timestamp}`;
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Verifies that the session token is valid, not expired, and untampered.
 */
export function verifySessionToken(token: string | undefined | null, secret: string): boolean {
  if (!token) return false;
  const dotIndex = token.lastIndexOf(".");
  if (dotIndex === -1) return false;

  const payload = token.slice(0, dotIndex);
  const receivedSig = token.slice(dotIndex + 1);

  const parts = payload.split(":");
  if (parts.length !== 2 || parts[0] !== "superadmin") return false;

  const timestamp = Number(parts[1]);
  if (isNaN(timestamp)) return false;

  // Check expiration (7 days)
  if (Date.now() - timestamp > SESSION_MAX_AGE_SECONDS * 1000) return false;

  const expectedSig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(receivedSig, "hex"), Buffer.from(expectedSig, "hex"));
  } catch {
    return false;
  }
}

/**
 * Timing-safe string comparison to prevent timing attacks when checking passwords.
 */
export function timingSafePasswordCheck(provided: string): boolean {
  const secret = getSuperadminSecret();
  if (!provided || !secret) return false;
  const bufA = Buffer.from(provided);
  const bufB = Buffer.from(secret);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Checks if the current incoming request has a valid superadmin session cookie.
 */
export async function isSuperadminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUPERADMIN_COOKIE_NAME)?.value;
  const secret = getSuperadminSecret();
  return verifySessionToken(token, secret);
}

/**
 * Sets the HttpOnly, Secure session cookie.
 */
export async function setSuperadminSession(): Promise<void> {
  const cookieStore = await cookies();
  const secret = getSuperadminSecret();
  const token = createSessionToken(secret);

  cookieStore.set(SUPERADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Clears the session cookie (Logout).
 */
export async function clearSuperadminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SUPERADMIN_COOKIE_NAME);
}
