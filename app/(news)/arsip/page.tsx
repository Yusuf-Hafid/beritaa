import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarDays, Newspaper } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { articles } from '@/data/articles';
import { getCategory } from '@/data/categories';
import { formatTanggalSingkat } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Arsip',
  description:
    'Arsip pemberitaan INDONEWS yang tersusun per bulan, lengkap dengan kategori dan tanggal terbit.',
};

const monthFormatter = new Intl.DateTimeFormat('id-ID', {
  month: 'long',
  year: 'numeric',
});

export default function ArsipPage() {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const groups = sorted.reduce<
    { label: string; items: typeof sorted }[]
  >((acc, article) => {
    const label = monthFormatter.format(new Date(article.publishedAt));
    const existing = acc.find((group) => group.label === label);

    if (existing) {
      existing.items.push(article);
    } else {
      acc.push({ label, items: [article] });
    }

    return acc;
  }, []);

  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(210 40% 26%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Arsip' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Indeks Pemberitaan</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Arsip
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Seluruh artikel yang telah terbit, dikelompokkan per bulan. Gunakan
              halaman kategori untuk menelusuri topik tertentu.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Newspaper className="h-4 w-4 text-brand" aria-hidden />
            {sorted.length} artikel dalam arsip
          </p>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 text-brand" aria-hidden />
            Urut terbaru
          </p>
        </div>

        <div className="mt-8 space-y-12">
          {groups.map((group) => (
            <section key={group.label} aria-labelledby={`arsip-${group.label}`}>
              <div className="flex items-baseline justify-between gap-4">
                <h2
                  id={`arsip-${group.label}`}
                  className="font-serif text-h2 font-black tracking-tight text-foreground"
                >
                  {group.label}
                </h2>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  {group.items.length} artikel
                </span>
              </div>

              <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
                {group.items.map((article) => {
                  const category = getCategory(article.category);

                  return (
                    <li key={article.id}>
                      <Link
                        href={`/artikel/${article.slug}`}
                        className="group flex flex-col gap-1.5 px-5 py-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                      >
                        <div className="min-w-0">
                          <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.12em] text-brand">
                            {category?.name ?? 'Berita'}
                          </p>
                          <p className="mt-1 line-clamp-2 font-serif text-base font-bold leading-snug text-foreground transition-colors group-hover:text-brand">
                            {article.title}
                          </p>
                        </div>
                        <p className="shrink-0 text-xs text-muted-foreground">
                          {formatTanggalSingkat(article.publishedAt)}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {groups.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Belum ada artikel yang diarsipkan.
          </p>
        )}

        <p className="mt-12 text-sm leading-relaxed text-muted-foreground">
          Butuh artikel tertentu? Gunakan{' '}
          <Link href="/" className="font-bold text-brand hover:text-brand-dark">
            pencarian di beranda
          </Link>{' '}
          atau{' '}
          <Link href="/kontak" className="font-bold text-brand hover:text-brand-dark">
            hubungi redaksi
          </Link>{' '}
          untuk permintaan arsip khusus.
        </p>
      </Container>
    </>
  );
}
