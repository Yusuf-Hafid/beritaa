'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { ThemeSwitcher } from '@/components/shared/theme-switcher';
import { SearchBar } from '@/components/shared/search-bar';
import { mainNav } from '@/data/menu';
import { MegaMenuItem } from '@/components/layout/navbar';
import { cn } from '@/lib/utils';
import type { SearchIndexItem } from '@/lib/types';
import { Menu, X, Search } from 'lucide-react';

export function Header({ searchIndex = [] }: { searchIndex?: SearchIndexItem[] }) {
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
          ? 'glass border-b border-border/70 shadow-header'
          : 'border-b border-border bg-background/95 backdrop-blur-sm'
      )}
    >
      {/* Brand accent stripe */}
      <div
        className="h-[3px] w-full"
        style={{
          background:
            'linear-gradient(90deg, hsl(var(--brand)) 0%, hsl(var(--accent-color)) 60%, hsl(var(--brand-light)) 100%)',
        }}
        aria-hidden
      />

      <Container>
        <div className="flex min-w-0 items-center justify-between gap-3 py-3 xl:gap-4">
          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex flex-shrink-0 items-center"
            aria-label="INDONEWS — Beranda"
          >
            {/* Logo artwork has ~20% black padding on every side; crop it so the mark stays legible */}
            <span className="block h-9 aspect-[5/3] overflow-hidden rounded-md ring-1 ring-border/60 dark:ring-white/20 transition-transform duration-300 group-hover:scale-105 sm:h-10">
              <img
                src="/Berita-Indonews.svg"
                alt="Indonews Logo"
                className="h-full w-full object-cover"
              />
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
            aria-label="Navigasi kategori"
          >
            {mainNav.slice(1).map((item, index) => (
              <div
                key={item.href}
                className="relative shrink-0"
                onMouseEnter={() => setActiveMega(item.href)}
                onMouseLeave={() => setActiveMega(null)}
                onFocus={() => setActiveMega(item.href)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setActiveMega(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setActiveMega(null);
                }}
              >
                <Link
                  href={item.href}
                  aria-expanded={activeMega === item.href}
                  aria-controls={`mega-${item.href.replace('/', '')}`}
                  className={cn(
                    'relative block whitespace-nowrap rounded-md px-2.5 py-2 text-[0.6875rem] font-extrabold uppercase tracking-[0.05em] text-muted-foreground transition-colors hover:text-brand',
                    activeMega === item.href && 'text-brand'
                  )}
                >
                  {item.label}
                  {activeMega === item.href && (
                    <span
                      className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-brand rounded-full"
                      aria-hidden
                    />
                  )}
                </Link>

                {activeMega === item.href && (
                  <div
                    className={cn(
                      'absolute top-full z-20 pt-2',
                      index >= 4 ? 'right-0' : 'left-0'
                    )}
                  >
                    <div
                      id={`mega-${item.href.replace('/', '')}`}
                      className="w-[480px] max-w-[calc(100vw_-_2rem)] rounded-xl border border-border bg-card p-5 shadow-lift animate-slide-up"
                    >
                      {item.megaMenu && (
                        <MegaMenuItem
                          slug={item.href.replace('/', '')}
                          name={item.megaMenu.title}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Search toggle mobile */}
            <button
              type="button"
              aria-label={searchOpen ? 'Tutup pencarian' : 'Buka pencarian'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-brand sm:hidden lg:flex xl:hidden"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            {/* Search desktop */}
            <div className="hidden w-44 shrink-0 sm:block lg:hidden xl:block xl:w-40">
              <SearchBar items={searchIndex} compact={false} />
            </div>

            <ThemeSwitcher />

            {/* Subscribe CTA */}
            <Link
              href="/langganan"
              className="hidden whitespace-nowrap xl:inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-brand-dark hover:shadow-glow-brand"
            >
              Langganan
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-brand lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="pb-3 sm:hidden lg:block xl:hidden animate-slide-up">
            <SearchBar items={searchIndex} autoFocus />
          </div>
        )}
      </Container>

      {/* ── Mobile menu drawer ── */}
      {mobileOpen && (
        <div className="glass border-t border-border lg:hidden animate-slide-up">
          <Container>
            <nav aria-label="Navigasi mobile" className="py-4">
              <ul className="grid grid-cols-3 gap-1 sm:grid-cols-4">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center rounded-lg px-3 py-2.5 text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:bg-muted hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-border pt-4 flex gap-2">
                <Link
                  href="/langganan"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full bg-brand py-2.5 text-center text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-white hover:bg-brand-dark transition-colors"
                >
                  Langganan
                </Link>
                <Link
                  href="/newsletter"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 rounded-full border border-border py-2.5 text-center text-[0.6875rem] font-extrabold uppercase tracking-[0.1em] text-foreground hover:bg-muted transition-colors"
                >
                  Newsletter
                </Link>
              </div>
            </nav>
          </Container>
        </div>
      )}

      {/* ── Mobile category scrollbar (when menu closed) ── */}
      {!mobileOpen && (
        <div className="border-t border-border/60 lg:hidden">
          <Container>
            <ul
              className="scrollbar-hide flex items-center gap-0.5 overflow-x-auto py-1"
              aria-label="Navigasi kategori mobile"
            >
              {mainNav.map((item) => (
                <li key={item.href} className="flex-shrink-0">
                  <Link
                    href={item.href}
                    className="block whitespace-nowrap px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-brand"
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
