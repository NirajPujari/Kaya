import crypto from "crypto";

/**
 * Hashes a password using PBKDF2 with a random salt.
 * Returns a string formatted as "salt:hash".
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a stored "salt:hash" string.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(":")) {
    return false;
  }
  const [salt, originalHash] = stored.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return hash === originalHash;
}
