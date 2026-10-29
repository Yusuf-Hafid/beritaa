'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pause, Play, Zap } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/utils';

interface TickerItem {
  id: string;
  slug: string;
  title: string;
}

interface BreakingTickerClientProps {
  items: TickerItem[];
}

export function BreakingTickerClient({ items }: BreakingTickerClientProps) {
  const [paused, setPaused] = useState(false);
  const loop = [...items, ...items];

  return (
    <div
      className="border-b border-line bg-ink text-paper"
      role="region"
      aria-label="Berita breaking"
    >
      <Container>
        <div className="flex items-center gap-3 py-2">
          <div className="flex flex-shrink-0 items-center gap-1.5 rounded-[2px] bg-brand px-2.5 py-1 text-kicker font-extrabold uppercase text-white">
            <span
              className="h-1.5 w-1.5 rounded-full bg-white animate-dot-pulse"
              aria-hidden
            />
            <Zap className="h-3 w-3" aria-hidden />
            Breaking
          </div>

          <div className="ticker-viewport relative flex-1 overflow-hidden">
            <div
              className={cn(
                'ticker-track flex w-max gap-8 whitespace-nowrap sm:gap-10',
                paused && 'is-paused',
              )}
              data-paused={paused}
            >
              {loop.map((article, index) => {
                const isDuplicate = index >= items.length;

                return (
                  <Link
                    key={`${article.id}-${index}`}
                    href={`/artikel/${article.slug}`}
                    aria-hidden={isDuplicate || undefined}
                    tabIndex={isDuplicate ? -1 : undefined}
                    className="text-xs text-paper/90 transition-colors hover:text-brand sm:text-sm"
                  >
                    <span className="mr-2 text-brand" aria-hidden>
                      ›
                    </span>
                    {article.title}
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Lanjutkan ticker berita' : 'Jeda ticker berita'}
            aria-pressed={paused}
            title={paused ? 'Lanjutkan ticker' : 'Jeda ticker'}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-paper/15 bg-paper/5 text-paper/70 transition-colors hover:border-paper/30 hover:bg-paper/10 hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {paused ? (
              <Play className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
        </div>
      </Container>
    </div>
  );
}
