import type { ReactNode } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Header } from '@/components/layout/header';
import { BreakingTicker } from '@/components/layout/breaking-ticker';
import { Footer } from '@/components/layout/footer';
import { getSearchIndex } from '@/data/articles';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      <TopBar />
      <Header searchIndex={getSearchIndex()} />
      <BreakingTicker />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}
