import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-overlay': 'linear-gradient(to top, hsl(222 18% 6% / 0.95) 0%, hsl(222 18% 6% / 0.5) 55%, hsl(222 18% 6% / 0.08) 100%)',
        'brand-gradient': 'linear-gradient(135deg, hsl(220 90% 50%), hsl(186 96% 45%))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        /* INDONEWS Brand tokens */
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          dark: 'hsl(var(--brand-dark))',
          light: 'hsl(var(--brand-light))',
          foreground: 'hsl(var(--brand-foreground))',
        },
        breaking: {
          DEFAULT: 'hsl(var(--breaking))',
          soft: 'hsl(var(--breaking-soft))',
        },
        ink: {
          DEFAULT: 'hsl(var(--ink))',
          soft: 'hsl(var(--ink-soft))',
        },
        paper: {
          DEFAULT: 'hsl(var(--paper))',
          elevated: 'hsl(var(--paper-elevated))',
        },
        teal: {
          DEFAULT: 'hsl(var(--teal))',
          soft: 'hsl(var(--teal-soft))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          dim: 'hsl(var(--surface-dim))',
        },
        line: {
          DEFAULT: 'hsl(var(--line))',
          soft: 'hsl(var(--line-soft))',
        },
        'muted-warm': 'hsl(var(--muted-warm))',
      },
      fontSize: {
        'display': ['clamp(2.2rem, 1.6rem + 2.8vw, 3.5rem)', { lineHeight: '1.06', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.75rem, 1.3rem + 2vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['clamp(1.5rem, 1.2rem + 1.2vw, 2.125rem)', { lineHeight: '1.18', letterSpacing: '-0.018em' }],
        'h3': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'meta': ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
        'kicker': ['0.625rem', { lineHeight: '1.2', letterSpacing: '0.2em' }],
      },
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': '0 8px 24px hsl(220 14% 8% / 0.12)',
        'header': '0 1px 0 hsl(220 14% 8% / 0.08)',
        'lift': 'var(--shadow-lift)',
        'glow-brand': '0 0 24px hsl(var(--brand) / 0.3)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.4s ease both',
        'slide-up': 'slide-up 0.5s var(--ease-editorial, cubic-bezier(0.22,1,0.36,1)) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
