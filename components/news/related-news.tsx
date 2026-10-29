import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { SectionTitle } from '@/components/ui/section-title';
import { ArticleCard } from '@/components/news/article-card';
import type { Article } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RelatedNewsProps {
  articles: Article[];
  className?: string;
}

export function RelatedNews({ articles, className }: RelatedNewsProps) {
  if (articles.length === 0) return null;

  return (
    <section className={cn('py-10', className)} aria-label="Berita terkait">
      <Container>
        <SectionTitle
          title="Berita Terkait"
          kicker="Baca juga"
          accentColor="hsl(202 58% 25%)"
        />
        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" />
          ))}
        </div>
      </Container>
    </section>
  );
}