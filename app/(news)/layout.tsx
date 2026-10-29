import type { ReactNode } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { Header } from '@/components/layout/header';
import { BreakingTicker } from '@/components/layout/breaking-ticker';
import { Footer } from '@/components/layout/footer';

export default function NewsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      <TopBar />
      <Header />
      <BreakingTicker />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  );
}