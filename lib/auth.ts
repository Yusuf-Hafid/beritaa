import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import type { JWTPayload } from 'jose';

export const ADMIN_COOKIE_NAME = 'admin_token';
export const ADMIN_TOKEN_TTL_SECONDS = 60 * 60 * 8;

const JWT_ALGORITHM = 'HS256';
const JWT_ISSUER = 'indonews-admin';
const JWT_AUDIENCE = 'indonews-admin-panel';

export interface AdminSession extends JWTPayload {
  sub: string;
  username: string;
  role: string;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET wajib diisi minimal 32 karakter.');
  }

  return new TextEncoder().encode(secret);
}

export async function signAdminToken(admin: {
  id: string;
  username: string;
  role: string;
}): Promise<string> {
  return new SignJWT({
    username: admin.username,
    role: admin.role,
  })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(admin.id)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(getJwtSecret());
}

export async function verifyAdminToken(
  token?: string | null
): Promise<AdminSession | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.username !== 'string' ||
      typeof payload.role !== 'string'
    ) {
      return null;
    }

    return payload as AdminSession;
  } catch {
    return null;
  }
}
