'use client';

import { useState } from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

const editions = [
  { id: 'harian', label: 'Ringkasan Harian', defaultChecked: true },
  { id: 'ekonomi', label: 'Ekonomi & Pasar', defaultChecked: true },
  { id: 'teknologi', label: 'Teknologi', defaultChecked: false },
  { id: 'mingguan', label: 'Analisis Mingguan', defaultChecked: false },
];

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubscribed(true);
      }}
    >
      <div>
        <label
          htmlFor="newsletter-email"
          className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground"
        >
          Alamat email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="nama@email.com"
            className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-3.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
          Pilih edisi
        </legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {editions.map((edition) => (
            <label
              key={edition.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground transition-colors hover:border-brand/50"
            >
              <input
                type="checkbox"
                name="edition"
                value={edition.id}
                defaultChecked={edition.defaultChecked}
                className="h-4 w-4 rounded border-border text-brand accent-brand"
              />
              {edition.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-foreground transition-colors hover:bg-brand-dark"
        >
          Berlangganan
        </button>
        <p className="text-xs text-muted-foreground">
          Gratis. Berhenti kapan saja lewat tautan di setiap email.
        </p>
      </div>

      {subscribed && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-brand/30 bg-brand/10 p-3.5 text-sm text-foreground"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
          Terima kasih! Konfirmasi langganan dikirim ke email Anda. Klik tautan
          di dalamnya untuk mengaktifkan edisi pilihan.
        </p>
      )}
    </form>
  );
}
