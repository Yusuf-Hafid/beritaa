'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { formatTanggal, formatJam } from '@/lib/format';

const topLinks = [
  { label: 'Langganan', href: '#' },
  { label: 'Newsletter', href: '#' },
  { label: 'Kontak Redaksi', href: '#' },
  { label: 'Tentang Kami', href: '#' },
];

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-line bg-ink text-paper">
      <Container>
        <div className="flex h-8 items-center justify-between text-[0.5625rem] font-bold uppercase tracking-[0.14em]">
          {/* Left: datetime */}
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 sm:flex text-paper/70">
              <CalendarDays className="h-3 w-3 text-brand" aria-hidden />
              {now ? formatTanggal(now) : '\u00A0'}
            </span>
            <span className="flex items-center gap-1.5 text-paper/70">
              <Clock className="h-3 w-3 text-brand" aria-hidden />
              {now ? formatJam(now) : '\u00A0'}
            </span>
          </div>

          {/* Center brand mark (mobile only) */}
          <span className="sm:hidden font-serif text-sm font-black tracking-[-0.03em]">
            INDO<span className="text-brand">NEWS</span>
          </span>

          {/* Right: utility links */}
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Tautan layanan">
            {topLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-paper/60 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </Container>
    </div>
  );
}