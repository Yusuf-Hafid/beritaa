import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { AlertCircle, Newspaper, Pencil, Plus } from 'lucide-react';
import { categories } from '@/data/categories';
import { createAdminClient } from '@/utils/supabase/server';
import { DeleteArticleButton } from '@/components/admin/delete-article-button';
import { ArticlesTableSkeleton } from '@/components/admin/articles-table-skeleton';
import { ReloadButton } from '@/components/admin/reload-button';
import { formatArticleDate } from '../article-date';

export const metadata: Metadata = {
  title: 'Kelola Berita',
};

interface ArticleRow {
  id: string;
  title: string;
  category: string;
  published_at: string | null;
  source: string | null;
}

async function loadArticles(): Promise<{
  articles: ArticleRow[];
  error: string | null;
}> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('articles')
      .select('id, title, category, published_at, source')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(100);

    if (error) {
      console.error('[kelola] load articles failed:', error.message);
      return {
        articles: [],
        error: 'Daftar berita gagal dimuat. Coba muat ulang halaman ini.',
      };
    }

    return { articles: (data ?? []) as ArticleRow[], error: null };
  } catch (error) {
    console.error(
      '[kelola] Supabase config error:',
      error instanceof Error ? error.message : 'unknown'
    );

    return {
      articles: [],
      error: 'Koneksi database belum dikonfigurasi dengan benar.',
    };
  }
}

function categoryFor(slug: string) {
  return categories.find((category) => category.slug === slug);
}

function sourceLabel(source: string | null): string {
  if (!source || source === 'editorial') return 'Redaksi';
  return source;
}

export default function KelolaArticlePage() {
  return (
    <div data-kelola-page>
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-brand">
            Content Management
          </p>
          <h1 className="mt-2 font-serif text-display-sm font-semibold tracking-tight">
            Kontrol berita.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Kelola seluruh berita yang tersimpan di database. Sunting isi atau
            hapus artikel yang sudah tidak dibutuhkan.
          </p>
        </div>

        <Link
          href="/admin/dashboard/upload"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-dark px-4 text-xs font-semibold text-brand-foreground shadow-glow-brand transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Tulis berita
        </Link>
      </div>

      <Suspense fallback={<ArticlesTableSkeleton />}>
        <ArticlesTable />
      </Suspense>
    </div>
  );
}

async function ArticlesTable() {
  const { articles, error } = await loadArticles();

  return (
    <>
      {error ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Daftar berita tidak dapat dimuat.</p>
            <p className="mt-1 leading-6 text-destructive/90">{error}</p>
            <ReloadButton />
          </div>
        </div>
      ) : articles.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                    <th scope="col" className="px-5 py-3.5 font-semibold">
                      Judul
                    </th>
                    <th
                      scope="col"
                      className="w-40 px-5 py-3.5 font-semibold"
                    >
                      Kategori
                    </th>
                    <th
                      scope="col"
                      className="w-36 px-5 py-3.5 font-semibold"
                    >
                      Tanggal
                    </th>
                    <th
                      scope="col"
                      className="w-28 px-5 py-3.5 text-right font-semibold"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article) => {
                    const category = categoryFor(article.category);

                    return (
                      <tr
                        key={article.id}
                        className="border-b border-border/70 transition-colors last:border-0 hover:bg-muted/25"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/dashboard/kelola/${article.id}`}
                            className="group inline-flex max-w-xl"
                          >
                            <span className="line-clamp-2 font-semibold leading-6 text-foreground transition-colors group-hover:text-brand-dark">
                              {article.title}
                            </span>
                          </Link>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sumber: {sourceLabel(article.source)}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold">
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                backgroundColor:
                                  category?.color ??
                                  'hsl(var(--muted-foreground))',
                              }}
                              aria-hidden
                            />
                            {category?.name ?? article.category}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted-foreground">
                          {formatArticleDate(article.published_at)}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/dashboard/kelola/${article.id}`}
                              aria-label={`Edit berita: ${article.title}`}
                              title="Edit berita"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:border-brand/30 hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
                            >
                              <Pencil className="h-4 w-4" aria-hidden />
                            </Link>

                            <DeleteArticleButton
                              articleId={article.id}
                              articleTitle={article.title}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Menampilkan {articles.length} berita terbaru.
          </p>
        </>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-card">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
        <Newspaper className="h-6 w-6" aria-hidden />
      </span>
      <h2 className="mt-4 font-serif text-xl font-semibold tracking-tight">
        Belum ada berita
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        Berita yang diunggah lewat tab Upload Berita akan muncul di sini.
      </p>
      <Link
        href="/admin/dashboard/upload"
        className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-dark px-4 text-xs font-semibold text-brand-foreground shadow-glow-brand transition-colors hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Upload berita pertama
      </Link>
    </div>
  );
}
