import { Container } from '@/components/ui/container';
import { HeroStory } from '@/components/news/hero-story';
import {
  EconomySlider,
  type EconomySlide,
} from '@/components/news/economy-slider';
import { CategorySection } from '@/components/news/category-section';
import { Sidebar } from '@/components/news/sidebar';
import { MarketDashboard } from '@/components/market-dashboard';
import { Reveal } from '@/components/shared/reveal';
import { getHomepageArticles } from '@/lib/get-articles';
import type { CategorySlug } from '@/lib/types';

export default async function HomePage() {
  const allArticles = await getHomepageArticles();

  if (allArticles.length === 0) {
    return (
      <Container className="py-16">
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Belum ada berita yang bisa ditampilkan saat ini. Silakan muat ulang
            beberapa saat lagi.
          </p>
        </div>
      </Container>
    );
  }

  const featured = allArticles.filter((article) => article.isFeatured);

  const lead = featured[0] ?? allArticles[0];
  const byLatest = [...allArticles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const subStories = byLatest
    .filter((article) => article.id !== lead.id)
    .slice(0, 4);
  const subStoryIds = new Set(subStories.map((article) => article.id));
  const stripStories = byLatest
    .filter(
      (article) =>
        article.id !== lead.id && !subStoryIds.has(article.id),
    )
    .slice(0, 3);

  const homeCategories: CategorySlug[] = [
    'nasional',
    'ekonomi',
    'olahraga',
    'teknologi',
  ];

  const economyArticles = allArticles.filter(
    (article) => article.category === 'ekonomi',
  );
  const economySlides: EconomySlide[] = (
    economyArticles.length > 0 ? economyArticles : allArticles
  )
    .slice(0, 4)
    .map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      thumbnailUrl: article.thumbnailUrl,
      thumbnailAlt: article.thumbnailAlt,
      publishedAt: article.publishedAt,
      readTime: article.readTime,
      authorName: article.author.name,
    }));

  return (
    <>
      {/* ── Hero ── */}
      <section className="pb-4 pt-8 sm:pt-10">
        <Container>
          <Reveal>
            <HeroStory
              lead={lead}
              subStories={subStories}
              stripStories={stripStories}
            />
          </Reveal>
        </Container>
      </section>

      {/* ── Economy Slider ── */}
      <div className="py-12 bg-muted/30 border-y border-border/40">
        <Container>
          <Reveal>
            <EconomySlider slides={economySlides} />
          </Reveal>
        </Container>
      </div>

      {/* ── Market dashboard ── */}
      <div className="border-b border-border/40 py-12">
        <Container>
          <Reveal>
            <MarketDashboard />
          </Reveal>
        </Container>
      </div>

      {/* ── Main content + sidebar ── */}
      <Container className="py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Main categories */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-border">
              {homeCategories.map((slug, index) => (
                <Reveal key={slug} delay={index * 60}>
                  <CategorySection categorySlug={slug} index={index} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <Reveal delay={120}>
                <Sidebar />
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
