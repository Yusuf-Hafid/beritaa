'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { Container } from '@/components/ui/container';

interface TickerItem {
  id: string;
  slug: string;
  title: string;
}

interface BreakingTickerClientProps {
  items: TickerItem[];
}

export function BreakingTickerClient({ items }: BreakingTickerClientProps) {
  const loop = [...items, ...items, ...items];

  return (
    <div
      className="border-b border-border bg-ink text-paper"
      role="region"
      aria-label="Berita breaking"
    >
      <Container>
        <div className="flex items-center gap-3 py-2">
          <div className="flex flex-shrink-0 items-center gap-1.5 rounded-[4px] bg-brand px-2.5 py-1 text-kicker font-extrabold uppercase text-white shadow-sm">
            <span
              className="h-1.5 w-1.5 rounded-full bg-white animate-dot-pulse"
              aria-hidden
            />
            <Zap className="h-3 w-3" aria-hidden />
            <span>Breaking</span>
          </div>

          <div className="ticker-viewport relative flex-1 overflow-hidden">
            <div className="ticker-track flex w-max gap-8 whitespace-nowrap sm:gap-10">
              {loop.map((article, index) => {
                const isDuplicate = index >= items.length;

                return (
                  <Link
                    key={`${article.id}-${index}`}
                    href={`/artikel/${article.slug}`}
                    aria-hidden={isDuplicate || undefined}
                    tabIndex={isDuplicate ? -1 : undefined}
                    className="text-xs text-paper/90 transition-colors hover:text-brand sm:text-sm font-medium"
                  >
                    <span className="mr-2 text-brand font-bold" aria-hidden>
                      ›
                    </span>
                    {article.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
