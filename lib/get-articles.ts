import { articles as fallbackArticles } from '@/data/articles';
import { categories } from '@/data/categories';
import type { Article, ArticleContent, CategorySlug } from '@/lib/types';
import {
  createAdminClient,
  isSupabaseAdminConfigured,
} from '@/utils/supabase/server';

const ARTICLE_COLUMNS = [
  'id',
  'slug',
  'title',
  'excerpt',
  'content',
  'category',
  'author_id',
  'author_name',
  'published_at',
  'thumbnail_url',
  'thumbnail_hint',
  'tags',
  'is_breaking',
  'is_featured',
].join(',');

const CATEGORY_SLUGS = new Set<string>(categories.map((item) => item.slug));

const DEFAULT_THUMBNAIL =
  'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200';

const DEFAULT_AVATAR =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&q=80&w=96&h=96';

interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: unknown;
  category: string;
  author_id: string | null;
  author_name: string | null;
  published_at: string;
  thumbnail_url: string | null;
  thumbnail_hint: string | null;
  tags: string[] | null;
  is_breaking: boolean | null;
  is_featured: boolean | null;
}

function parseContent(value: unknown): ArticleContent[] {
  let parsed = value;

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  const blocks: ArticleContent[] = [];

  for (const item of parsed) {
    if (!item || typeof item !== 'object') continue;

    const block = item as Record<string, unknown>;
    const type = block.type;

    if (type === 'image') {
      if (typeof block.imageUrl !== 'string' || !block.imageUrl) continue;

      blocks.push({
        type,
        imageUrl: block.imageUrl,
        imageAlt:
          typeof block.imageAlt === 'string' ? block.imageAlt : undefined,
        caption:
          typeof block.caption === 'string' ? block.caption : undefined,
      });
      continue;
    }

    if (
      (type === 'paragraph' || type === 'heading' || type === 'quote') &&
      typeof block.text === 'string' &&
      block.text.trim()
    ) {
      blocks.push({ type, text: block.text.trim() });
    }
  }

  return blocks;
}

function estimateReadTime(content: ArticleContent[], excerpt: string): number {
  const text = [
    ...content.map((block) => block.text ?? block.caption ?? ''),
    excerpt,
  ]
    .join(' ')
    .trim();

  if (!text) return 1;

  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function mapArticleRow(row: ArticleRow): Article | null {
  if (!row.id || !row.slug || !row.title || !row.published_at) return null;

  const category = row.category?.replace(/_/g, '-') as CategorySlug;
  if (!CATEGORY_SLUGS.has(category)) return null;

  const content = parseContent(row.content);
  const excerpt = row.excerpt?.trim() || '';

  if (content.length === 0 && excerpt) {
    content.push({ type: 'paragraph', text: excerpt });
  }

  const tags = (row.tags ?? []).filter(
    (tag): tag is string => typeof tag === 'string' && tag.length > 0,
  );

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt,
    content,
    category,
    author: {
      id: row.author_id ?? `redaksi-${row.id}`,
      name: row.author_name?.trim() || 'Redaksi INDONEWS',
      role: 'Reporter INDONEWS',
      avatarUrl: DEFAULT_AVATAR,
    },
    publishedAt: row.published_at,
    readTime: estimateReadTime(content, excerpt),
    thumbnailUrl: row.thumbnail_url?.trim() || DEFAULT_THUMBNAIL,
    thumbnailAlt: row.thumbnail_hint?.trim() || `Ilustrasi: ${row.title}`,
    tags: tags.length > 0 ? tags : [category],
    isBreaking: Boolean(row.is_breaking),
    isFeatured: Boolean(row.is_featured),
  };
}

/**
 * Gabungkan hasil Supabase dengan seed lokal.
 *
 * Data real selalu di urutan paling atas, lalu dummy hanya ditambahkan jika
 * slug-nya belum ada. Ini menjaga halaman tetap terisi saat tabel masih kosong
 * tanpa menampilkan berita ganda.
 */
function mergeArticles(primary: Article[], fallback: Article[]): Article[] {
  const seen = new Set(primary.map((article) => article.slug));
  return [
    ...primary,
    ...fallback.filter((article) => !seen.has(article.slug)),
  ];
}

/**
 * Homepage data source.
 *
 * Supabase is always tried first, ordered by the newest publication, and the
 * local seed articles are appended after it so the homepage never renders
 * empty. Slugs already returned by Supabase are skipped to avoid duplicates.
 */
export async function getHomepageArticles(): Promise<Article[]> {
  if (!isSupabaseAdminConfigured()) {
    return [...fallbackArticles];
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn('[homepage] Supabase fetch failed:', error.message);
      return [...fallbackArticles];
    }

    const mapped = ((data ?? []) as unknown as ArticleRow[])
      .map((row) => mapArticleRow(row))
      .filter((article): article is Article => article !== null);

    return mergeArticles(mapped, fallbackArticles);
  } catch (error) {
    console.warn(
      '[homepage] Supabase is unavailable:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return [...fallbackArticles];
  }
}

/**
 * Category data source.
 *
 * Filters Supabase by the category slug and keeps the newest story first, then
 * appends the matching seed articles that Supabase did not return. A failed or
 * empty query therefore still leaves the category page populated.
 */
export async function getArticlesByCategory(
  category: string,
): Promise<Article[]> {
  const fallback = fallbackArticles
    .filter((article) => article.category === category)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  if (!isSupabaseAdminConfigured()) {
    return fallback;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .eq('category', category)
      .order('published_at', { ascending: false });

    if (error) {
      console.warn(
        `[category:${category}] Supabase fetch failed:`,
        error.message,
      );
      return fallback;
    }

    const mapped = ((data ?? []) as unknown as ArticleRow[])
      .map((row) => mapArticleRow(row))
      .filter((article): article is Article => article !== null);

    return mergeArticles(mapped, fallback);
  } catch (error) {
    console.warn(
      `[category:${category}] Supabase is unavailable:`,
      error instanceof Error ? error.message : 'unknown error',
    );
    return fallback;
  }
}

/**
 * Detail data source.
 *
 * Resolves one story by slug, preferring Supabase and falling back to the
 * matching seed article. `content` is normalized by `mapArticleRow`, so JSONB
 * blocks reach `ArticleBody` as typed `ArticleContent[]`.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const fallback =
    fallbackArticles.find((article) => article.slug === slug) ?? null;

  if (!isSupabaseAdminConfigured()) {
    return fallback;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.warn(`[article:${slug}] Supabase fetch failed:`, error.message);
      return fallback;
    }

    if (!data) return fallback;

    return mapArticleRow(data as unknown as ArticleRow) ?? fallback;
  } catch (error) {
    console.warn(
      `[article:${slug}] Supabase is unavailable:`,
      error instanceof Error ? error.message : 'unknown error',
    );
    return fallback;
  }
}
