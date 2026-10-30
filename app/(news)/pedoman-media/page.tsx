import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Scale } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Pedoman Media',
  description:
    'Pedoman pemberitaan media siber INDONEWS: verifikasi, keberimbangan, hak jawab, koreksi, konten pengguna, dan iklan.',
};

const guidelines = [
  {
    title: 'Ruang lingkup dan tanggung jawab',
    body: 'Seluruh konten yang terbit di indonews.id berada di bawah tanggung jawab redaksi. Kontributor lepas, kolumnis, dan mitra konten terikat pada pedoman ini sebelum karyanya diterbitkan.',
  },
  {
    title: 'Verifikasi dan sumber',
    body: 'Identitas narasumber diperiksa, dokumen dikonfirmasi ke pihak berwenang atau pihak terkait, dan klaim tunggal tidak dijadikan dasar utama pemberitaan. Narasumber anonim hanya digunakan bila informasi tidak dapat diperoleh dengan cara lain dan kepentingan publik jelas.',
  },
  {
    title: 'Keberimbangan dan praduga tak bersalah',
    body: 'Pihak yang diberitakan diberi kesempatan menjawab sebelum publikasi. Dalam perkara pidana, seseorang tetap disebut sebagai "tersangka" atau "terdakwa" sesuai status hukumnya, bukan sebagai pelaku yang terbukti bersalah.',
  },
  {
    title: 'Hak jawab dan hak koreksi',
    body: 'Setiap pihak dapat mengajukan hak jawab atas pemberitaan yang dinilai merugikan. Redaksi wajib menayangkan hak jawab dan/atau koreksi, serta mencantumkan catatan perubahan pada artikel asli.',
  },
  {
    title: 'Larangan konten tertentu',
    body: 'INDONEWS tidak memuat konten yang mendiskreditkan atas dasar suku, agama, ras, dan antargolongan, konten seksual eksplisit, kekerasan grafis tanpa konteks jurnalistik, maupun identitas anak yang berhadapan dengan hukum.',
  },
  {
    title: 'Konten buatan pengguna dan komentar',
    body: 'Komentar dan kiriman pembaca dimoderasi. Redaksi berhak menghapus konten yang mengandung ujaran kebencian, ancaman, spam, atau data pribadi tanpa persetujuan pemiliknya.',
  },
  {
    title: 'Iklan, advertorial, dan kerja sama',
    body: 'Materi berbayar diberi label "Advertorial" atau "Bekerja sama dengan" secara jelas. Pengiklan tidak memiliki akses untuk mengubah isi laporan jurnalistik, dan redaksi tidak menerbitkan konten berbayar yang menyamar sebagai berita.',
  },
];

const correctionSteps = [
  {
    title: 'Ajukan permohonan',
    body: 'Kirim rincian bagian yang dinilai keliru beserta bukti pendukung ke koreksi@indonews.id atau melalui formulir kontak.',
  },
  {
    title: 'Verifikasi ulang',
    body: 'Redaktur eksekutif menelaah permohonan maksimal 2 x 24 jam kerja dan menghubungi pihak terkait untuk konfirmasi.',
  },
  {
    title: 'Penerbitan koreksi',
    body: 'Bila terbukti, artikel diperbarui dengan catatan koreksi di bagian bawah dan hak jawab ditayangkan pada halaman yang sama.',
  },
];

export default function PedomanMediaPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(210 40% 28%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Pedoman Media' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Standar Pemberitaan</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Pedoman Media Siber
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Pegangan kerja seluruh jurnalis dan editor INDONEWS, disusun
              dengan merujuk pada Pedoman Pemberitaan Media Siber dan Kode Etik
              Jurnalistik.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Guidelines */}
          <div className="lg:col-span-2">
            <p className="text-base leading-relaxed text-muted-foreground">
              Pedoman ini berlaku untuk semua kanal INDONEWS: situs, newsletter,
              media sosial resmi, dan kanal distribusi lainnya. Pelanggaran
              terhadap pedoman ditangani oleh dewan redaksi dan dapat berujung
              pada sanksi editorial hingga pemutusan kerja sama.
            </p>

            <ol className="mt-8 space-y-5">
              {guidelines.map((item, index) => (
                <li
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 font-mono text-xs font-bold text-brand"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h2 className="font-serif text-base font-bold text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Aside */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Scale className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 font-serif text-lg font-bold text-foreground">
                Prosedur koreksi
              </h2>
              <ol className="mt-3 space-y-4">
                {correctionSteps.map((step, index) => (
                  <li key={step.title}>
                    <p className="text-sm font-bold text-foreground">
                      {index + 1}. {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <h2 className="font-serif text-lg font-bold text-foreground">
                Menemukan kesalahan?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Kami terbuka pada koreksi. Sertakan tautan artikel, bagian yang
                keliru, dan data pendukung agar prosesnya lebih cepat.
              </p>
              <Link
                href="/kontak"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.1em] text-brand transition-colors hover:text-brand-dark"
              >
                Kirim koreksi
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
