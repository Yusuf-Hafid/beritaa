import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  ADMIN_TOKEN_TTL_SECONDS,
  signAdminToken,
} from '@/lib/auth';
import { verifyPassword } from '@/app/api/auth/password';
import { createAdminClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

type AdminRow = {
  id: string;
  username: string;
  password_hash: string;
  role: string | null;
};

const MAX_ATTEMPTS = 3;
const ATTEMPT_WINDOW_MS = 5 * 60_000;
const MAX_TRACKED_CLIENTS = 5_000;
const PASSWORD_HASH_PATTERN = /^[a-f0-9]{64}$/;
const RATE_LIMIT_MESSAGE =
  'Terlalu banyak percobaan login. Coba lagi dalam 5 menit.';

type AttemptWindow = { count: number; resetAt: number };

/**
 * Failed logins per client, kept in module scope so it survives between
 * requests handled by the same instance. This is per-process memory: a
 * multi-instance / serverless deployment gets one window per instance, so a
 * shared store would be required for a limit that spans the whole fleet.
 */
const attempts = new Map<string, AttemptWindow>();

function getClientKey(request: Request): string {
  // The first x-forwarded-for hop is the one written by the proxy in front of
  // the app; x-real-ip is the fallback some hosts use instead.
  const forwarded = request.headers.get('x-forwarded-for');
  const firstHop = forwarded?.split(',')[0]?.trim();

  return firstHop || request.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** Seconds the client has to wait, or 0 when it may try again now. */
function getRetryAfterSeconds(key: string, now: number): number {
  const entry = attempts.get(key);

  if (!entry) return 0;

  if (entry.resetAt <= now) {
    attempts.delete(key);
    return 0;
  }

  return entry.count >= MAX_ATTEMPTS
    ? Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
    : 0;
}

function recordFailure(key: string, now: number) {
  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    // Cheap guard against unbounded growth: drop expired windows before the
    // map is allowed to take another entry.
    if (attempts.size >= MAX_TRACKED_CLIENTS) {
      for (const [trackedKey, tracked] of attempts) {
        if (tracked.resetAt <= now) attempts.delete(trackedKey);
      }
    }

    attempts.set(key, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return;
  }

  entry.count += 1;
}

function readCredentials(
  input: unknown
): { username: string; passwordHash: string } | null {
  if (!input || typeof input !== 'object') return null;

  const { username, passwordHash } = input as Record<string, unknown>;

  if (typeof username !== 'string' || typeof passwordHash !== 'string') {
    return null;
  }

  const trimmedUsername = username.trim();

  // The browser sends a SHA-256 hex digest of the password, never the
  // plaintext, so only a 64-character lowercase hex string is accepted here.
  if (!trimmedUsername || !PASSWORD_HASH_PATTERN.test(passwordHash)) {
    return null;
  }

  return { username: trimmedUsername, passwordHash };
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const now = Date.now();
  const retryAfter = getRetryAfterSeconds(clientKey, now);

  // Reject before parsing or hashing: a blocked client must not be able to
  // spend bcrypt CPU on every request.
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: RATE_LIMIT_MESSAGE },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Permintaan tidak valid.' },
      { status: 400 }
    );
  }

  const credentials = readCredentials(payload);

  if (!credentials) {
    return NextResponse.json(
      { error: 'Username dan password wajib diisi.' },
      { status: 400 }
    );
  }

  if (credentials.username.length > 64) {
    recordFailure(clientKey, now);

    return NextResponse.json(
      { error: 'Username atau password salah.' },
      { status: 401 }
    );
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, password_hash, role')
      .eq('username', credentials.username)
      .maybeSingle();

    if (error) {
      console.error('[admin-login] query failed:', error.message);
      return NextResponse.json(
        { error: 'Terjadi kesalahan pada server.' },
        { status: 500 }
      );
    }

    const admin = (data ?? null) as AdminRow | null;

    // A bcrypt hash is always 60 characters. A different length means the row
    // was not written by bcrypt (common cause: a hash pasted into the SQL editor
    // got mangled), which would otherwise surface only as "wrong password".
    if (
      admin &&
      typeof admin.password_hash === 'string' &&
      admin.password_hash.length !== 60
    ) {
      console.error(
        '[admin-login] password_hash tidak valid: panjang ' +
          admin.password_hash.length +
          ' karakter, seharusnya 60. Perbaiki kolom password_hash di tabel admins.'
      );
    }

    const passwordMatches =
      admin && typeof admin.password_hash === 'string'
        ? await verifyPassword(credentials.passwordHash, admin.password_hash)
        : false;

    if (!admin || !passwordMatches) {
      recordFailure(clientKey, now);

      return NextResponse.json(
        { error: 'Username atau password salah.' },
        { status: 401 }
      );
    }

    // A valid login clears the window, so an admin is not locked out by their
    // own earlier typos.
    attempts.delete(clientKey);

    const token = await signAdminToken({
      id: admin.id,
      username: admin.username,
      role: admin.role ?? 'admin',
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_TOKEN_TTL_SECONDS,
    });

    return response;
  } catch (error) {
    console.error(
      '[admin-login] unexpected error:',
      error instanceof Error ? error.message : 'unknown'
    );

    return NextResponse.json(
      { error: 'Konfigurasi server belum lengkap.' },
      { status: 500 }
    );
  }
}
