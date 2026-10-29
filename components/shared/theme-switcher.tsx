'use client';

import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'icon' | 'label';
}

// TODO(theme): implementasi toggle ditunda — hanya UI
export function ThemeSwitcher({ className, variant = 'icon' }: ThemeSwitcherProps) {
  return (
    <button
      type="button"
      aria-label="Ganti mode tampilan (terang/gelap)"
      title="Ganti mode tampilan"
      className={cn(
        'inline-flex items-center gap-2 rounded-full p-2 text-ink transition-colors hover:bg-line-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-teal',
        className,
      )}
      // TODO(theme): onClick handler ditunda — tidak ada logika toggle
    >
      <Sun className="h-5 w-5" aria-hidden />
      {variant === 'label' && (
        <span className="text-sm font-medium text-ink">Light</span>
      )}
      <span className="sr-only">Ganti mode tampilan</span>
      {/* Moon icon ready for dark mode — tidak ditampilkan sampai toggle diaktifkan */}
      <Moon className="hidden h-5 w-5" aria-hidden />
    </button>
  );
}