import type { Metadata } from 'next';
import { Clock3, Inbox, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { NewsletterForm } from './newsletter-form';

export const metadata: Metadata = {
  title: 'Newsletter',
  description:
    'Berlangganan newsletter INDONEWS: ringkasan berita harian, analisis ekonomi, dan kurasi teknologi langsung ke email Anda.',
};

const editions = [
  {
    title: 'Ringkasan Harian',
    schedule: 'Setiap hari, 06.00 WIB',
    description:
      'Sepuluh berita paling penting dalam satu email singkat — cocok dibaca sambil sarapan.',
    subscribers: '84.200 pembaca',
  },
  {
    title: 'Ekonomi & Pasar',
    schedule: 'Senin–Jumat, 07.30 WIB',
    description:
      'Pergerakan indeks, kebijakan fiskal, dan konteks data yang jarang dijelaskan media lain.',
    subscribers: '31.700 pembaca',
  },
  {
    title: 'Analisis Mingguan',
    schedule: 'Sabtu, 09.00 WIB',
    description:
      'Satu tulisan panjang dari meja redaksi: liputan mendalam, wawancara, dan data terbuka.',
    subscribers: '18.900 pembaca',
  },
];

export default function NewsletterPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(186 96% 26%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Newsletter' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Surat dari Redaksi</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Newsletter
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Kami merangkum yang penting, menjelaskan konteksnya, dan tidak
              mengirim lebih dari yang bisa Anda baca.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Form */}
          <section
            className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8 lg:col-span-2"
            aria-labelledby="daftar-title"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Inbox className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h2
                  id="daftar-title"
                  className="font-serif text-h2 font-black tracking-tight text-foreground"
                >
                  Daftar newsletter
                </h2>
                <p className="text-sm text-muted-foreground">
                  134.000+ pembaca sudah berlangganan
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Pilih edisi yang Anda inginkan. Kami tidak membagikan alamat email
              ke pihak ketiga dan tidak mengirim email di luar jadwal edisi.
            </p>

            <div className="mt-6">
              <NewsletterForm />
            </div>
          </section>

          {/* Editions */}
          <aside aria-labelledby="edisi-title">
            <h2
              id="edisi-title"
              className="font-serif text-xl font-bold text-foreground"
            >
              Edisi yang tersedia
            </h2>
            <div className="mt-4 space-y-3">
              {editions.map((edition) => (
                <div
                  key={edition.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <h3 className="font-serif text-base font-bold text-foreground">
                    {edition.title}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-brand">
                    <Clock3 className="h-3 w-3" aria-hidden />
                    {edition.schedule}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {edition.description}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {edition.subscribers}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* ── Why subscribe ── */}
        <section className="mt-14 rounded-2xl border border-border bg-muted/40 p-7">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-foreground">
            <Sparkles className="h-4 w-4 text-brand" aria-hidden />
            Mengapa berlangganan
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="block font-bold text-foreground">Diringkas redaksi</span>
              Bukan tautan acak: setiap item dipilih dan diberi konteks oleh editor.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="block font-bold text-foreground">Tanpa spam</span>
              Satu email per edisi, tanpa promosi terselubung atau email susulan.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="block font-bold text-foreground">Mudah dikelola</span>
              Ubah preferensi atau berhenti kapan saja melalui tautan di footer email.
            </p>
          </div>
        </section>
      </Container>
    </>
  );
}
