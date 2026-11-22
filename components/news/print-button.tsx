'use client';

import { Download } from 'lucide-react';

/**
 * Tombol "Download PDF" memakai dialog cetak bawaan browser: pengguna memilih
 * "Save as PDF". Tampilan cetak diatur lewat `@media print` di globals.css.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Download PDF"
      className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground transition-colors hover:border-brand hover:text-brand hover:bg-muted/40"
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      Download PDF
    </button>
  );
}
