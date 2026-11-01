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

const REVEAL_EXPAND_MS = 300;
const SWITCH_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const SWITCHING_ATTR = 'data-theme-switching';
const REVEAL_FAILSAFE_MS = REVEAL_EXPAND_MS + 400;

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

    // Cache every layout read before touching the DOM. Nothing below this
    // block reads geometry again, so the animation cannot thrash layout.
    const rect = event.currentTarget.getBoundingClientRect();
    const isPointer = event.detail !== 0;
    const x = isPointer ? event.clientX : rect.left + rect.width / 2;
    const y = isPointer ? event.clientY : rect.top + rect.height / 2;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const endRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    );

    setPendingTheme(nextTheme);

    if (!startViewTransition || reduceMotion) {
      applyThemeToDom(nextTheme);
      flushSync(() => setTheme(nextTheme));
      return;
    }

    root.setAttribute(SWITCHING_ATTR, 'true');

    let failsafe = 0;
    const cleanup = () => {
      window.clearTimeout(failsafe);
      root.removeAttribute(SWITCHING_ATTR);
    };

    // The circle is a clip opened on the *incoming* root snapshot, so the real
    // content of the new theme expands over the old one. No opaque layer is
    // ever placed above the page, and clipping a top-layer pseudo does not
    // repaint what is underneath - that is what keeps this at 60fps.
    const reveal = () => {
      document.documentElement
        .animate(
          {
            // Viewport coordinates: ::view-transition-new(root) is pinned to the
            // viewport origin, so clientX/clientY map 1:1 onto the circle
            // centre. Both were cached above, so no layout read happens here.
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: REVEAL_EXPAND_MS,
            easing: SWITCH_EASING,
            fill: 'both',
            pseudoElement: '::view-transition-new(root)',
          }
        )
        .finished.then(cleanup)
        .catch(cleanup);
    };

    try {
      const transition = startViewTransition.call(document, () => {
        applyThemeToDom(nextTheme);
        // Force React to commit the next-themes update synchronously so the
        // captured "new" snapshot already carries the target colors.
        flushSync(() => setTheme(nextTheme));
      });

      // Safety net: Web Animation / transition promises can stall (background
      // tab, throttled compositor). Leaving SWITCHING_ATTR behind would freeze
      // every CSS transition on the page for good.
      failsafe = window.setTimeout(cleanup, REVEAL_FAILSAFE_MS);

      transition.ready.then(reveal).catch(cleanup);
      transition.finished.then(cleanup).catch(cleanup);
    } catch {
      applyThemeToDom(nextTheme);
      flushSync(() => setTheme(nextTheme));
      cleanup();
    }
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
            'absolute inset-0 h-5 w-5 transition-[transform,opacity,color] duration-200 transform',
            isDark
              ? 'scale-100 rotate-0 text-amber-400 opacity-100'
              : 'scale-0 -rotate-90 opacity-0'
          )}
          aria-hidden
        />
        <Moon
          className={cn(
            'absolute inset-0 h-5 w-5 transition-[transform,opacity,color] duration-200 transform',
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
