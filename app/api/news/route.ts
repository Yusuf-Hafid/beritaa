import { NextResponse } from 'next/server';
import { categories } from '@/data/categories';
import { getNewsFeed, NEWS_REVALIDATE } from '@/lib/gnews';
import type { CategorySlug } from '@/lib/types';

export const revalidate = 600;

const VALID_CATEGORIES = new Set<string>(
  categories.map((category) => category.slug),
);

/**
 * GET /api/news
 *
 * ?category=ekonomi   → berita satu kategori portal (dipetakan ke kategori GNews)
 * ?q=kata+kunci       → pencarian GNews pada judul/isi berita
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q')?.trim() || undefined;

  if (category && !VALID_CATEGORIES.has(category)) {
    return NextResponse.json(
      {
        status: 'error',
        message: `Kategori "${category}" tidak dikenal.`,
        categories: [...VALID_CATEGORIES],
      },
      { status: 400 },
    );
  }

  const { articles, nextPage } = await getNewsFeed({
    category: (category as CategorySlug | null) ?? undefined,
    q,
  });

  return NextResponse.json(
    {
      status: 'success',
      category: category ?? null,
      query: q ?? null,
      total: articles.length,
      nextPage,
      articles,
    },
    {
      headers: {
        'Cache-Control': `public, s-maxage=${NEWS_REVALIDATE}, stale-while-revalidate=120`,
      },
    },
  );
}
