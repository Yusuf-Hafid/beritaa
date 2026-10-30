import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Navigasi halaman"
      className={cn('flex items-center justify-center gap-1.5', className)}
    >
      <Link
        href="#"
        aria-label="Halaman sebelumnya"
        className="flex h-9 items-center justify-center rounded-lg border border-border px-3 text-sm text-foreground transition-all hover:border-brand hover:text-brand hover:bg-muted/40"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </Link>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`gap-${idx}`} className="px-2 text-muted-foreground">
            &hellip;
          </span>
        ) : (
          <Link
            key={page}
            href="#"
            aria-label={`Halaman ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-xs font-bold transition-all',
              page === currentPage
                ? 'border-brand bg-brand text-white shadow-sm'
                : 'border-border text-foreground hover:border-brand hover:text-brand hover:bg-muted/40',
            )}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href="#"
        aria-label="Halaman berikutnya"
        className="flex h-9 items-center justify-center rounded-lg border border-border px-3 text-sm text-foreground transition-all hover:border-brand hover:text-brand hover:bg-muted/40"
      >
        <ChevronRight className="h-4 w-4" aria-hidden />
      </Link>
    </nav>
  );
}

function generatePageList(current: number, total: number): (number | string)[] {
  const result: (number | string)[] = [];
  const delta = 1;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      result.push(i);
    } else if (result[result.length - 1] !== '...') {
      result.push('...');
    }
  }

  return result;
}
