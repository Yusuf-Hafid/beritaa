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
      return (
        <LeadCard
          article={article}
          priority={priority}
          headingLevel={headingLevel}
          className={className}
        />
      );
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

function MetaInfo({
  article,
  showReadTime = false,
  light = false,
}: {
  article: Article;
  showReadTime?: boolean;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.625rem] font-bold uppercase tracking-[0.12em]',
        light ? 'text-white/90' : 'text-muted-foreground'
      )}
    >
      <span>{article.author.name}</span>
      <span aria-hidden className={light ? 'text-white/60' : 'text-border'}>
        ·
      </span>
      <span>{formatWaktuRelatif(article.publishedAt)}</span>
      {showReadTime && (
        <>
          <span aria-hidden className={light ? 'text-white/60' : 'text-border'}>
            ·
          </span>
          <span>{article.readTime} mnt baca</span>
        </>
      )}
    </div>
  );
}

function BreakingBadge() {
  return (
    <span className="badge-breaking absolute left-3 top-3 z-20 shadow-md">
      <span
        className="h-1.5 w-1.5 rounded-full bg-white animate-dot-pulse"
        aria-hidden
      />
      Breaking
    </span>
  );
}

/* ── Default card ── */
function DefaultCard({
  article,
  priority,
  className,
}: {
  article: Article;
  priority: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'card-lift group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-card hover:shadow-lift transition-all duration-300',
        className
      )}
    >
      <Link href={`/artikel/${article.slug}`} className="flex h-full flex-col">
        <div className="card-media relative aspect-[16/10] overflow-hidden rounded-lg bg-muted shadow-sm">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
            priority={priority}
          />
          {article.isBreaking && <BreakingBadge />}
          <div
            className="absolute inset-0 bg-brand/0 transition-colors duration-300 group-hover:bg-brand/5 pointer-events-none"
            aria-hidden
          />
        </div>

        <div className="mt-3.5 flex flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={article.category} asLink={false} />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {formatWaktuRelatif(article.publishedAt)}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-2 font-serif text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground flex-1">
            {article.excerpt}
          </p>

          <div className="mt-auto pt-3 border-t border-border/60">
            <MetaInfo article={article} />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Lead card (hero) ── */
function LeadCard({
  article,
  priority,
  headingLevel,
  className,
}: {
  article: Article;
  priority: boolean;
  headingLevel: 'h1' | 'h2';
  className?: string;
}) {
  const Heading = headingLevel;

  return (
    <article
      className={cn(
        'card-lift group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lift',
        className
      )}
    >
      <Link href={`/artikel/${article.slug}`} className="block">
        <div className="card-media relative aspect-[16/10] overflow-hidden bg-neutral-900 sm:aspect-[16/9]">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
            priority={priority}
          />
          {article.isBreaking && <BreakingBadge />}

          {/* Full overlay with solid contrast fallback for white text */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/25 pointer-events-none"
            aria-hidden
          />

          {/* Overlay content for large screens */}
          <div className="absolute bottom-0 left-0 right-0 p-6 hidden md:block z-10">
            <div className="flex flex-wrap items-center gap-3">
              <CategoryBadge slug={article.category} asLink={false} />
              <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-white/90">
                {formatWaktuRelatif(article.publishedAt)}
              </span>
            </div>
            <Heading className="mt-2 font-serif text-display font-black leading-[1.04] tracking-tight text-white text-balance transition-colors group-hover:text-brand-light">
              {article.title}
            </Heading>
            <p className="mt-2 line-clamp-2 max-w-2xl text-base leading-relaxed text-white">
              {article.excerpt}
            </p>
            <div className="mt-3">
              <MetaInfo article={article} showReadTime light />
            </div>
          </div>
        </div>

        {/* Mobile card content below image */}
        <div className="p-4 md:hidden bg-card">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={article.category} asLink={false} />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {formatWaktuRelatif(article.publishedAt)}
            </span>
          </div>
          <Heading className="mt-2 font-serif text-display-sm font-black leading-tight text-foreground transition-colors group-hover:text-brand">
            {article.title}
          </Heading>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
function CompactCard({
  article,
  rank,
  className,
}: {
  article: Article;
  rank?: number;
  className?: string;
}) {
  return (
    <article className={cn('group', className)}>
      <Link
        href={`/artikel/${article.slug}`}
        className={cn(
          'flex items-start gap-3 rounded-lg p-1.5 transition-colors hover:bg-muted/50',
          rank ? 'grid grid-cols-[2rem_5rem_1fr]' : 'grid grid-cols-[5.25rem_1fr]'
        )}
      >
        {rank && (
          <span
            className="font-serif text-2xl font-black leading-none text-muted-foreground/50 transition-colors group-hover:text-brand"
            aria-hidden
          >
            {String(rank).padStart(2, '0')}
          </span>
        )}
        <div className="card-media relative aspect-[4/3] overflow-hidden rounded-md bg-muted flex-shrink-0 shadow-sm">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="84px"
            className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
          />
        </div>
        <div className="min-w-0">
          <h4 className="line-clamp-2 font-serif text-[0.9375rem] font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
            {article.title}
          </h4>
          <p className="mt-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {formatWaktuRelatif(article.publishedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}

/* ── Horizontal card ── */
function HorizontalCard({
  article,
  className,
}: {
  article: Article;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'card-lift group overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-lift',
        className
      )}
    >
      <Link href={`/artikel/${article.slug}`} className="flex h-full flex-col sm:flex-row">
        <div className="card-media relative aspect-[16/10] w-full overflow-hidden bg-muted sm:aspect-auto sm:w-[42%] flex-shrink-0">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 640px) 100vw, 360px"
            className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-105"
          />
          {article.isBreaking && <BreakingBadge />}
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={article.category} asLink={false} />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {formatWaktuRelatif(article.publishedAt)}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-3 font-serif text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-brand sm:text-2xl">
            {article.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground flex-1">
            {article.excerpt}
          </p>

          <div className="mt-auto pt-4 border-t border-border/60">
            <MetaInfo article={article} showReadTime />
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Featured card (overlay style) ── */
function FeaturedCard({
  article,
  priority,
  className,
}: {
  article: Article;
  priority: boolean;
  className?: string;
}) {
  return (
    <article
      className={cn(
        'card-lift group relative overflow-hidden rounded-xl border border-border shadow-lift bg-neutral-900',
        className
      )}
    >
      <Link href={`/artikel/${article.slug}`} className="block">
        <div className="card-media relative aspect-[4/5] overflow-hidden bg-neutral-900 sm:aspect-[3/4]">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 640px) 50vw, 300px"
            className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
            priority={priority}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none"
            aria-hidden
          />
          {article.isBreaking && <BreakingBadge />}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <CategoryBadge slug={article.category} asLink={false} />
          <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-white line-clamp-3 transition-colors group-hover:text-brand-light">
            {article.title}
          </h3>
          <p className="mt-2 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-white/70">
            {formatWaktuRelatif(article.publishedAt)}
          </p>
        </div>
      </Link>
    </article>
  );
}
