'use client';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ThemeName = 'light' | 'dark';

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
}

type StartViewTransition = (callback: () => void) => ViewTransitionLike;

const SWITCH_DURATION = 520;
const SWITCH_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const SWITCHING_ATTR = 'data-theme-switching';

interface ThemeSwitcherProps {
  className?: string;
  variant?: 'icon' | 'label';
}

/**
 * Writes the theme to the DOM immediately. next-themes applies its class inside
 * an effect (after paint), which meant the View Transition snapshot was taken
 * before the new colors existed — the circle revealed the old theme and then
 * the page snapped. Applying it inside the transition callback keeps the
 * snapshot and the animation on the same frame.
 */
function applyThemeToDom(theme: ThemeName) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

export function ThemeSwitcher({ className, variant = 'icon' }: ThemeSwitcherProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Optimistic value so the icon / label flip on the very first frame.
  const [pendingTheme, setPendingTheme] = useState<ThemeName | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Drop the optimistic value once next-themes confirms it.
  useEffect(() => {
    if (pendingTheme && resolvedTheme === pendingTheme) setPendingTheme(null);
  }, [pendingTheme, resolvedTheme]);

  const theme: ThemeName =
    pendingTheme ?? (resolvedTheme === 'dark' ? 'dark' : 'light');
  const isDark = theme === 'dark';

  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    // A reveal is already running: ignore the extra click instead of
    // interrupting (and visually breaking) the current transition.
    if (root.hasAttribute(SWITCHING_ATTR)) return;

    const nextTheme: ThemeName = isDark ? 'light' : 'dark';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startViewTransition = (
      document as unknown as { startViewTransition?: StartViewTransition }
    ).startViewTransition;

    setPendingTheme(nextTheme);

    if (!startViewTransition || reduceMotion) {
      applyThemeToDom(nextTheme);
      setTheme(nextTheme);
      return;
    }

    // Use the real pointer position; fall back to the button centre for
    // keyboard activation (detail === 0) or missing coordinates.
    const rect = event.currentTarget.getBoundingClientRect();
    const isPointer = event.detail !== 0;
    const x = isPointer ? event.clientX : rect.left + rect.width / 2;
    const y = isPointer ? event.clientY : rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.setAttribute(SWITCHING_ATTR, 'true');

    let transition: ViewTransitionLike;
    try {
      transition = startViewTransition.call(document, () => {
        applyThemeToDom(nextTheme);
        // flushSync so next-themes persists the choice before the new
        // snapshot is captured, without adding another visual update.
        flushSync(() => setTheme(nextTheme));
      });
    } catch {
      root.removeAttribute(SWITCHING_ATTR);
      applyThemeToDom(nextTheme);
      setTheme(nextTheme);
      return;
    }

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: SWITCH_DURATION,
            easing: SWITCH_EASING,
            fill: 'both',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {
        /* transition skipped — the theme is already applied */
      });

    transition.finished
      .catch(() => {})
      .finally(() => {
        root.removeAttribute(SWITCHING_ATTR);
      });
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Memuat tombol tema"
        disabled
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-full p-2 text-muted-foreground opacity-50',
          className
        )}
      >
        <Sun className="h-4 w-4" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
      title={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
      className={cn(
        'group relative inline-flex items-center gap-2 rounded-full p-2 text-foreground transition-[background-color,color] duration-200 hover:bg-muted hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        className
      )}
    >
      <div className="relative h-5 w-5 flex-shrink-0">
        <Sun
          className={cn(
            'absolute inset-0 h-5 w-5 transition-all duration-300 transform',
            isDark
              ? 'scale-100 rotate-0 text-amber-400 opacity-100'
              : 'scale-0 -rotate-90 opacity-0'
          )}
          aria-hidden
        />
        <Moon
          className={cn(
            'absolute inset-0 h-5 w-5 transition-all duration-300 transform',
            isDark
              ? 'scale-0 rotate-90 opacity-0'
              : 'scale-100 rotate-0 text-foreground group-hover:text-brand opacity-100'
          )}
          aria-hidden
        />
      </div>

      {variant === 'label' && (
        <span className="text-xs font-bold uppercase tracking-wider text-foreground">
          {isDark ? 'Gelap' : 'Terang'}
        </span>
      )}
    </button>
  );
}
