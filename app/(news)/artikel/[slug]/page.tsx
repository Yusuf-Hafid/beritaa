import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Clock, Tag } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { CategoryBadge } from '@/components/ui/category-badge';
import { ArticleBody } from '@/components/news/article-body';
import { PrintButton } from '@/components/news/print-button';
import { MediaThumbnail } from '@/components/news/article-card';
import { RelatedNews } from '@/components/news/related-news';
import { Sidebar } from '@/components/news/sidebar';
import { getCategory } from '@/data/categories';
import { getArticleBySlug, getRelatedArticles } from '@/lib/get-articles';
import { formatTanggal } from '@/lib/format';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.thumbnailUrl }],
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const related = await getRelatedArticles(article, 4);

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="border-b border-border bg-muted/40" data-print="hide">
        <Container>
          <Breadcrumb
            items={[
              { label: category?.name ?? 'Kategori', href: `/${article.category}` },
              { label: article.title.length > 55 ? article.title.slice(0, 55) + '…' : article.title },
            ]}
          />
        </Container>
      </div>

      {/* ── Article header ── */}
      <Container size="narrow">
        <header className="animate-rise py-10">
          <CategoryBadge slug={article.category} />

          <h1 className="mt-4 break-words font-serif text-display font-black leading-[1.06] tracking-tight text-foreground text-balance">
            {article.title}
          </h1>
          <p className="mt-4 break-words text-lg leading-relaxed text-muted-foreground max-w-2xl">
            {article.excerpt}
          </p>

          {/* ── Author & meta ──
              Byline hanya untuk artikel redaksi. Berita dari penerbit luar tidak
              punya byline, jadi grup meta memakai flex-1 + justify-between supaya
              tanggal rata kiri dan estimasi baca rata kanan, mengisi lebar kotak. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-border bg-card px-4 py-3.5 shadow-card sm:px-5">
            {!article.sourceName && (
              <p className="min-w-0 break-words text-sm font-bold leading-snug text-foreground">
                {article.author.name}
              </p>
            )}

            <div
              className="flex flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                <span className="sr-only">Terbit: </span>
                {formatTanggal(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0 text-brand" aria-hidden />
                {article.readTime} mnt baca
              </span>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="mt-4 flex items-center gap-2 flex-wrap" data-print="hide">
            <PrintButton />
          </div>
        </header>
      </Container>

      {/* ── Hero image ── */}
      <Container size="narrow">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-lift">
          <MediaThumbnail
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            sizes="(max-width: 768px) 100vw, 820px"
            className="object-cover"
            priority
          />
        </div>
        <p className="mt-2.5 text-xs text-muted-foreground text-center">
          {article.thumbnailAlt}
        </p>
      </Container>

      {/* ── Article body + sidebar ── */}
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="min-w-0 lg:col-span-2">
            <ArticleBody content={article.content} />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-card" data-print="hide">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" aria-hidden />
                    Tag:
                  </span>
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      href="#"
                      className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-muted/40"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1" data-print="hide">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </Container>

      {/* ── Related news ── */}
      <div data-print="hide">
        <RelatedNews articles={related} />
      </div>
    </>
  );
}
