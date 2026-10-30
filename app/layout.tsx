import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/providers/theme-provider';

const fontSerif = localFont({
  src: './fonts/fraunces-latin.woff2',
  variable: '--font-serif',
  display: 'swap',
  weight: '400 900',
  style: 'normal',
});

const fontSans = localFont({
  src: './fonts/plus-jakarta-sans-latin.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '400 800',
  style: 'normal',
});

export const metadata: Metadata = {
  title: {
    default: 'INDONEWS — Portal Berita Terkini Indonesia',
    template: '%s | INDONEWS',
  },
  description:
    'INDONEWS adalah portal berita terkini Indonesia yang menyajikan liputan mendalam seputar nasional, internasional, ekonomi, olahraga, teknologi, dan lebih banyak lagi.',
  openGraph: {
    title: 'INDONEWS — Portal Berita Terkini Indonesia',
    description:
      'Liputan mendalam seputar nasional, internasional, ekonomi, olahraga, teknologi, dan lebih banyak lagi.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'INDONEWS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INDONEWS — Portal Berita Terkini Indonesia',
    description:
      'Liputan mendalam seputar nasional, internasional, ekonomi, olahraga, teknologi, dan lebih banyak lagi.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${fontSerif.variable} ${fontSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-background text-foreground antialiased selection:bg-brand/20 selection:text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
