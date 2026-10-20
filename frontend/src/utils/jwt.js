/**
 * Decode a JWT token payload without verification.
 * Verification is the backend's job — we just need the claims for UI logic.
 */
export function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extract the user role from JWT claims.
 * ASP.NET Identity uses the full ClaimTypes URI for role.
 */
export function getRoleFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return (
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    decoded['role'] ||
    null
  );
}

/**
 * Check if a JWT token is expired.
 */
export function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return Date.now() >= decoded.exp * 1000;
}

/**
 * Get the user's email from the token.
 */
export function getEmailFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return decoded.email || decoded.sub || null;
}
