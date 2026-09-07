export const ADMIN_SESSION_COOKIE = "sunwave_admin_session";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
  }
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmacSign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(signature));
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

import { ALL_PERMISSION_KEYS, type PermissionMap } from "@/lib/permissions";

export type SessionPayload = {
  uid: number;
  username: string;
  roleName: string;
  permissions: PermissionMap;
  exp: number;
};

export async function createSessionToken(
  identity: Pick<SessionPayload, "uid" | "username" | "roleName" | "permissions">
): Promise<string> {
  const payload: SessionPayload = {
    ...identity,
    exp: Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000,
  };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = await hmacSign(payloadB64);
  return `${payloadB64}.${signature}`;
}

// Returns the decoded, verified session, or null if the token is missing,
// tampered with, expired, or malformed. proxy.ts runs on the Edge runtime
// (a hard Next.js constraint for middleware) which can't reach Prisma/MySQL
// directly - so identity and role are embedded in the signed token itself at
// login time (where Prisma IS available, in a normal Node route handler),
// and every subsequent request just verifies the signature, no DB call
// needed on the request path.
export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [payloadB64, signature] = token.split(".");
  if (!payloadB64 || !signature) return null;

  const expectedSignature = await hmacSign(payloadB64);
  if (!timingSafeEqual(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64))) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp <= Date.now()) return null;
    if (typeof payload.uid !== "number" || typeof payload.username !== "string") return null;
    if (typeof payload.roleName !== "string" || !payload.permissions) return null;
    for (const key of ALL_PERMISSION_KEYS) {
      if (typeof payload.permissions[key] !== "boolean") return null;
    }
    return payload;
  } catch {
    return null;
  }
}

const PBKDF2_ITERATIONS = 100_000;

// Password hashing via Web Crypto PBKDF2 (not bcrypt) so the same code path
// works in both the Node runtime (API routes) and, if ever needed, the Edge
// runtime - consistent with the HMAC signing above, and with no native
// module dependency to install.
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return `${toBase64Url(salt)}:${toBase64Url(new Uint8Array(derivedBits))}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltB64, hashB64] = stored.split(":");
  if (!saltB64 || !hashB64) return false;

  const salt = fromBase64Url(saltB64);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const computed = toBase64Url(new Uint8Array(derivedBits));
  return computed.length === hashB64.length && timingSafeEqual(computed, hashB64);
}
