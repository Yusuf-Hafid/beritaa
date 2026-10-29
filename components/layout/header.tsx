'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { SearchBar } from '@/components/shared/search-bar';
import { mainNav } from '@/data/menu';
import { MegaMenuItem } from '@/components/layout/navbar';
import { cn } from '@/lib/utils';
import { Menu, X, Search } from 'lucide-react';

export function Header() {
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-line/60 shadow-header'
          : 'border-b border-line bg-paper/98'
      )}
    >
      {/* Brand accent stripe */}
      <div
        className="h-[3px] w-full"
        style={{ background: 'linear-gradient(90deg, hsl(var(--brand)) 0%, hsl(var(--accent-color)) 60%, hsl(var(--brand-light)) 100%)' }}
        aria-hidden
      />

      <Container>
        <div className="flex items-center justify-between gap-4 py-3">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 flex-shrink-0"
            aria-label="INDONEWS — Beranda"
          >
            {/* Icon block */}
            <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-brand shadow-glow-brand transition-transform duration-300 group-hover:scale-105">
              <span className="font-serif text-xl font-black text-white tracking-tighter select-none">IN</span>
            </span>
            {/* Wordmark */}
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-serif text-xl font-black tracking-[-0.04em] text-ink">
                INDO<span className="text-brand">NEWS</span>
              </span>
              <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-muted-warm">
                Portal Berita Terkini
              </span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navigasi kategori">
            {mainNav.slice(1).map((item, index) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setActiveMega(item.href)}
                onMouseLeave={() => setActiveMega(null)}
                onFocus={() => setActiveMega(item.href)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setActiveMega(null);
                  }
                }}
                onKeyDown={(e) => { if (e.key === 'Escape') setActiveMega(null); }}
              >
                <Link
                  href={item.href}
                  aria-expanded={activeMega === item.href}
                  aria-controls={`mega-${item.href.replace('/', '')}`}
                  className={cn(
                    'relative block rounded-md px-3 py-2 text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:text-brand',
                    activeMega === item.href && 'text-brand'
                  )}
                >
                  {item.label}
                  {activeMega === item.href && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" aria-hidden />
                  )}
                </Link>

                {activeMega === item.href && (
                  <div
                    className={cn('absolute top-full z-20 pt-2', index >= 5 ? 'right-0' : 'left-0')}
                  >
                    <div
                      id={`mega-${item.href.replace('/', '')}`}
                      className="w-[480px] rounded-xl border border-line bg-paper-elevated p-5 shadow-lift animate-slide-up"
                    >
                      {item.megaMenu && (
                        <MegaMenuItem slug={item.href.replace('/', '')} name={item.megaMenu.title} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5">
            {/* Search toggle mobile */}
            <button
              type="button"
              aria-label={searchOpen ? 'Tutup pencarian' : 'Buka pencarian'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-line-soft hover:text-brand lg:hidden"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {/* Search desktop */}
            <div className="hidden sm:block w-44 lg:hidden xl:block xl:w-52">
              <SearchBar compact={false} />
            </div>

            <ThemeSwitcher />

            {/* Subscribe CTA */}
            <a
              href="#"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-brand-dark hover:shadow-glow-brand"
            >
              Langganan
            </a>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-line-soft hover:text-brand lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="pb-3 lg:hidden animate-slide-up">
            <SearchBar autoFocus />
          </div>
        )}
      </Container>

      {/* ── Mobile menu drawer ── */}
      {mobileOpen && (
        <div className="glass border-t border-line lg:hidden animate-slide-up">
          <Container>
            <nav aria-label="Navigasi mobile" className="py-4">
              <ul className="grid grid-cols-3 gap-1 sm:grid-cols-4">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-lg px-3 py-2.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink-soft transition-colors hover:bg-line-soft hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-line pt-4 flex gap-2">
                <a href="#" className="flex-1 rounded-full bg-brand py-2.5 text-center text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-brand-dark">
                  Langganan
                </a>
                <a href="#" className="flex-1 rounded-full border border-line py-2.5 text-center text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-ink-soft hover:bg-line-soft">
                  Newsletter
                </a>
              </div>
            </nav>
          </Container>
        </div>
      )}

      {/* ── Mobile category scrollbar (when menu closed) ── */}
      {!mobileOpen && (
        <div className="border-t border-line-soft lg:hidden">
          <Container>
            <ul
              className="scrollbar-hide flex items-center gap-0.5 overflow-x-auto py-1"
              aria-label="Navigasi kategori mobile"
            >
              {mainNav.map((item) => (
                <li key={item.href} className="flex-shrink-0">
                  <Link
                    href={item.href}
                    className="block whitespace-nowrap px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-ink-soft transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
