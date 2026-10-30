'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryBadge } from '@/components/ui/category-badge';
import { formatWaktuRelatif } from '@/lib/format';
import { cn } from '@/lib/utils';

const AUTOPLAY_INTERVAL = 5000;
const TOUCH_RESUME_DELAY = 4000;

export interface EconomySlide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  publishedAt: string;
  readTime: number;
  authorName: string;
}

interface EconomySliderProps {
  slides: EconomySlide[];
  className?: string;
}

export function EconomySlider({ slides, className }: EconomySliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const lastSwipeAt = useRef(0);
  const resumeTimer = useRef<number | null>(null);

  const total = slides.length;
  const hasMultiple = total > 1;

  // Geser otomatis tiap 5 detik, berhenti saat pengguna berinteraksi.
  useEffect(() => {
    if (!hasMultiple || autoplayPaused) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setDirection('next');
      setActiveIndex((index) => (index + 1) % total);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(timer);
  }, [hasMultiple, autoplayPaused, total]);

  useEffect(
    () => () => {
      if (resumeTimer.current !== null) {
        window.clearTimeout(resumeTimer.current);
      }
    },
    []
  );

  if (slides.length === 0) return null;

  const active = slides[activeIndex] ?? slides[0];

  const goTo = (index: number, dir: 'next' | 'prev' = 'next') => {
    setDirection(dir);
    setActiveIndex((index + total) % total);
  };

  const next = () => goTo(activeIndex + 1, 'next');
  const prev = () => goTo(activeIndex - 1, 'prev');

  const resumeAutoplayLater = () => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(
      () => setAutoplayPaused(false),
      TOUCH_RESUME_DELAY
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0, 'prev');
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(total - 1, 'next');
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    setAutoplayPaused(true);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;

    const delta =
      (event.changedTouches[0]?.clientX ?? touchStartX.current) -
      touchStartX.current;
    touchStartX.current = null;

    resumeAutoplayLater();

    if (Math.abs(delta) < 40 || !hasMultiple) return;

    lastSwipeAt.current = Date.now();
    if (delta < 0) next();
    else prev();
  };

  return (
    <section
      className={cn('slider border border-border/80', className)}
      aria-labelledby="breaking-ekonomi-title"
      data-direction={direction}
      onMouseEnter={() => setAutoplayPaused(true)}
      onMouseLeave={() => setAutoplayPaused(false)}
      onFocusCapture={() => setAutoplayPaused(true)}
      onBlurCapture={() => setAutoplayPaused(false)}
    >
      <div className="border-b border-white/10 px-5 py-5 sm:px-7 sm:py-6 lg:px-9 bg-black/20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow flex items-center gap-2 text-brand">
              <span
                className="h-1.5 w-1.5 rounded-full bg-brand animate-dot-pulse"
                aria-hidden
              />
              Sorotan pasar
            </p>
            <h2
              id="breaking-ekonomi-title"
              className="mt-2 font-serif text-h2 font-black tracking-tight text-white"
            >
              Breaking Ekonomi
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <p
              className="text-kicker font-extrabold tabular-nums text-white/70"
              aria-hidden
            >
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(total).padStart(2, '0')}
            </p>
            {hasMultiple && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Slide sebelumnya"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white transition-all hover:border-white hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Slide berikutnya"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white transition-all hover:border-white hover:bg-white hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <p id="economy-slider-instructions" className="sr-only">
        Gunakan tombol panah kiri dan kanan untuk berpindah slide. Geser ke
        kiri atau kanan pada layar sentuh.
      </p>

      <div
        className="slider__viewport"
        role="group"
        aria-roledescription="carousel"
        aria-label="Breaking Ekonomi"
        aria-describedby="economy-slider-instructions"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => {
          touchStartX.current = null;
        }}
      >
        <div className="slider__track h-full">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <article
                key={slide.id}
                id={`economy-slide-${slide.id}`}
                className={cn('slider__slide', isActive && 'is-active')}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} dari ${total}`}
                aria-hidden={!isActive}
              >
                <Link
                  href={`/artikel/${slide.slug}`}
                  className="group/slide block h-full"
                  tabIndex={isActive ? 0 : -1}
                  onClick={(event) => {
                    if (Date.now() - lastSwipeAt.current < 500) {
                      event.preventDefault();
                    }
                  }}
                >
                  <div className="slider__media">
                    {failedImages[slide.id] ? (
                      <div
                        className="absolute inset-0 bg-neutral-800"
                        aria-hidden
                      />
                    ) : (
                      <Image
                        src={slide.thumbnailUrl}
                        alt={slide.thumbnailAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
                        className="object-cover transition-transform duration-700 ease-editorial group-hover/slide:scale-[1.03]"
                        priority={index === 0}
                        onError={() =>
                          setFailedImages((previous) => ({
                            ...previous,
                            [slide.id]: true,
                          }))
                        }
                      />
                    )}
                    <div className="slider__overlay" />
                  </div>

                  <div className="slider__content">
                    <div className="mx-auto w-full max-w-[1280px] px-5 pb-8 pt-24 sm:px-7 sm:pb-10 sm:pt-32 lg:px-9 lg:pb-12">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-3">
                          <CategoryBadge slug={slide.category} asLink={false} />
                          <span className="text-kicker font-extrabold uppercase text-white/80">
                            {formatWaktuRelatif(slide.publishedAt)}
                          </span>
                        </div>

                        <h3 className="mt-3 line-clamp-3 font-serif text-3xl font-black leading-[1.05] text-white text-balance sm:text-4xl lg:text-5xl group-hover/slide:text-brand-light transition-colors">
                          {slide.title}
                        </h3>

                        <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                          {slide.excerpt}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-kicker font-extrabold uppercase text-white/75">
                          <span>{slide.authorName}</span>
                          <span aria-hidden>·</span>
                          <span>{slide.readTime} menit baca</span>
                          <span className="ml-auto hidden items-center gap-1.5 text-white transition-colors group-hover/slide:text-brand-light sm:inline-flex">
                            Baca selengkapnya
                            <ArrowRight
                              className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover/slide:translate-x-1"
                              aria-hidden
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 sm:px-7 lg:px-9 bg-black/20">
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Pilih slide Breaking Ekonomi"
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Slide ${index + 1}: ${slide.title}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => goTo(index, index > activeIndex ? 'next' : 'prev')}
              className="group/dot flex h-8 items-center justify-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 ease-editorial',
                  index === activeIndex
                    ? 'w-8 bg-brand'
                    : 'w-2.5 bg-white/30 group-hover/dot:bg-white/60'
                )}
              />
            </button>
          ))}
        </div>

        <Link
          href="/ekonomi"
          className="group inline-flex items-center gap-1.5 text-kicker font-extrabold uppercase text-white/80 transition-colors hover:text-white"
        >
          Semua ekonomi
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1"
            aria-hidden
          />
        </Link>
      </div>

      <p className="sr-only" aria-live="polite">
        Slide {activeIndex + 1} dari {total}: {active.title}
      </p>
    </section>
  );
}
