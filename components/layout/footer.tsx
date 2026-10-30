'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Rss, Mail, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { footerLinkGroups } from '@/data/menu';
import { categories } from '@/data/categories';

const socialLinks = [
  { label: 'Facebook', href: '#', icon: Facebook },
  { label: 'Instagram', href: '#', icon: Instagram },
  { label: 'Twitter / X', href: '#', icon: Twitter },
  { label: 'YouTube', href: '#', icon: Youtube },
  { label: 'RSS', href: '#', icon: Rss },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-background text-foreground" role="contentinfo">
      {/* ── Top accent bar ── */}
      <div
        className="h-1 w-full"
        style={{
          background:
            'linear-gradient(90deg, hsl(var(--brand)) 0%, hsl(var(--accent-color)) 60%, hsl(var(--brand-light)) 100%)',
        }}
        aria-hidden
      />

      <Container>
        {/* ── Main footer grid ── */}
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center"
              aria-label="INDONEWS — Beranda"
            >
              {/* Logo artwork has ~20% black padding on every side; crop it so the mark stays legible */}
              <span className="block h-12 aspect-[5/3] overflow-hidden rounded-md ring-1 ring-border/60 dark:ring-white/20 transition-transform duration-300 group-hover:scale-105 sm:h-14">
                <img
                  src="/Berita-Indonews.svg"
                  alt="Indonews Logo"
                  className="h-full w-full object-cover"
                />
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Portal berita terkini Indonesia yang menyajikan liputan mendalam, akurat, dan terpercaya — dari Sabang sampai Merauke.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border transition-all duration-200 hover:bg-brand hover:text-brand-foreground hover:ring-brand"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </a>
                );
              })}
            </div>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-2">
                Langganan Newsletter
              </p>
              <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
                <div className="relative flex-1">
                  <Mail
                    className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden
                  />
                  <input
                    type="email"
                    placeholder="email@anda.com"
                    aria-label="Alamat email untuk newsletter"
                    className="w-full rounded-full bg-muted py-2.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground ring-1 ring-border outline-none focus:ring-2 focus:ring-brand transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-brand px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-foreground hover:bg-brand-dark transition-colors shadow-sm"
                >
                  Ikut
                </button>
              </form>
            </div>
          </div>

          {/* Link groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand"
                    >
                      {link.label}
                      <ArrowUpRight
                        className="h-2.5 w-2.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Categories column */}
          <div>
            <h3 className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-muted-foreground mb-4">
              Topik
            </h3>
            <ul className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="inline-block rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Legal bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border py-6 text-[0.625rem] text-muted-foreground sm:flex-row">
          <p className="flex flex-wrap items-center gap-1.5">
            <span>&copy; {year}</span>
            <span className="inline-block h-4 aspect-[5/3] overflow-hidden rounded-[3px] ring-1 ring-border/60 dark:ring-white/20">
              <img
                src="/Berita-Indonews.svg"
                alt="INDONEWS"
                className="h-full w-full object-cover"
              />
            </span>
            <span>Media. Hak cipta dilindungi undang-undang.</span>
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-brand">
              Kebijakan Privasi
            </a>
            <a href="#" className="transition-colors hover:text-brand">
              Syarat &amp; Ketentuan
            </a>
            <Link href="/pedoman-media" className="transition-colors hover:text-brand">
              Pedoman Media Siber
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
