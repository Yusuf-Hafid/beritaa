import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  href?: string;
  linkLabel?: string;
  kicker?: string;
  accentColor?: string;
  id?: string;
  className?: string;
}

export function SectionTitle({
  title,
  href,
  linkLabel = 'Lihat semua',
  kicker,
  accentColor,
  id,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn('border-b border-line pb-3', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          {kicker && (
            <p
              className="eyebrow mb-1.5"
              style={accentColor ? { color: accentColor } : undefined}
            >
              {kicker}
            </p>
          )}
          <div className="flex items-center gap-3">
            <span
              className="h-5 w-1 shrink-0 rounded-full"
              style={accentColor ? { backgroundColor: accentColor } : undefined}
              aria-hidden
            />
            <h2
              id={id}
              className="truncate font-serif text-h2 font-black tracking-tight text-ink"
            >
              {title}
            </h2>
          </div>
        </div>
        {href && (
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center gap-1 pb-0.5 text-kicker font-extrabold uppercase text-teal transition-colors hover:text-brand"
          >
            {linkLabel}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        )}
      </div>
    </div>
  );
}
