import Link from 'next/link';
import Image from 'next/image';
import { Flame, BookmarkPlus, TrendingUp } from 'lucide-react';
import { SectionTitle } from '@/components/ui/section-title';
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
        className="rounded-2xl border border-line bg-paper-elevated shadow-card overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 bg-ink px-5 py-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand" aria-hidden />
            <span className="eyebrow text-paper">Terpopuler</span>
          </div>
          <span className="eyebrow text-paper/40">Paling dibaca</span>
        </div>

        <ol className="divide-y divide-line-soft px-5">
          {popular.map((article, index) => (
            <li key={article.id} className="group">
              <Link
                href={`/artikel/${article.slug}`}
                className="grid grid-cols-[2rem_1fr] gap-3 py-4"
              >
                <span
                  className="font-serif text-3xl font-black leading-none transition-colors group-hover:text-brand"
                  style={{ color: index === 0 ? 'hsl(var(--brand))' : 'hsl(var(--line))' }}
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 font-serif text-[0.9375rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
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
        className="rounded-2xl border border-line bg-paper-elevated shadow-card overflow-hidden"
      >
        <div className="flex items-center justify-between gap-2 bg-teal px-5 py-3">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="h-4 w-4 text-white/70" aria-hidden />
            <span className="eyebrow text-white">Rekomendasi</span>
          </div>
          <span className="eyebrow text-white/40">Pilihan redaksi</span>
        </div>

        <div className="divide-y divide-line-soft px-5">
          {rekomendasi.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group grid grid-cols-[4.5rem_1fr] gap-3 py-4"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-line-soft flex-shrink-0">
                <Image
                  src={article.thumbnailUrl}
                  alt={article.thumbnailAlt}
                  fill
                  sizes="72px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-serif text-[0.9rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
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
          background: 'linear-gradient(135deg, hsl(var(--brand)) 0%, hsl(220 85% 35%) 100%)',
        }}
      >
        <div className="p-5 text-white">
          <p className="eyebrow text-white/60">Newsletter</p>
          <h2
            id="newsletter-sidebar-title"
            className="mt-2 font-serif text-xl font-black leading-tight"
          >
            Berita di kotak masuk Anda
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Dapatkan ringkasan berita terpenting setiap pagi dari INDONEWS.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ── Topik populer ── */}
      <section aria-labelledby="topik-title">
        <h3 id="topik-title" className="eyebrow text-muted-warm mb-3">Topik Populer</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-ink-soft transition-all hover:border-brand hover:text-brand"
              style={{ '--cat-color': cat.color } as React.CSSProperties}
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
