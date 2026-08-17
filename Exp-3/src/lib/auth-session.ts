import type { AuthUser } from "@/types/auth";
import { decodeToken, isTokenExpired } from "@/lib/jwt";
import { loadFromStorage, saveToStorage } from "@/utils/storage";

export const AUTH_STORAGE_KEY = "authToken";

/**
 * Get the stored JWT token from localStorage
 */
export function getStoredToken(): string | null {
  return loadFromStorage<string | null>(AUTH_STORAGE_KEY, null);
}

/**
 * Get the current authenticated user by decoding the stored JWT token
 * Returns null if no valid token is found or if the token is expired
 */
export function getStoredSession(): AuthUser | null {
  const token = getStoredToken();

  if (!token) {
    return null;
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    saveSession(null);
    return null;
  }

  // Decode and return the user from the token payload
  const payload = decodeToken(token);

  if (!payload) {
    return null;
  }

  return {
    id: payload.id,
    username: payload.username,
    name: payload.name,
    role: payload.role,
  };
}

/**
 * Save or clear the authentication session (JWT token)
 * @param token - JWT token to save, or null to clear the session
 */
export function saveSession(token: string | null): void {
  if (typeof window === "undefined") return;

  if (token) {
    saveToStorage(AUTH_STORAGE_KEY, token);
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

