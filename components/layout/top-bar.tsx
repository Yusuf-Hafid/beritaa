'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CalendarDays, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { formatTanggal, formatJam } from '@/lib/format';

const topLinks = [
  { label: 'Langganan', href: '/langganan' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Kontak Redaksi', href: '/kontak' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
];

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-border bg-background text-foreground">
      <Container>
        <div className="relative flex h-8 items-center justify-between text-[0.5625rem] font-bold uppercase tracking-[0.14em]">
          {/* Left: datetime */}
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:flex text-muted-foreground">
              <CalendarDays className="h-3 w-3 text-brand" aria-hidden />
              {now ? formatTanggal(now) : '\u00A0'}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3 w-3 text-brand" aria-hidden />
              {now ? formatJam(now) : '\u00A0'}
            </span>
          </div>

          {/* Center brand mark (mobile only) — links home so the logo is
              tappable on phones, where the top bar is the first brand hit area. */}
          <Link
            href="/"
            draggable={false}
            aria-label="INDONEWS — Beranda"
            onClick={() => {
              if (pathname === "/") window.scrollTo({ top: 0 });
            }}
            className="absolute left-1/2 top-1/2 z-10 block h-6 -translate-x-1/2 -translate-y-1/2 aspect-[5/3] cursor-pointer select-none overflow-hidden rounded-[4px] ring-1 ring-border/60 dark:ring-white/20 sm:hidden"
          >
            <img
              src="/Berita-Indonews.svg"
              alt="Indonews Logo"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </Link>

          {/* Right: utility links */}
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Tautan layanan">
            {topLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </div>
  );
}
