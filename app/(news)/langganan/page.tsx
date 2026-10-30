import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, CreditCard, ShieldCheck, X } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';

export const metadata: Metadata = {
  title: 'Langganan',
  description:
    'Pilih paket langganan INDONEWS: akses gratis, premium tanpa iklan, atau lisensi korporat untuk institusi.',
};

const plans = [
  {
    name: 'Digital',
    price: 'Rp0',
    period: 'selamanya',
    description: 'Untuk pembaca yang baru mengenal INDONEWS.',
    features: [
      { label: '5 artikel premium per bulan', included: true },
      { label: 'Newsletter harian', included: true },
      { label: 'Akses arsip 30 hari terakhir', included: true },
      { label: 'Bebas iklan', included: false },
      { label: 'Undangan diskusi redaksi', included: false },
    ],
    cta: { label: 'Mulai gratis', href: '/newsletter' },
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 'Rp49.000',
    period: 'per bulan',
    description: 'Untuk pembaca yang ingin liputan mendalam tanpa gangguan.',
    features: [
      { label: 'Artikel premium tanpa batas', included: true },
      { label: 'Newsletter eksklusif tiap Selasa', included: true },
      { label: 'Arsip lengkap sejak 2013', included: true },
      { label: 'Bebas iklan di semua perangkat', included: true },
      { label: 'Undangan diskusi redaksi bulanan', included: true },
    ],
    cta: { label: 'Berlangganan', href: '/kontak' },
    highlighted: true,
  },
  {
    name: 'Korporat',
    price: 'Rp1.200.000',
    period: 'per bulan',
    description: 'Untuk institusi, kampus, dan ruang redaksi mitra.',
    features: [
      { label: '10 akun premium', included: true },
      { label: 'Lisensi konten untuk publikasi internal', included: true },
      { label: 'Dasbor penggunaan & faktur bulanan', included: true },
      { label: 'Dukungan prioritas via email', included: true },
      { label: 'Sesi briefing editorial per kuartal', included: true },
    ],
    cta: { label: 'Ajukan penawaran', href: '/kontak' },
    highlighted: false,
  },
];

const faqs = [
  {
    question: 'Apakah saya bisa berhenti kapan saja?',
    answer:
      'Bisa. Langganan bulanan dapat dibatalkan sebelum tanggal perpanjangan berikutnya tanpa biaya tambahan, dan akses tetap berjalan hingga akhir periode.',
  },
  {
    question: 'Metode pembayaran apa yang tersedia?',
    answer:
      'Kartu kredit/debit, transfer bank, QRIS, dan virtual account. Untuk paket korporat tersedia pembayaran melalui faktur dengan termin 14 hari.',
  },
  {
    question: 'Apakah langganan bisa dipakai di beberapa perangkat?',
    answer:
      'Satu akun premium dapat digunakan di maksimal tiga perangkat sekaligus. Untuk kebutuhan tim, gunakan paket korporat agar setiap anggota memiliki akun sendiri.',
  },
];

export default function LanggananPage() {
  return (
    <>
      {/* ── Page hero ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background:
            'linear-gradient(135deg, hsl(222 24% 8%) 0%, hsl(220 90% 32%) 100%)',
        }}
      >
        <Container>
          <Breadcrumb items={[{ label: 'Langganan' }]} />
          <div className="relative pb-10 pt-2">
            <p className="eyebrow text-white/70">Dukung Jurnalisme Independen</p>
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              Langganan
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              Langganan pembaca membuat kami tetap bisa melakukan liputan
              mendalam tanpa bergantung pada pengiklan.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        {/* ── Plans ── */}
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlighted
                  ? 'relative flex flex-col rounded-2xl border-2 border-brand bg-card p-6 shadow-lift'
                  : 'relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card'
              }
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[0.5625rem] font-extrabold uppercase tracking-[0.12em] text-brand-foreground">
                  Paling populer
                </span>
              )}

              <h2 className="font-serif text-xl font-bold text-foreground">
                {plan.name}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {plan.description}
              </p>

              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="font-serif text-3xl font-black tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-xs text-muted-foreground">/ {plan.period}</span>
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className={
                      feature.included
                        ? 'flex items-start gap-2 text-sm leading-relaxed text-foreground'
                        : 'flex items-start gap-2 text-sm leading-relaxed text-muted-foreground'
                    }
                  >
                    {feature.included ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden />
                    )}
                    <span className={feature.included ? '' : 'line-through decoration-border'}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.cta.href}
                className={
                  plan.highlighted
                    ? 'mt-6 inline-flex items-center justify-center rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-foreground transition-colors hover:bg-brand-dark'
                    : 'mt-6 inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-foreground transition-colors hover:border-brand hover:text-brand'
                }
              >
                {plan.cta.label}
              </Link>
            </div>
          ))}
        </div>

        {/* ── Assurance ── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <p className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            Transaksi diproses melalui penyedia pembayaran berizin Bank Indonesia.
          </p>
          <p className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            Tidak ada biaya tersembunyi; harga sudah termasuk pajak.
          </p>
          <p className="flex items-start gap-2.5 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
            Garansi 7 hari: tidak puas, dana bulan pertama dikembalikan penuh.
          </p>
        </div>

        {/* ── FAQ ── */}
        <section className="mt-16" aria-labelledby="faq-title">
          <h2
            id="faq-title"
            className="font-serif text-h2 font-black tracking-tight text-foreground"
          >
            Pertanyaan umum
          </h2>
          <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-bold text-foreground marker:content-none">
                  {faq.question}
                  <span
                    className="text-brand transition-transform duration-200 group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </Container>
    </>
  );
}
