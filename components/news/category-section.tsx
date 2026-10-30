import Link from 'next/link';
import { ArrowUpRight, Hash } from 'lucide-react';
import { ArticleCard } from '@/components/news/article-card';
import { getCategory, categories } from '@/data/categories';
import { getArticlesByCategory } from '@/data/articles';
import { cn } from '@/lib/utils';
import type { CategorySlug } from '@/lib/types';

interface CategorySectionProps {
  categorySlug: CategorySlug;
  index?: number;
  className?: string;
}

export function CategorySection({
  categorySlug,
  index = 0,
  className,
}: CategorySectionProps) {
  const category = getCategory(categorySlug);
  if (!category) return null;

  const sectionArticles = getArticlesByCategory(categorySlug);
  if (sectionArticles.length === 0) return null;

  const [lead, ...rest] = sectionArticles;
  const sideArticles = rest.slice(0, 4);
  const hasSide = sideArticles.length > 0;
  const titleId = `category-${category.slug}-title`;

  return (
    <section className={cn('py-12', className)} aria-labelledby={titleId}>
      {/* ── Section header ── */}
      <div className="section-divider pb-4">
        <div className="flex items-end justify-between gap-4 pt-4">
          <div className="flex items-center gap-3">
            {/* Color indicator */}
            <span
              className="flex h-9 w-9 items-center justify-center rounded-lg shadow-sm"
              style={{ backgroundColor: `${category.color}18` }}
              aria-hidden
            >
              <Hash
                className="h-4.5 w-4.5"
                style={{ color: category.color }}
                aria-hidden
              />
            </span>
            <div>
              <p className="eyebrow" style={{ color: category.color }}>
                Kategori
              </p>
              <h2
                id={titleId}
                className="mt-0.5 font-serif text-h2 font-black tracking-tight text-foreground"
              >
                {category.name}
              </h2>
            </div>
          </div>

          <Link
            href={`/${category.slug}`}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-4 py-2 text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-foreground transition-all hover:border-brand hover:text-brand hover:bg-muted/40"
          >
            Lihat semua
            <ArrowUpRight
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>

      {/* ── Article grid ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Lead horizontal card */}
        <div className="lg:col-span-2">
          <ArticleCard article={lead} variant="horizontal" />
        </div>

        {/* Side compact list */}
        {hasSide && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-card">
            <p className="eyebrow text-muted-foreground mb-3">
              Lainnya di {category.name}
            </p>
            <div className="divide-y divide-border/60">
              {sideArticles.map((article) => (
                <div key={article.id} className="py-2.5 first:pt-0 last:pb-0">
                  <ArticleCard article={article} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function FeaturedCategories() {
  const featuredSlugs = categories
    .slice(0, 4)
    .map((c) => c.slug) as CategorySlug[];

  return (
    <div className="divide-y divide-border">
      {featuredSlugs.map((slug, index) => (
        <CategorySection key={slug} categorySlug={slug} index={index} />
      ))}
    </div>
  );
}
