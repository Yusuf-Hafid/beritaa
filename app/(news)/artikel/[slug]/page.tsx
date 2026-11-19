import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Tag, Share2 } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { CategoryBadge } from '@/components/ui/category-badge';
import { ArticleBody } from '@/components/news/article-body';
import { MediaThumbnail } from '@/components/news/article-card';
import { RelatedNews } from '@/components/news/related-news';
import { Sidebar } from '@/components/news/sidebar';
import { articles, getRelatedArticles } from '@/data/articles';
import { getCategory } from '@/data/categories';
import { getArticleBySlug } from '@/lib/get-articles';
import { formatTanggal } from '@/lib/format';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
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

          <h1 className="mt-4 break-words font-serif text-display font-black leading-[1.06] tracking-tight text-foreground text-balance">
            {article.title}
          </h1>
          <p className="mt-4 break-words text-lg leading-relaxed text-muted-foreground max-w-2xl">
            {article.excerpt}
          </p>

          {/* ── Author & meta ── */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-card">
            <p className="break-all text-sm font-bold text-foreground">
              {article.author.name}
            </p>

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
          {article.thumbnailAlt} · Foto: INDONEWS
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
