import Link from 'next/link';
import Image from 'next/image';
import { Flame, BookmarkPlus, TrendingUp } from 'lucide-react';
import { NewsletterForm } from '@/components/shared/newsletter-form';
import { getPopularArticles, getArticlesByCategory } from '@/data/articles';
import { categories } from '@/data/categories';
import { formatWaktuRelatif } from '@/lib/format';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const popular = getPopularArticles(5);
  const rekomendasi = categories
    .flatMap((c) => getArticlesByCategory(c.slug))
    .filter((a) => !a.isBreaking)
    .slice(0, 3);

  return (
    <aside className={cn('space-y-8', className)} aria-label="Sidebar">
      {/* ── Terpopuler ── */}
      <section
        aria-labelledby="terpopuler-title"
        className="rounded-2xl border border-border bg-card shadow-card overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 bg-neutral-900 px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand" aria-hidden />
            <span className="eyebrow text-white">Terpopuler</span>
          </div>
          <span className="eyebrow text-white/50">Paling dibaca</span>
        </div>

        <ol className="divide-y divide-border/60 px-5">
          {popular.map((article, index) => (
            <li key={article.id} className="group">
              <Link
                href={`/artikel/${article.slug}`}
                className="grid grid-cols-[2rem_1fr] gap-3 py-3.5"
              >
                <span
                  className={cn(
                    'font-serif text-3xl font-black leading-none transition-colors group-hover:text-brand',
                    index === 0 ? 'text-brand' : 'text-muted-foreground/30'
                  )}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-serif text-[0.9375rem] font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    <Flame className="h-2.5 w-2.5 text-breaking" aria-hidden />
                    {formatWaktuRelatif(article.publishedAt)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Rekomendasi ── */}
      <section
        aria-labelledby="rekomendasi-title"
        className="rounded-2xl border border-border bg-card shadow-card overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 bg-teal px-5 py-3 text-white">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="h-4 w-4 text-white/80" aria-hidden />
            <span className="eyebrow text-white">Rekomendasi</span>
          </div>
          <span className="eyebrow text-white/50">Pilihan redaksi</span>
        </div>

        <div className="divide-y divide-border/60 px-5">
          {rekomendasi.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group grid grid-cols-[4.5rem_1fr] gap-3 py-3.5"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted flex-shrink-0 shadow-sm">
                <Image
                  src={article.thumbnailUrl}
                  alt={article.thumbnailAlt}
                  fill
                  sizes="72px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-serif text-[0.9rem] font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  {article.author.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section
        className="rounded-2xl overflow-hidden shadow-card"
        aria-labelledby="newsletter-sidebar-title"
        style={{
          background:
            'linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(220 85% 35%) 100%)',
        }}
      >
        <div className="p-5 text-white">
          <p className="eyebrow text-white/70">Newsletter</p>
          <h2
            id="newsletter-sidebar-title"
            className="mt-2 font-serif text-xl font-black leading-tight text-white"
          >
            Berita di kotak masuk Anda
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            Dapatkan ringkasan berita terpenting setiap pagi dari INDONEWS.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ── Topik populer ── */}
      <section aria-labelledby="topik-title">
        <h3 id="topik-title" className="eyebrow text-muted-foreground mb-3">
          Topik Populer
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-foreground transition-all hover:border-brand hover:text-brand hover:bg-muted/40"
            >
              <span
                className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
                aria-hidden
              />
              {cat.name}
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}
