import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Link2, Tag } from 'lucide-react';
import { categories } from '@/data/categories';
import { createAdminClient } from '@/utils/supabase/server';
import { ArticleForm, type ArticleFormValues } from '../../article-form';
import { serializeContent } from '../../article-content';
import { formatArticleDate } from '../../article-date';

export const metadata: Metadata = {
  title: 'Edit Berita',
};

interface EditArticle {
  id: string;
  title: string;
  excerpt: string | null;
  content: unknown;
  category: string;
  author_name: string | null;
  thumbnail_url: string | null;
  slug: string;
  published_at: string | null;
}

async function loadArticle(id: string): Promise<EditArticle | null> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .select(
        'id, title, excerpt, content, category, author_name, thumbnail_url, slug, published_at'
      )
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[edit-article] load failed:', error.message);
      return null;
    }

    return (data as EditArticle | null) ?? null;
  } catch (error) {
    console.error(
      '[edit-article] Supabase config error:',
      error instanceof Error ? error.message : 'unknown'
    );
    return null;
  }
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await loadArticle(id);

  if (!article) {
    notFound();
  }

  const initialValues: ArticleFormValues = {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt ?? '',
    authorName: article.author_name ?? '',
    category: article.category,
    content: serializeContent(article.content),
    thumbnailUrl: article.thumbnail_url,
  };

  const categoryName =
    categories.find((category) => category.slug === article.category)?.name ??
    article.category;

  return (
    <div>
      <div className="mb-7">
        <Link
          href="/admin/dashboard/kelola"
          className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-muted-foreground transition-colors hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Kembali ke Kelola Berita
        </Link>

        <p className="mt-5 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-brand">
          Edit Artikel
        </p>
        <h1 className="mt-2 font-serif text-display-sm font-semibold tracking-tight">
          Perbarui berita.
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Ubah detail berita di bawah. Perubahan langsung tersimpan ke
          database setelah Anda menekan simpan.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0">
          <ArticleForm mode="edit" initialValues={initialValues} />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-brand">
              Ringkasan artikel
            </p>

            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Tag className="h-3.5 w-3.5" aria-hidden />
                  Kategori
                </dt>
                <dd className="mt-1 font-semibold">{categoryName}</dd>
              </div>

              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                  Tanggal terbit
                </dt>
                <dd className="mt-1 font-semibold">
                  {formatArticleDate(article.published_at)}
                </dd>
              </div>

              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Link2 className="h-3.5 w-3.5" aria-hidden />
                  Slug
                </dt>
                <dd className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  {article.slug}
                </dd>
              </div>
            </dl>

            <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
              Slug, sumber, dan tanggal terbit tidak berubah saat Anda
              menyimpan edit.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
