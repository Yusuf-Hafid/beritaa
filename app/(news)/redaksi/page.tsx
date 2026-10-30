import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Redaksi',
  description:
    'Susunan dewan redaksi INDONEWS, penanggung jawab desk, dan kontak resmi ruang redaksi.',
};

const leaders = [
  {
    initials: 'RS',
    name: 'Rahmat Setiawan',
    role: 'Pemimpin Redaksi',
    focus: 'Kebijakan editorial dan standar verifikasi',
  },
  {
    initials: 'AN',
    name: 'Ayu Nastiti',
    role: 'Redaktur Pelaksana',
    focus: 'Koordinasi harian lintas desk dan jadwal terbit',
  },
  {
    initials: 'BP',
    name: 'Bagas Prakoso',
    role: 'Redaktur Eksekutif',
    focus: 'Investigasi, liputan data, dan hak jawab',
  },
  {
    initials: 'LM',
    name: 'Laras Murti',
    role: 'Kepala Desk Digital',
    focus: 'Distribusi, newsletter, dan produk pembaca',
  },
];

const desks = [
  { desk: 'Nasional', lead: 'Dimas Wardhana', ext: '201' },
  { desk: 'Internasional', lead: 'Sinta Halimah', ext: '204' },
  { desk: 'Ekonomi', lead: 'Yoga Ardhana', ext: '207' },
  { desk: 'Olahraga', lead: 'Fikri Ramadhan', ext: '210' },
  { desk: 'Teknologi', lead: 'Nadia Kusuma', ext: '213' },
  { desk: 'Hiburan & Gaya Hidup', lead: 'Tirta Anjani', ext: '216' },
  { desk: 'Hukum', lead: 'Hendra Lubis', ext: '219' },
  { desk: 'Visual & Multimedia', lead: 'Citra Mahendra', ext: '222' },
];

export default function RedaksiPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(202 65% 26%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Redaksi' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Struktur Organisasi</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Redaksi
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Tim yang bertanggung jawab atas setiap berita yang terbit di
              INDONEWS — dari verifikasi fakta hingga keputusan akhir
              penyuntingan.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        {/* ── Dewan redaksi ── */}
        <section aria-labelledby="dewan-title">
          <h2
            id="dewan-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Dewan redaksi
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Dewan redaksi menetapkan arah pemberitaan, mengevaluasi kualitas
            liputan setiap bulan, dan menjadi penanggung jawab tertinggi atas
            sengketa editorial.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {leaders.map((person) => (
              <div
                key={person.name}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10 font-serif text-base font-black text-brand"
                  aria-hidden
                >
                  {person.initials}
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {person.name}
                  </h3>
                  <p className="text-xs font-extrabold uppercase tracking-[0.1em] text-brand">
                    {person.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {person.focus}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Penanggung jawab desk ── */}
        <section className="mt-16" aria-labelledby="desk-title">
          <h2
            id="desk-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Penanggung jawab desk
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-card">
            <table className="w-full border-collapse bg-card text-left text-sm">
              <caption className="sr-only">
                Daftar desk beserta penanggung jawab dan nomor ekstensi redaksi
              </caption>
              <thead>
                <tr className="border-b border-border bg-muted/60">
                  <th scope="col" className="px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                    Desk
                  </th>
                  <th scope="col" className="px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                    Penanggung jawab
                  </th>
                  <th scope="col" className="px-5 py-3 text-right text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                    Ekstensi
                  </th>
                </tr>
              </thead>
              <tbody>
                {desks.map((row) => (
                  <tr key={row.desk} className="border-b border-border last:border-0">
                    <th scope="row" className="px-5 py-3 font-semibold text-foreground">
                      {row.desk}
                    </th>
                    <td className="px-5 py-3 text-muted-foreground">{row.lead}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                      {row.ext}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Kebijakan editorial + kontak ── */}
        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Kebijakan editorial
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Setiap keberatan atas isi pemberitaan diproses oleh redaktur
              eksekutif dalam waktu maksimal 2 x 24 jam kerja. Kami wajib
              memuat hak jawab apabila ditemukan ketidaksesuaian fakta, dan
              mencantumkan koreksi secara terbuka pada artikel terkait.
            </p>
            <Link
              href="/pedoman-media"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-brand transition-colors hover:text-brand-dark"
            >
              Baca pedoman media siber
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold text-foreground">
              Kontak ruang redaksi
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span>
                  Redaksi: <span className="text-foreground">redaksi@indonews.id</span>
                  <br />
                  Hak jawab: <span className="text-foreground">koreksi@indonews.id</span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span className="text-foreground">+62 21 5089 7712</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                <span>
                  Jl. Wolter Monginsidi No. 42, Kebayoran Baru,
                  <br />
                  Jakarta Selatan 12180
                </span>
              </li>
            </ul>
            <Link
              href="/kontak"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-brand transition-colors hover:text-brand-dark"
            >
              Formulir kontak
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </section>
        </div>
      </Container>
    </>
  );
}
