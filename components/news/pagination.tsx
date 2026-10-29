import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  className?: string;
}

// TODO(pagination): hanya UI — belum terhubung ke data dinamis
export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Navigasi halaman"
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <Link
        href="#"
        aria-label="Halaman sebelumnya"
        className="flex h-9 items-center justify-center rounded-md border border-line px-3 text-sm text-ink transition-colors hover:border-teal hover:text-teal"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </Link>

      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`gap-${idx}`} className="px-2 text-muted-warm">
            &hellip;
          </span>
        ) : (
          <Link
            key={page}
            href="#"
            aria-label={`Halaman ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              'flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors',
              page === currentPage
                ? 'border-brand bg-brand text-white'
                : 'border-line text-ink hover:border-teal hover:text-teal',
            )}
          >
            {page}
          </Link>
        ),
      )}

      <Link
        href="#"
        aria-label="Halaman berikutnya"
        className="flex h-9 items-center justify-center rounded-md border border-line px-3 text-sm text-ink transition-colors hover:border-teal hover:text-teal"
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