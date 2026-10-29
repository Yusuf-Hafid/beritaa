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
    <footer className="mt-20 border-t border-line bg-ink text-paper" role="contentinfo">

      {/* ── Top accent bar ── */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(90deg, hsl(var(--brand)) 0%, hsl(var(--accent-color)) 60%, hsl(var(--brand-light)) 100%)' }}
        aria-hidden
      />

      <Container>
        {/* ── Main footer grid ── */}
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4 lg:grid-cols-5">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-3" aria-label="INDONEWS — Beranda">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand text-white transition-transform duration-300 group-hover:scale-105">
                <span className="font-serif text-base font-black tracking-tighter">IN</span>
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-2xl font-black tracking-[-0.04em]">
                  INDO<span className="text-brand">NEWS</span>
                </span>
                <span className="text-[0.5rem] font-bold uppercase tracking-[0.2em] text-paper/50 mt-0.5">
                  Portal Berita Terkini
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">
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
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-paper/8 text-paper/60 ring-1 ring-paper/10 transition-all duration-200 hover:bg-brand hover:text-white hover:ring-brand"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                  </a>
                );
              })}
            </div>

            {/* Newsletter mini */}
            <div className="mt-6">
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-paper/50 mb-2">
                Langganan Newsletter
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-paper/40" aria-hidden />
                  <input
                    type="email"
                    placeholder="email@anda.com"
                    className="w-full rounded-full bg-paper/8 py-2.5 pl-9 pr-4 text-xs text-paper/80 placeholder:text-paper/30 ring-1 ring-paper/10 outline-none focus:ring-brand transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-full bg-brand px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white hover:bg-brand-dark transition-colors"
                >
                  Ikut
                </button>
              </form>
            </div>
          </div>

          {/* Link groups */}
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-paper/50 mb-4">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-paper/60 transition-colors hover:text-paper"
                    >
                      {link.label}
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Categories column */}
          <div>
            <h3 className="text-[0.625rem] font-extrabold uppercase tracking-[0.18em] text-paper/50 mb-4">
              Topik
            </h3>
            <ul className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/${cat.slug}`}
                    className="inline-block rounded-full border border-paper/10 px-3 py-1 text-xs text-paper/55 transition-colors hover:border-brand hover:text-brand"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Legal bar ── */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-paper/8 py-6 text-[0.625rem] text-paper/40 sm:flex-row">
          <p>
            &copy; {year}{' '}
            <span className="font-bold text-paper/60">INDONEWS</span> Media. Hak cipta dilindungi undang-undang.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-paper/80">Kebijakan Privasi</a>
            <a href="#" className="transition-colors hover:text-paper/80">Syarat &amp; Ketentuan</a>
            <a href="#" className="transition-colors hover:text-paper/80">Pedoman Media Siber</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}