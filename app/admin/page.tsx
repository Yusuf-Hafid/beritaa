import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Newspaper } from 'lucide-react';
import { LoginForm } from '@/app/admin/login-form';

export const metadata: Metadata = {
  title: 'Login Admin',
  description: 'Masuk ke panel administrasi INDONEWS.',
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-muted/40 px-4 py-16 sm:px-6">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-brand/10 hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none dark:hover:bg-transparent dark:hover:text-brand-light sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Kembali ke Beranda
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-glow-brand">
            <Newspaper className="h-5 w-5" aria-hidden />
          </span>
          <span className="mt-3 font-serif text-xl font-black tracking-tight">
            INDONEWS
          </span>
        </div>

        <h1 className="mt-6 text-center font-serif text-2xl font-semibold tracking-tight">
          Login Admin
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}
