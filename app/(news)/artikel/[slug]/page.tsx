import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Tag, Share2, Printer, Bookmark } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { CategoryBadge } from '@/components/ui/category-badge';
import { ArticleBody } from '@/components/news/article-body';
import { RelatedNews } from '@/components/news/related-news';
import { Sidebar } from '@/components/news/sidebar';
import { getArticleBySlug, articles, getRelatedArticles } from '@/data/articles';
import { getCategory } from '@/data/categories';
import { formatTanggal } from '@/lib/format';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
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
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const category = getCategory(article.category);
  const related = getRelatedArticles(article, 4);

  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="border-b border-border bg-muted/40">
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

          <h1 className="mt-4 font-serif text-display font-black leading-[1.06] tracking-tight text-foreground text-balance">
            {article.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground max-w-2xl">
            {article.excerpt}
          </p>

          {/* ── Author & meta ── */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-card">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.author.avatarUrl}
                alt={article.author.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-border"
              />
              <div>
                <p className="text-sm font-bold text-foreground">{article.author.name}</p>
                <p className="text-xs text-muted-foreground">{article.author.role}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[0.6875rem] text-muted-foreground font-bold uppercase tracking-[0.1em]">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand" aria-hidden />
                {formatTanggal(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand" aria-hidden />
                {article.readTime} mnt baca
              </span>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-muted/40"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden />
              Bagikan
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-muted/40"
            >
              <Bookmark className="h-3.5 w-3.5" aria-hidden />
              Simpan
            </button>
            <button
              type="button"
              aria-label="Cetak artikel"
              className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-muted/40"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden />
              Cetak
            </button>
          </div>
        </header>
      </Container>

      {/* ── Hero image ── */}
      <Container size="narrow">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-lift">
          <Image
            src={article.thumbnailUrl}
            alt={article.thumbnailAlt}
            fill
            sizes="(max-width: 768px) 100vw, 820px"
            className="object-cover"
            priority
          />
        </div>
        <p className="mt-2.5 text-xs text-muted-foreground text-center">
          {article.thumbnailAlt} · Foto: INDONEWS
        </p>
      </Container>

      {/* ── Article body + sidebar ── */}
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <ArticleBody content={article.content} />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="mt-10 rounded-xl border border-border bg-card p-5 shadow-card">
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

            {/* Author bio card */}
            <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
              <p className="eyebrow text-muted-foreground mb-3">Tentang Penulis</p>
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-brand/20"
                />
                <div>
                  <p className="font-serif text-lg font-bold text-foreground">{article.author.name}</p>
                  <p className="text-sm text-muted-foreground">{article.author.role} · INDONEWS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </Container>

      {/* ── Related news ── */}
      <RelatedNews articles={related} />
    </>
  );
}
