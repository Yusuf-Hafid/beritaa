import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Newspaper } from 'lucide-react';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';
import { DashboardTabs } from '@/components/admin/dashboard-tabs';
import { LogoutButton } from './logout-button';

export const metadata: Metadata = {
  title: {
    default: 'Dashboard Admin',
    template: '%s | INDONEWS Admin',
  },
  description: 'Kelola dan terbitkan berita INDONEWS.',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  if (!session) {
    redirect('/admin');
  }

  const displayName = session.username
    ? session.username.charAt(0).toUpperCase() + session.username.slice(1)
    : 'Admin';

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#dashboard-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-card focus:ring-2 focus:ring-brand"
      >
        Lewati ke konten
      </a>

      <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-glow-brand">
              <Newspaper className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                INDONEWS
              </p>
              <p className="font-serif text-lg font-semibold leading-tight">
                Ruang Redaksi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground">
                Masuk sebagai
              </p>
              <p className="text-sm font-semibold">{displayName}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="border-b border-border/80 bg-background/70">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
          <DashboardTabs />
        </div>
      </div>

      <main
        id="dashboard-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12"
      >
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:hidden">
          {displayName}
        </p>

        {children}
      </main>
    </div>
  );
}
