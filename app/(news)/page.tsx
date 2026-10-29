import { Container } from '@/components/ui/container';
import { HeroStory } from '@/components/news/hero-story';
import {
  EconomySlider,
  type EconomySlide,
} from '@/components/news/economy-slider';
import { CategorySection } from '@/components/news/category-section';
import { Sidebar } from '@/components/news/sidebar';
import { Reveal } from '@/components/shared/reveal';
import {
  getFeaturedArticles,
  articles,
} from '@/data/articles';
import type { CategorySlug } from '@/lib/types';

export default function HomePage() {
  const featured = getFeaturedArticles();
  const allArticles = articles;

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

  const economySlideIds = ['a09', 'a04', 'a10', 'a11'];
  const economySlides: EconomySlide[] = economySlideIds.flatMap((id) => {
    const article = allArticles.find((item) => item.id === id);
    if (!article) return [];

    return [
      {
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
      },
    ];
  });

  return (
    <>
      {/* ── Hero ── */}
      <section className="pb-2 pt-8 sm:pt-10">
        <Container>
          <HeroStory
            lead={lead}
            subStories={subStories}
            stripStories={stripStories}
          />
        </Container>
      </section>

      {/* ── Economy Slider ── */}
      <div className="py-10 bg-surface-dim">
        <Container>
          <Reveal>
            <EconomySlider slides={economySlides} />
          </Reveal>
        </Container>
      </div>

      {/* ── Main content + sidebar ── */}
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Main categories */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-line">
              {homeCategories.map((slug, index) => (
                <Reveal key={slug} delay={index * 70}>
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
