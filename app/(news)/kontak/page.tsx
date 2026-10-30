import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi redaksi INDONEWS untuk koreksi berita, hak jawab, kerja sama iklan, atau pertanyaan umum.',
};

const channels = [
  {
    icon: Mail,
    label: 'Email redaksi',
    value: 'redaksi@indonews.id',
    note: 'Koreksi & hak jawab: koreksi@indonews.id',
  },
  {
    icon: Phone,
    label: 'Telepon',
    value: '+62 21 5089 7712',
    note: 'Senin–Jumat, 09.00–17.00 WIB',
  },
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Jl. Wolter Monginsidi No. 42',
    note: 'Kebayoran Baru, Jakarta Selatan 12180',
  },
  {
    icon: Clock3,
    label: 'Jam operasional',
    value: 'Redaksi 24 jam',
    note: 'Layanan umum 09.00–17.00 WIB',
  },
];

export default function KontakPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(186 96% 24%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Kontak' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Hubungi INDONEWS</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Kontak
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Sampaikan koreksi, hak jawab, pertanyaan, atau usulan liputan.
              Setiap pesan dibaca oleh tim redaksi, bukan robot.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Form */}
          <section
            className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2 sm:p-8"
            aria-labelledby="form-title"
          >
            <h2
              id="form-title"
              className="font-serif text-h2 font-black tracking-tight text-foreground"
            >
              Kirim pesan
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Untuk permohonan koreksi, sertakan tautan artikel dan kutipan
              bagian yang dinilai keliru agar penanganannya lebih cepat.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </section>

          {/* Channels */}
          <aside className="space-y-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.label}
                  className="rounded-xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[0.625rem] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                        {channel.label}
                      </p>
                      <p className="mt-1 break-words text-sm font-bold text-foreground">
                        {channel.value}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {channel.note}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="rounded-xl border border-border bg-muted/40 p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Informasi tentang standar pemberitaan dan prosedur koreksi ada
                di{' '}
                <Link
                  href="/pedoman-media"
                  className="font-bold text-brand hover:text-brand-dark"
                >
                  Pedoman Media
                </Link>
                . Untuk peluang kerja, lihat halaman{' '}
                <Link
                  href="/karier"
                  className="font-bold text-brand hover:text-brand-dark"
                >
                  Karier
                </Link>
                .
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
