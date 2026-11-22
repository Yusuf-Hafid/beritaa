import { getBreakingArticles } from '@/lib/get-articles';
import { BreakingTickerClient } from '@/components/layout/breaking-ticker-client';

export async function BreakingTicker() {
  const breakingNews = await getBreakingArticles();
  if (breakingNews.length === 0) return null;

  const items = breakingNews.map(({ id, slug, title }) => ({
    id,
    slug,
    title,
  }));

  return <BreakingTickerClient items={items} />;
}
