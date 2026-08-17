import { SignJWT, jwtVerify } from "jose";
import type { AuthUser } from "@/types/auth";

// Secret key - in production, this should be an environment variable
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

const ALGORITHM = "HS256";
const TOKEN_EXPIRY = "24h"; // 24 hours

export interface JWTPayload extends AuthUser {
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token for the given user
 */
export async function generateToken(user: AuthUser): Promise<string> {
  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: ALGORITHM })
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const verified = await jwtVerify(token, SECRET_KEY);
    return verified.payload as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Decode a JWT token without verification (for client-side use only)
 * Use verifyToken on the server for security-critical operations
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode base64url payload
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const json = JSON.parse(decoded);

    return json as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}
