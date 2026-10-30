import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { ArticleCard } from '@/components/news/article-card';
import { Sidebar } from '@/components/news/sidebar';
import { Pagination } from '@/components/news/pagination';
import { getCategory, categories } from '@/data/categories';
import { getArticlesByCategory } from '@/data/articles';
import { cn } from '@/lib/utils';
import type { CategorySlug } from '@/lib/types';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};
  return {
    title: `${category.name} — Berita Terkini`,
    description: category.description,
  };
}

const subTopikMap: Record<string, string[]> = {
  nasional: ['Politik', 'Pemerintahan', 'Daerah', 'Bencana'],
  internasional: ['Diplomasi', 'ASEAN', 'Konflik', 'Bantuan'],
  ekonomi: ['Pasar', 'Bisnis', 'Keuangan', 'UMKM'],
  olahraga: ['Sepak Bola', 'Bulutangkis', 'F1', 'Olimpiade'],
  teknologi: ['Startup', 'AI', 'Gadget', 'Internet'],
  hiburan: ['Film', 'Musik', 'Selebritas', 'Streaming'],
  'gaya-hidup': ['Kesehatan', 'Kuliner', 'Travel', 'Fashion'],
  hukum: ['Putusan', 'Regulasi', 'Advokasi', 'Kriminal'],
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const categoryArticles = getArticlesByCategory(categorySlug);
  const subTopiks = subTopikMap[categorySlug] ?? [];

  return (
    <>
      {/* ── Category hero header ── */}
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          background: `linear-gradient(135deg, hsl(222 24% 8%) 0%, ${category.color} 100%)`,
        }}
      >
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
          }}
          aria-hidden
        />

        <Container>
          <Breadcrumb items={[{ label: category.name }]} />
          <div className="relative pb-10 pt-2">
            {/* Category label */}
            <p className="eyebrow text-white/70">Kategori Berita</p>

            {/* Category name */}
            <h1 className="mt-2 font-serif text-display font-black tracking-tight text-white">
              {category.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/80">
              {category.description}
            </p>

            {/* Sub-topic pills */}
            {subTopiks.length > 0 && (
              <div
                className="mt-6 flex flex-wrap gap-2"
                role="list"
                aria-label="Filter sub-topik"
              >
                {subTopiks.map((topik, idx) => (
                  <Link
                    key={topik}
                    href="#"
                    role="listitem"
                    className={cn(
                      'rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.1em] transition-all',
                      idx === 0
                        ? 'bg-white text-neutral-900 shadow-lg'
                        : 'border border-white/20 text-white/85 hover:bg-white/10'
                    )}
                  >
                    {topik}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* ── Articles + sidebar ── */}
      <Container className="py-12">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Article grid */}
          <div className="lg:col-span-2">
            {categoryArticles.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-16 text-center">
                <p className="text-muted-foreground">
                  Belum ada artikel di kategori ini. Silakan kembali nanti.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  {categoryArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      variant="default"
                    />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination currentPage={1} totalPages={4} />
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
