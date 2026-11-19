import type { Metadata } from 'next';
import { ExternalLink, PenLine } from 'lucide-react';
import { ArticleForm } from '../article-form';

export const metadata: Metadata = {
  title: 'Upload Berita',
};

export default function UploadArticlePage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="min-w-0">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.625rem] font-bold uppercase tracking-[0.22em] text-brand">
              Content Management
            </p>
            <h1 className="mt-2 font-serif text-display-sm font-semibold tracking-tight">
              Tulis berita baru.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Lengkapi detail berita di bawah. Setelah di-upload, data akan
              tersimpan di tabel articles Supabase.
            </p>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
          >
            Lihat situs
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>

        <ArticleForm />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center gap-2 text-brand">
              <PenLine className="h-4 w-4" aria-hidden />
              <p className="text-[0.625rem] font-bold uppercase tracking-[0.18em]">
                Panduan singkat
              </p>
            </div>

            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-2.5">
                <span className="font-mono text-[0.6875rem] font-bold text-brand">
                  01
                </span>
                Gunakan judul yang spesifik dan informatif.
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-[0.6875rem] font-bold text-brand">
                  02
                </span>
                Buat excerpt yang merangkum inti berita.
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-[0.6875rem] font-bold text-brand">
                  03
                </span>
                Pisahkan paragraf dengan satu baris kosong.
              </li>
              <li className="flex gap-2.5">
                <span className="font-mono text-[0.6875rem] font-bold text-brand">
                  04
                </span>
                Gunakan thumbnail rasio 16:9, maksimal 5 MB.
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}
