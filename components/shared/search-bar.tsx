'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategory } from '@/data/categories';
import { formatWaktuRelatif } from '@/lib/format';
import type { SearchIndexItem } from '@/lib/types';

/** Lowercase, strip diacritics, and collapse whitespace so comparisons are stable. */
const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Matches `keyword` only at the start of a word, so "i" finds "Internasional"
 * but not "Teknologi". Multi-word queries ("ekonomi hijau") still match when
 * the phrase begins at any word boundary.
 */
function matchWordPrefix(text: string, keyword: string) {
  if (!text || !keyword) return false;
  const words = normalize(text).split(' ');
  const singleWord = !keyword.includes(' ');
  for (let i = 0; i < words.length; i += 1) {
    const candidate = singleWord ? words[i] : words.slice(i).join(' ');
    if (candidate.startsWith(keyword)) return true;
  }
  return false;
}

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  items?: SearchIndexItem[];
  onClear?: () => void;
  compact?: boolean;
  maxResults?: number;
}

export function SearchBar({
  items = [],
  onClear,
  compact,
  className,
  maxResults = 6,
  onChange,
  onKeyDown,
  onFocus,
  ...props
}: SearchBarProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const keyword = normalize(query);

  const results = useMemo(() => {
    if (!keyword) return [];
    return items
      .filter((item) => {
        const categoryName =
          getCategory(item.category)?.name ?? item.category.replace(/-/g, ' ');
        return (
          matchWordPrefix(item.title, keyword) ||
          matchWordPrefix(categoryName, keyword) ||
          matchWordPrefix(item.category.replace(/-/g, ' '), keyword)
        );
      })
      .slice(0, maxResults);
  }, [items, keyword, maxResults]);

  const isOpen = open && keyword.length > 0;

  // Close the dropdown when clicking outside of the search field.
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const clear = () => {
    setQuery('');
    close();
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative flex items-center', compact ? 'w-10' : 'w-full', className)}
    >
      <Search
        className={cn(
          'pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground transition-opacity',
          compact ? 'opacity-0' : 'opacity-100',
        )}
      />
      <input
        {...props}
        ref={inputRef}
        type="search"
        value={query}
        autoComplete="off"
        placeholder={compact ? '' : 'Cari berita...'}
        aria-label="Cari berita"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
        }
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(-1);
          setOpen(true);
          onChange?.(event);
        }}
        onFocus={(event) => {
          if (keyword) setOpen(true);
          onFocus?.(event);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            if (isOpen) event.preventDefault();
            close();
          } else if (event.key === 'ArrowDown' && results.length > 0) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index + 1) % results.length);
          } else if (event.key === 'ArrowUp' && results.length > 0) {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
          } else if (event.key === 'Enter' && isOpen && activeIndex >= 0) {
            event.preventDefault();
            const target = results[activeIndex];
            if (target) {
              close();
              router.push(`/artikel/${target.slug}`);
            }
          }
          onKeyDown?.(event);
        }}
        className={cn(
          'w-full rounded-full border border-border bg-muted/50 py-1.5 pl-9 pr-9 text-xs text-foreground placeholder:text-muted-foreground transition-all focus:border-brand focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand/20',
          compact && 'cursor-pointer border-transparent bg-transparent',
        )}
      />
      {(query.length > 0 || (onClear && !compact)) && (
        <button
          type="button"
          onClick={clear}
          aria-label="Hapus pencarian"
          className="absolute right-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            'absolute left-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-lift animate-slide-up',
            compact ? 'w-72' : 'right-0',
          )}
        >
          {results.length > 0 ? (
            <ul
              id={listId}
              role="listbox"
              aria-label="Hasil pencarian"
              className="max-h-[22rem] overflow-y-auto py-1"
            >
              {results.map((item, index) => {
                const category = getCategory(item.category);
                return (
                  <li
                    key={item.slug}
                    id={`${listId}-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                  >
                    <Link
                      href={`/artikel/${item.slug}`}
                      onClick={close}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex items-start gap-3 px-3 py-2.5 transition-colors',
                        index === activeIndex ? 'bg-muted' : 'hover:bg-muted/60',
                      )}
                    >
                      <Image
                        src={item.thumbnailUrl}
                        alt=""
                        width={44}
                        height={44}
                        className="h-11 w-11 flex-shrink-0 rounded-md object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          {category && (
                            <span
                              className="text-[0.5rem] font-extrabold uppercase tracking-[0.14em]"
                              style={{ color: category.color }}
                            >
                              {category.name}
                            </span>
                          )}
                          <span className="text-[0.5rem] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                            {formatWaktuRelatif(item.publishedAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 block line-clamp-2 font-serif text-sm font-bold leading-snug text-foreground">
                          {item.title}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="px-4 py-5 text-xs leading-relaxed text-muted-foreground">
              Tidak ada berita yang cocok dengan{' '}
              <span className="font-semibold text-foreground">“{query.trim()}”</span>.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
