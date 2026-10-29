import type { ArticleContent } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ArticleBodyProps {
  content: ArticleContent[];
  className?: string;
}

export function ArticleBody({ content, className }: ArticleBodyProps) {
  return (
    <div className={cn('prose-indonews space-y-6', className)}>
      {content.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={idx} className="font-serif text-2xl font-bold text-ink leading-snug tracking-tight">
                {block.text}
              </h2>
            );
          case 'paragraph':
            return (
              <p key={idx} className="text-[1.0625rem] leading-[1.82] text-ink-soft">
                {block.text}
              </p>
            );
          case 'quote':
            return (
              <blockquote
                key={idx}
                className="relative border-l-[3px] border-brand bg-surface-dim pl-6 pr-4 py-4 rounded-r-xl"
              >
                <p className="font-serif text-xl font-semibold italic text-ink leading-snug">
                  &ldquo;{block.text}&rdquo;
                </p>
              </blockquote>
            );
          case 'image':
            return (
              <figure key={idx} className="space-y-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.imageUrl}
                  alt={block.imageAlt ?? ''}
                  className="w-full rounded-xl shadow-card"
                  loading="lazy"
                />
                {block.caption && (
                  <figcaption className="text-center text-xs text-muted-warm">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}