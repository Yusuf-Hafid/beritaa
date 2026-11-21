'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { FloatingInput } from '@/app/admin/_components/floating-field';

/**
 * Hashes the password before it leaves the browser, so the plaintext never
 * shows up in the Network tab, proxy logs or APM traces. `crypto.subtle` only
 * exists in a secure context, which is why the submit handler refuses to send
 * anything when it is missing.
 */
async function hashPasswordForTransport(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password)
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) return;

    const trimmedUsername = username.trim();

    if (!trimmedUsername || !password) {
      setError('Username dan password wajib diisi.');
      return;
    }

    if (!globalThis.crypto?.subtle) {
      setError('Login memerlukan koneksi aman (HTTPS). Hubungi administrator.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const passwordHash = await hashPasswordForTransport(password);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmedUsername,
          passwordHash,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        setError(data?.error ?? 'Tidak dapat masuk. Silakan coba lagi.');
        setIsLoading(false);
        return;
      }

      setIsRedirecting(true);
      router.push('/admin/dashboard/upload');
    } catch {
      setError('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 space-y-7"
      noValidate
      aria-busy={isLoading}
    >
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p className="leading-5">{error}</p>
        </div>
      )}

      <FloatingInput
        label="Username"
        name="username"
        autoComplete="username"
        spellCheck={false}
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
          if (error) setError(null);
        }}
        disabled={isLoading}
        required
        showRequiredIndicator={false}
      />

      <FloatingInput
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        autoComplete="current-password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (error) setError(null);
        }}
        disabled={isLoading}
        required
        showRequiredIndicator={false}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={
              showPassword ? 'Sembunyikan password' : 'Tampilkan password'
            }
            aria-pressed={showPassword}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        }
      />

      <button
        type="submit"
        disabled={isLoading}
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-5 text-sm font-semibold text-brand-foreground shadow-glow-brand transition-all duration-200 hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            {isRedirecting ? 'Mengalihkan...' : 'Memproses...'}
          </>
        ) : (
          <>
            <LogIn
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
            Masuk ke Dashboard
          </>
        )}
      </button>
    </form>
  );
}
