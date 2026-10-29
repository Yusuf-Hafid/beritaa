'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div role="status" className="mt-4 flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
        <CheckCircle2 className="h-4 w-4 text-white/80 flex-shrink-0" aria-hidden />
        <span>Terima kasih! Anda telah berlangganan newsletter INDONEWS.</span>
      </div>
    );
  }

  return (
    <form
      className="mt-4 space-y-2"
      aria-label="Berlangganan newsletter INDONEWS"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">Alamat email</label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="email@anda.com"
          className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/40 transition-colors focus:border-white/40 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-white py-3 text-xs font-extrabold uppercase tracking-[0.14em] text-brand transition-colors hover:bg-white/90 active:scale-95"
      >
        Berlangganan Gratis
      </button>
    </form>
  );
}
