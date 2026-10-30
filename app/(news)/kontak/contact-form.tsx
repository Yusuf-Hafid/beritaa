'use client';

import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

const subjects = [
  'Koreksi / hak jawab',
  'Kerja sama & iklan',
  'Karier & magang',
  'Informasi umum',
];

export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground"
          >
            Nama lengkap
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Nama Anda"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="nama@email.com"
            className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground"
        >
          Topik
        </label>
        <select
          id="contact-subject"
          name="subject"
          className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30"
        >
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground"
        >
          Pesan
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="Tuliskan pesan Anda, sertakan tautan artikel bila berkaitan dengan koreksi."
          className="w-full resize-y rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.08em] text-brand-foreground transition-colors hover:bg-brand-dark"
        >
          <Send className="h-3.5 w-3.5" aria-hidden />
          Kirim pesan
        </button>
        <p className="text-xs text-muted-foreground">
          Balasan dikirim ke email Anda dalam 1–2 hari kerja.
        </p>
      </div>

      {sent && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-brand/30 bg-brand/10 p-3.5 text-sm text-foreground"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
          Pesan Anda sudah tercatat. Tim redaksi akan menindaklanjuti melalui
          email yang Anda cantumkan.
        </p>
      )}
    </form>
  );
}
