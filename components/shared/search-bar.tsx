'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  compact?: boolean;
}

export function SearchBar({ onClear, compact, className, ...props }: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', compact ? 'w-10' : 'w-full', className)}>
      <Search
        className={cn(
          'pointer-events-none absolute left-3 h-4 w-4 text-muted-warm transition-opacity',
          compact ? 'opacity-0' : 'opacity-100',
        )}
      />
      <input
        type="search"
        placeholder={compact ? '' : 'Cari berita...'}
        aria-label="Cari berita"
        className={cn(
          'w-full rounded-full border border-line bg-paper-elevated py-2 pl-9 pr-9 text-sm text-ink placeholder:text-muted-warm transition-colors focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal',
          compact && 'cursor-pointer border-transparent bg-transparent',
        )}
        {...props}
      />
      {onClear && !compact && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Hapus pencarian"
          className="absolute right-3 text-muted-warm hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}