import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BarChart3, LayoutPanelTop, Newspaper, Smartphone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Iklan',
  description:
    'Rate card dan format iklan di INDONEWS: display, native article, newsletter, dan media sosial.',
};

const stats = [
  { value: '1,8 juta', label: 'Pembaca unik / bulan' },
  { value: '12,4 juta', label: 'Page view / bulan' },
  { value: '62%', label: 'Akses dari mobile' },
  { value: '4:12', label: 'Rata-rata durasi baca' },
];

const formats = [
  {
    icon: LayoutPanelTop,
    title: 'Billboard Display',
    size: '970 × 250 px',
    placement: 'Header & leaderboard artikel',
    price: 'Rp18.000.000 / bulan',
  },
  {
    icon: Newspaper,
    title: 'Native Article',
    size: 'Artikel 600–800 kata',
    placement: 'Beranda & kategori, berlabel Advertorial',
    price: 'Rp25.000.000 / artikel',
  },
  {
    icon: Smartphone,
    title: 'Mobile Sticky',
    size: '320 × 100 px',
    placement: 'Melekat di bawah layar, mobile',
    price: 'Rp12.500.000 / bulan',
  },
  {
    icon: BarChart3,
    title: 'Newsletter Sponsorship',
    size: 'Blok 120 kata + logo',
    placement: 'Ringkasan Harian (84.200 pelanggan)',
    price: 'Rp9.000.000 / edisi',
  },
];

const steps = [
  {
    title: 'Kirim brief',
    body: 'Sampaikan tujuan kampanye, periode tayang, dan format yang diminati melalui formulir kontak.',
  },
  {
    title: 'Proposal & slot',
    body: 'Tim kami mengirim ketersediaan slot, estimasi impresi, dan penawaran dalam 2 hari kerja.',
  },
  {
    title: 'Produksi materi',
    body: 'Materi iklan melalui pemeriksaan kesesuaian: tanpa klaim menyesatkan dan jelas sebagai iklan.',
  },
  {
    title: 'Laporan',
    body: 'Setelah kampanye berakhir Anda menerima laporan impresi, klik, dan pembaca unik.',
  },
];

export default function IklanPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(25 85% 34%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Iklan' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Kerja Sama Komersial</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Beriklan di INDONEWS
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Menjangkau pembaca urban, terdidik, dan berdaya beli tinggi —
              tanpa mengganggu integritas ruang redaksi.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        {/* ── Audience ── */}
        <section aria-labelledby="audiens-title">
          <h2
            id="audiens-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Profil audiens
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <p className="font-serif text-2xl font-black tracking-tight text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Data berdasarkan rata-rata tiga bulan terakhir (Juli–September 2026),
            diukur dengan analitik pihak pertama.
          </p>
        </section>

        {/* ── Formats ── */}
        <section className="mt-16" aria-labelledby="format-title">
          <h2
            id="format-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Format & rate card
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {formats.map((format) => {
              const Icon = format.icon;
              return (
                <div
                  key={format.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
                    {format.title}
                  </h3>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Ukuran</dt>
                      <dd className="text-right font-medium text-foreground">{format.size}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Penempatan</dt>
                      <dd className="max-w-[60%] text-right font-medium text-foreground">
                        {format.placement}
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 border-t border-border pt-3 text-sm font-bold text-brand">
                    {format.price}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Harga belum termasuk PPN 11%. Paket bundling tiga bulan tersedia
            dengan diskon hingga 15%.
          </p>
        </section>

        {/* ── Steps ── */}
        <section className="mt-16" aria-labelledby="alur-title">
          <h2
            id="alur-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Alur pemesanan
          </h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <span className="font-mono text-xs font-bold text-brand">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-2 font-serif text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── CTA ── */}
        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-card p-7 shadow-card sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Minta proposal iklan
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Ceritakan kebutuhan kampanye Anda. Tim komersial kami akan
              menyiapkan rekomendasi penempatan dan estimasi performa.
            </p>
          </div>
          <Link
            href="/kontak"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-foreground transition-colors hover:bg-brand-dark"
          >
            Hubungi tim iklan
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </Container>
    </>
  );
}
