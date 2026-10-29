import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CategoryBadge } from '@/components/ui/category-badge';
import { formatWaktuRelatif } from '@/lib/format';
import type { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  variant?: 'lead' | 'default' | 'compact' | 'horizontal' | 'featured';
  className?: string;
  priority?: boolean;
  headingLevel?: 'h1' | 'h2';
  rank?: number;
}

export function ArticleCard({
  article,
  variant = 'default',
  className,
  priority = false,
  headingLevel = 'h2',
  rank,
}: ArticleCardProps) {
  switch (variant) {
    case 'lead':
      return <LeadCard article={article} priority={priority} headingLevel={headingLevel} className={className} />;
    case 'compact':
      return <CompactCard article={article} rank={rank} className={className} />;
    case 'horizontal':
      return <HorizontalCard article={article} className={className} />;
    case 'featured':
      return <FeaturedCard article={article} priority={priority} className={className} />;
    default:
      return <DefaultCard article={article} priority={priority} className={className} />;
  }
}

function MetaInfo({ article, showReadTime = false }: { article: Article; showReadTime?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
      <span>{article.author.name}</span>
      <span aria-hidden className="text-line">·</span>
      <span>{formatWaktuRelatif(article.publishedAt)}</span>
      {showReadTime && (
        <>
          <span aria-hidden className="text-line">·</span>
          <span>{article.readTime} mnt baca</span>
        </>
      )}
    </div>
  );
}

function BreakingBadge() {
  return (
    <span className="badge-breaking absolute left-3 top-3 z-10">
      <span className="h-1.5 w-1.5 rounded-full bg-white animate-dot-pulse" aria-hidden />
      Breaking
    </span>
  );
}

/* ── Default card ── */
function DefaultCard({ article, priority, className }: { article: Article; priority: boolean; className?: string }) {
  return (
    <article className={cn('card-lift group flex h-full flex-col', className)}>
      <Link href={`/artikel/${article.slug}`} className="flex h-full flex-col">
        <div className="card-media relative aspect-[16/10] overflow-hidden rounded-xl bg-line-soft shadow-card">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
          {article.isBreaking && <BreakingBadge />}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-brand/0 transition-all duration-500 group-hover:bg-brand/8" aria-hidden />
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={article.category} asLink={false} />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
              {formatWaktuRelatif(article.publishedAt)}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-warm flex-1">
            {article.excerpt}
          </p>

          <div className="mt-auto pt-3 border-t border-line-soft mt-3">
            <MetaInfo article={article} />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Lead card (hero) ── */
function LeadCard({ article, priority, headingLevel, className }: { article: Article; priority: boolean; headingLevel: 'h1' | 'h2'; className?: string }) {
  const Heading = headingLevel;

  return (
    <article className={cn('group', className)}>
      <Link href={`/artikel/${article.slug}`} className="block">
        <div className="card-media relative aspect-[16/10] overflow-hidden rounded-2xl bg-line-soft shadow-lift sm:aspect-[16/9]">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover"
            priority={priority}
          />
          {article.isBreaking && <BreakingBadge />}
          {/* Bottom overlay gradient */}
          <div className="absolute inset-0 bg-hero-overlay opacity-70" aria-hidden />

          {/* Overlay content for large screens */}
          <div className="absolute bottom-0 left-0 right-0 p-6 hidden md:block">
            <div className="flex flex-wrap items-center gap-3">
              <CategoryBadge slug={article.category} asLink={false} />
              <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-white/70">
                {formatWaktuRelatif(article.publishedAt)}
              </span>
            </div>
            <Heading className="mt-2 font-serif text-display font-black leading-[1.04] tracking-tight text-white text-balance transition-colors group-hover:text-brand-light">
              {article.title}
            </Heading>
            <p className="mt-2 line-clamp-2 text-base text-white/70 max-w-2xl">
              {article.excerpt}
            </p>
            <div className="mt-3">
              <MetaInfo article={article} showReadTime />
            </div>
          </div>
        </div>

        {/* Mobile card content below image */}
        <div className="mt-4 md:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={article.category} asLink={false} />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
              {formatWaktuRelatif(article.publishedAt)}
            </span>
          </div>
          <Heading className="mt-2 font-serif text-display-sm font-black leading-tight text-ink transition-colors group-hover:text-brand">
            {article.title}
          </Heading>
          <p className="mt-2 text-base leading-relaxed text-muted-warm">
            {article.excerpt}
          </p>
          <div className="mt-3">
            <MetaInfo article={article} showReadTime />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Compact card ── */
function CompactCard({ article, rank, className }: { article: Article; rank?: number; className?: string }) {
  return (
    <article className={cn('group', className)}>
      <Link
        href={`/artikel/${article.slug}`}
        className={cn(
          'flex items-start gap-3',
          rank ? 'grid grid-cols-[2rem_5rem_1fr]' : 'grid grid-cols-[5rem_1fr]'
        )}
      >
        {rank && (
          <span className="font-serif text-2xl font-black leading-none text-line/60 transition-colors group-hover:text-brand" aria-hidden>
            {String(rank).padStart(2, '0')}
          </span>
        )}
        <div className="card-media relative aspect-[4/3] overflow-hidden rounded-lg bg-line-soft flex-shrink-0">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="84px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h4 className="line-clamp-2 font-serif text-[0.9375rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
            {article.title}
          </h4>
          <p className="mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
            {formatWaktuRelatif(article.publishedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}

/* ── Horizontal card ── */
function HorizontalCard({ article, className }: { article: Article; className?: string }) {
  return (
    <article className={cn('group overflow-hidden rounded-xl border border-line bg-paper-elevated shadow-card transition-shadow hover:shadow-card-hover', className)}>
      <Link href={`/artikel/${article.slug}`} className="flex h-full flex-col sm:flex-row">
        <div className="card-media relative aspect-[16/10] w-full overflow-hidden bg-line-soft sm:aspect-auto sm:w-[42%] flex-shrink-0">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover"
          />
          {article.isBreaking && <BreakingBadge />}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={article.category} asLink={false} />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
              {formatWaktuRelatif(article.publishedAt)}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-3 font-serif text-xl font-bold leading-snug text-ink transition-colors group-hover:text-brand sm:text-2xl">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-warm flex-1">
            {article.excerpt}
          </p>

          <div className="mt-auto pt-4 border-t border-line-soft">
            <MetaInfo article={article} showReadTime />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Featured card (overlay style) ── */
function FeaturedCard({ article, priority, className }: { article: Article; priority: boolean; className?: string }) {
  return (
    <article className={cn('group relative overflow-hidden rounded-xl shadow-lift', className)}>
      <Link href={`/artikel/${article.slug}`} className="block">
        <div className="card-media relative aspect-[4/5] overflow-hidden bg-line-soft sm:aspect-[3/4]">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" aria-hidden />
          {article.isBreaking && <BreakingBadge />}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <CategoryBadge slug={article.category} asLink={false} />
          <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-white line-clamp-3 transition-colors group-hover:text-brand-light">
            {article.title}
          </h3>
          <p className="mt-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-white/60">
            {formatWaktuRelatif(article.publishedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}
