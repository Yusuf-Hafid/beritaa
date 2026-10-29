import { getBreakingArticles } from '@/data/articles';
import { BreakingTickerClient } from '@/components/layout/breaking-ticker-client';

export function BreakingTicker() {
  const breakingNews = getBreakingArticles();
  if (breakingNews.length === 0) return null;

  const items = breakingNews.map(({ id, slug, title }) => ({
    id,
    slug,
    title,
  }));

  return <BreakingTickerClient items={items} />;
}
