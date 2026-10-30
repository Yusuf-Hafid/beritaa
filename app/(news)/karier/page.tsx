import type { Metadata } from 'next';
import { ArrowRight, Clock3, MapPin, Send, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Karier',
  description:
    'Lowongan kerja di INDONEWS untuk reporter, editor, dan tim produk digital. Lihat posisi terbuka dan cara melamar.',
};

const benefits = [
  {
    title: 'Kompensasi transparan',
    body: 'Struktur gaji berjenjang dengan tinjauan dua kali setahun dan tunjangan liputan di luar kota.',
  },
  {
    title: 'Pelatihan rutin',
    body: 'Kelas internal verifikasi fakta, pelaporan data, dan keamanan digital bersama mentor redaksi.',
  },
  {
    title: 'Jam kerja manusiawi',
    body: 'Sistem shift terencana, hak cuti tahunan 14 hari, dan kompensasi jelas untuk kerja lembur.',
  },
  {
    title: 'Asuransi keluarga',
    body: 'BPJS Kesehatan dan Ketenagakerjaan plus asuransi swasta yang mencakup anggota keluarga inti.',
  },
];

const jobs = [
  {
    title: 'Reporter Ekonomi',
    desk: 'Desk Ekonomi',
    type: 'Penuh waktu',
    location: 'Jakarta (hybrid)',
    summary:
      'Meliput pasar modal, kebijakan fiskal, dan sektor riil. Membangun narasumber dari regulator, pelaku usaha, dan akademisi.',
    requirements: [
      'Minimal 2 tahun pengalaman jurnalistik, diutamakan ekonomi/bisnis',
      'Mampu menulis cepat, akurat, dan memahami data statistik dasar',
      'Terbiasa bekerja dengan tenggat harian dan liputan lapangan',
    ],
  },
  {
    title: 'Editor Malam',
    desk: 'Desk Produksi',
    type: 'Penuh waktu (shift)',
    location: 'Jakarta (on-site)',
    summary:
      'Menyunting naskah masuk pada shift malam, menjaga standar judul, struktur, dan verifikasi sebelum tayang.',
    requirements: [
      'Pengalaman 3 tahun sebagai editor di media daring',
      'Kuat dalam penyuntingan cepat dan manajemen prioritas',
      'Siap bekerja shift 15.00–23.00 WIB',
    ],
  },
  {
    title: 'Social Media Officer',
    desk: 'Desk Digital',
    type: 'Kontrak 12 bulan',
    location: 'Remote (GMT+7)',
    summary:
      'Mengelola distribusi konten di kanal sosial resmi, menyusun kalender editorial, dan membaca tren percakapan publik.',
    requirements: [
      'Paham karakter tiap platform dan format konten vertikal',
      'Mampu menulis caption yang ringkas dan faktual',
      'Familiar dengan alat analitik sosial media',
    ],
  },
];

export default function KarierPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(265 60% 32%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Karier' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Bekerja di INDONEWS</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Karier
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Kami mencari orang-orang yang percaya bahwa jurnalisme yang baik
              masih layak diperjuangkan — dan ingin membangunnya bersama.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        {/* ── Benefits ── */}
        <section aria-labelledby="benefit-title">
          <h2
            id="benefit-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Yang kami tawarkan
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <Sparkles className="h-4 w-4 text-brand" aria-hidden />
                <h3 className="mt-3 font-serif text-base font-bold text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {benefit.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Openings ── */}
        <section className="mt-16" aria-labelledby="lowongan-title">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2
              id="lowongan-title"
              className="font-serif text-h2 font-black tracking-tight text-foreground"
            >
              Posisi terbuka
            </h2>
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
              3 lowongan · diperbarui Oktober 2026
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {jobs.map((job) => (
              <article
                key={job.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand">
                      {job.desk}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-bold text-foreground">
                      {job.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden />
                      {job.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {job.location}
                    </span>
                  </div>
                </div>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {job.summary}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {job.requirements.map((requirement) => (
                    <li
                      key={requirement}
                      className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                      {requirement}
                    </li>
                  ))}
                </ul>

                <a
                  href={`mailto:karier@indonews.id?subject=${encodeURIComponent(
                    `Lamaran: ${job.title}`,
                  )}`}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-foreground transition-colors hover:bg-brand-dark"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden />
                  Lamar posisi ini
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* ── How to apply ── */}
        <section className="mt-16 rounded-2xl border border-border bg-muted/40 p-7">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Cara melamar
          </h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-3">
            <li>
              <p className="text-sm font-bold text-foreground">1. Siapkan berkas</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                CV terbaru, portofolio 3 tulisan atau proyek relevan, dan surat
                lamaran singkat.
              </p>
            </li>
            <li>
              <p className="text-sm font-bold text-foreground">2. Kirim email</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Tujuan <span className="text-foreground">karier@indonews.id</span> dengan subjek
                &quot;Lamaran: Nama Posisi&quot;.
              </p>
            </li>
            <li>
              <p className="text-sm font-bold text-foreground">3. Proses seleksi</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Seleksi berkas, tes menulis, wawancara redaksi, lalu penawaran.
                Rata-rata 2–3 minggu.
              </p>
            </li>
          </ol>
          <p className="mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            Tidak ada posisi yang cocok?
            <a
              href="mailto:karier@indonews.id?subject=Lamaran%20spontan"
              className="inline-flex items-center gap-1 font-bold text-brand hover:text-brand-dark"
            >
              Kirim lamaran spontan
              <ArrowRight className="h-3 w-3" aria-hidden />
            </a>
          </p>
        </section>
      </Container>
    </>
  );
}
