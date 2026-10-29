import Link from 'next/link';
import { ArticleCard } from '@/components/news/article-card';
import { CategoryBadge } from '@/components/ui/category-badge';
import { formatWaktuRelatif } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Article } from '@/lib/types';

interface HeroStoryProps {
  lead: Article;
  subStories: Article[];
  stripStories: Article[];
  className?: string;
}

export function HeroStory({ lead, subStories, stripStories, className }: HeroStoryProps) {
  return (
    <section className={cn('space-y-8', className)} aria-label="Berita utama">

      {/* ── Hero grid: Lead (large) + Sub-stories (sidebar) ── */}
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">

        {/* Lead story - full overlay card */}
        <div className="animate-rise lg:col-span-7">
          <ArticleCard article={lead} variant="lead" priority headingLevel="h1" />
        </div>

        {/* Latest stories list */}
        <div className="animate-rise lg:col-span-5" style={{ animationDelay: '100ms' }}>
          <div className="h-full rounded-2xl border border-line bg-paper-elevated shadow-card p-5 flex flex-col">
            {/* Section head */}
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center gap-2.5">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-brand"
                  aria-hidden
                >
                  <span className="text-[0.5rem] font-black text-white">▶</span>
                </span>
                <p className="eyebrow text-brand">Terbaru</p>
              </div>
              <span className="text-kicker font-extrabold uppercase text-muted-warm">
                {subStories.length} berita
              </span>
            </div>

            {/* Stories list */}
            <div className="mt-4 flex flex-col gap-0 flex-1 divide-y divide-line-soft">
              {subStories.map((article, index) => (
                <article key={article.id} className="group py-4 first:pt-0 last:pb-0">
                  <Link href={`/artikel/${article.slug}`} className="flex items-start gap-4">
                    {/* Number */}
                    <span
                      className="font-serif text-3xl font-black leading-none text-line transition-colors group-hover:text-brand flex-shrink-0"
                      aria-hidden
                    >
                      0{index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CategoryBadge slug={article.category} asLink={false} />
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
                          {formatWaktuRelatif(article.publishedAt)}
                        </span>
                      </div>
                      <h3 className="mt-1.5 line-clamp-2 font-serif text-base font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* View all */}
            <Link
              href="/"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-line py-2.5 text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-brand hover:text-brand"
            >
              Lihat semua berita terbaru →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Headline strip ── */}
      <div
        className="animate-rise grid rounded-2xl border border-line bg-paper-elevated shadow-card overflow-hidden sm:grid-cols-3"
        style={{ animationDelay: '200ms' }}
      >
        {stripStories.map((article, index) => (
          <article
            key={article.id}
            className={cn(
              'group border-b border-line last:border-b-0 sm:border-b-0',
              index > 0 && 'sm:border-l sm:border-line',
            )}
          >
            <Link href={`/artikel/${article.slug}`} className="block p-5 h-full hover:bg-surface-dim transition-colors">
              <span className="eyebrow text-brand">
                0{index + 1}
              </span>
              <h4 className="mt-2 line-clamp-2 font-serif text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand">
                {article.title}
              </h4>
              <p className="mt-2 line-clamp-2 text-sm text-muted-warm leading-relaxed">
                {article.excerpt}
              </p>
              <p className="mt-3 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
                {formatWaktuRelatif(article.publishedAt)}
              </p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
