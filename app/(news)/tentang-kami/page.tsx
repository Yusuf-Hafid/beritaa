import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, Eye, Users } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description:
    'Profil INDONEWS: portal berita independen yang menyajikan liputan mendalam, akurat, dan terpercaya untuk pembaca Indonesia sejak 2013.',
};

const stats = [
  { value: '2013', label: 'Tahun berdiri' },
  { value: '120+', label: 'Jurnalis & kontributor' },
  { value: '8', label: 'Desk kategori' },
  { value: '34', label: 'Provinsi terjangkau' },
];

const values = [
  {
    icon: BadgeCheck,
    title: 'Akurasi lebih dulu',
    description:
      'Setiap laporan melewati verifikasi minimal dua sumber dan proses penyuntingan berlapis sebelum tayang.',
  },
  {
    icon: Eye,
    title: 'Independen',
    description:
      'Kebijakan editorial tidak ditentukan oleh pemilik modal, pengiklan, maupun kepentingan politik mana pun.',
  },
  {
    icon: Users,
    title: 'Berpihak pada publik',
    description:
      'Kami mengutamakan kepentingan pembaca: hak atas informasi, hak jawab, dan ruang untuk suara yang jarang terdengar.',
  },
];

const milestones = [
  {
    year: '2013',
    title: 'INDONEWS lahir sebagai buletin digital',
    description:
      'Dimulai dari ruang redaksi kecil di Jakarta dengan empat jurnalis dan satu fokus: isu ekonomi yang jarang diliput media arus utama.',
  },
  {
    year: '2016',
    title: 'Ekspansi ke delapan desk',
    description:
      'Desk nasional, internasional, olahraga, teknologi, hiburan, gaya hidup, dan hukum dibentuk untuk menjawab kebutuhan pembaca.',
  },
  {
    year: '2020',
    title: 'Ruang redaksi data & verifikasi fakta',
    description:
      'Tim fact-checking independen dibentuk untuk memerangi disinformasi, terutama selama masa krisis kesehatan global.',
  },
  {
    year: '2024',
    title: 'Jaringan kontributor daerah',
    description:
      'Kontributor di 34 provinsi memungkinkan liputan lokal yang cepat tanpa kehilangan konteks nasional.',
  },
];

export default function TentangKamiPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(220 90% 30%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Tentang Kami' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Profil Perusahaan</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Tentang Kami
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              INDONEWS adalah portal berita independen yang berdiri sejak 2013.
              Kami meliput politik, ekonomi, hukum, teknologi, dan kehidupan
              sehari-hari dengan standar verifikasi yang ketat.
            </p>
          </div>
        </Container>
      </div>

      {/* ── Profil & statistik ── */}
      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <h2 className="font-serif text-h2 font-black tracking-tight text-foreground">
              Siapa kami
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              Kami percaya bahwa informasi yang baik adalah fondasi masyarakat
              yang sehat. Karena itu INDONEWS tidak mengejar kecepatan dengan
              mengorbankan ketepatan: sebuah berita baru tayang setelah klaim
              utamanya terverifikasi, sumbernya dapat dipertanggungjawabkan, dan
              konteksnya dijelaskan.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Ruang redaksi kami terdiri dari jurnalis tetap, editor desk, tim
              data, serta kontributor di daerah. Kami bekerja dengan pedoman
              media siber, menghormati hak jawab, dan membuka diri terhadap
              koreksi dari siapa pun — termasuk dari pihak yang diberitakan.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              Pendapatan kami berasal dari langganan pembaca, kerja sama iklan
              yang diberi label jelas, dan lisensi konten. Tidak ada pengiklan
              yang memiliki hak untuk membaca, mengubah, atau membatalkan
              laporan sebelum terbit.
            </p>
          </div>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <p className="eyebrow text-muted-foreground">INDONEWS dalam angka</p>
            <dl className="mt-4 grid grid-cols-2 gap-5">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-serif text-3xl font-black tracking-tight text-foreground">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-t border-border pt-4">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                PT Indonews Media Nusantara, Jakarta Selatan. Terdaftar sebagai
                penerbit pers siber di Dewan Pers.
              </p>
            </div>
          </aside>
        </div>

        {/* ── Nilai ── */}
        <section className="mt-16" aria-labelledby="nilai-title">
          <h2
            id="nilai-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Nilai yang kami pegang
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-card transition-colors hover:border-brand/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Perjalanan ── */}
        <section className="mt-16" aria-labelledby="perjalanan-title">
          <h2
            id="perjalanan-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Perjalanan kami
          </h2>
          <ol className="mt-6 space-y-4">
            {milestones.map((item) => (
              <li
                key={item.year}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-card sm:flex-row sm:items-start sm:gap-6"
              >
                <span className="inline-flex w-fit shrink-0 items-center rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-bold text-brand">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-serif text-base font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── CTA ── */}
        <div className="mt-16 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border bg-card p-7 shadow-card sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              Ingin tahu siapa yang mengisi halaman ini?
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Kenali susunan redaksi kami atau kirim pertanyaan langsung ke tim.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/redaksi"
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-foreground transition-colors hover:bg-brand-dark"
            >
              Susunan redaksi
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              Hubungi kami
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
