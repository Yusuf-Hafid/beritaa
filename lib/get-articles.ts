import { categories } from '@/data/categories';
import type {
  Article,
  ArticleContent,
  CategorySlug,
  SearchIndexItem,
} from '@/lib/types';
import {
  getAllNewsArticles,
  getCategoryFeed,
  getNewsArticleBySlug,
  isNewsArticleSlug,
} from '@/lib/gnews';
import {
  createAdminClient,
  isSupabaseAdminConfigured,
} from '@/utils/supabase/server';

/**
 * Sumber data portal.
 *
 * 1. Supabase — artikel yang ditulis redaksi lewat dashboard admin.
 * 2. GNews API — pasokan berita terkini dari seluruh kategori.
 *
 * Tidak ada lagi artikel statis/dummy: kalau kedua sumber kosong, halaman
 * menampilkan empty state, bukan berita contoh.
 */

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

/** Artikel tulisan redaksi dari Supabase (kosong bila belum dikonfigurasi). */
async function getEditorialArticles(
  category?: CategorySlug,
): Promise<Article[]> {
  if (!isSupabaseAdminConfigured()) return [];

  try {
    const supabase = createAdminClient();
    const base = supabase
      .from('articles')
      .select(ARTICLE_COLUMNS)
      .order('published_at', { ascending: false });

    const { data, error } = category
      ? await base.eq('category', category)
      : await base;

    if (error) {
      console.warn('[articles] Supabase fetch failed:', error.message);
      return [];
    }

    return ((data ?? []) as unknown as ArticleRow[])
      .map((row) => mapArticleRow(row))
      .filter((article): article is Article => article !== null);
  } catch (error) {
    console.warn(
      '[articles] Supabase is unavailable:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return [];
  }
}

function mergeArticles(primary: Article[], secondary: Article[]): Article[] {
  const seen = new Set(primary.map((article) => article.slug));

  return [
    ...primary,
    ...secondary.filter((article) => !seen.has(article.slug)),
  ];
}

function sortByDate(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Beranda: tulisan redaksi didahulukan, sisanya berita GNews terbaru.
 * Tiga artikel teratas ditandai featured untuk hero & slider.
 */
export async function getHomepageArticles(): Promise<Article[]> {
  const [editorial, news] = await Promise.all([
    getEditorialArticles(),
    getAllNewsArticles(),
  ]);

  const merged = sortByDate(mergeArticles(editorial, news));

  return merged.map((article, index) => ({
    ...article,
    isFeatured: article.isFeatured || index < 3,
  }));
}

/** Semua artikel satu kategori: redaksi + GNews, urut terbaru. */
export async function getArticlesByCategory(
  category: CategorySlug,
): Promise<Article[]> {
  const [editorial, news] = await Promise.all([
    getEditorialArticles(category),
    getCategoryFeed(category),
  ]);

  return sortByDate(mergeArticles(editorial, news));
}

/** Seluruh artikel untuk halaman arsip & indeks pencarian. */
export async function getAllArticles(): Promise<Article[]> {
  const [editorial, news] = await Promise.all([
    getEditorialArticles(),
    getAllNewsArticles(),
  ]);

  return sortByDate(mergeArticles(editorial, news));
}

/**
 * Detail artikel.
 *
 * Slug berakhiran hash GNews diambil dari pool feed yang sudah ter-cache;
 * slug lain dicari di Supabase lalu di pool berita yang sudah ter-cache.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (isNewsArticleSlug(slug)) {
    const article = await getNewsArticleBySlug(slug);
    if (article) return article;
  }

  if (isSupabaseAdminConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('articles')
        .select(ARTICLE_COLUMNS)
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.warn(`[article:${slug}] Supabase fetch failed:`, error.message);
      } else if (data) {
        const mapped = mapArticleRow(data as unknown as ArticleRow);
        if (mapped) return mapped;
      }
    } catch (error) {
      console.warn(
        `[article:${slug}] Supabase is unavailable:`,
        error instanceof Error ? error.message : 'unknown error',
      );
    }
  }

  const pool = await getAllNewsArticles();
  return pool.find((article) => article.slug === slug) ?? null;
}

/** Berita terkait dari kategori yang sama, dilengkapi kategori lain. */
export async function getRelatedArticles(
  article: Article,
  limit = 4,
): Promise<Article[]> {
  const [sameCategory, latest] = await Promise.all([
    getArticlesByCategory(article.category),
    getAllNewsArticles(),
  ]);

  const related = sameCategory.filter((item) => item.slug !== article.slug);
  const seen = new Set(related.map((item) => item.slug));

  for (const item of latest) {
    if (related.length >= limit) break;
    if (item.slug === article.slug || seen.has(item.slug)) continue;
    seen.add(item.slug);
    related.push(item);
  }

  return related.slice(0, limit);
}

/** Breaking ticker: berita < 3 jam, atau 6 terbaru bila tidak ada. */
export async function getBreakingArticles(): Promise<Article[]> {
  const all = await getAllArticles();
  const breaking = all.filter((article) => article.isBreaking);

  return (breaking.length > 0 ? breaking : all).slice(0, 6);
}

/**
 * Sidebar "Terpopuler".
 *
 * GNews tidak menyediakan metrik pembaca, jadi daftar diurutkan
 * dari berita terbaru lintas kategori.
 */
export async function getPopularArticles(limit = 5): Promise<Article[]> {
  const all = await getAllArticles();
  return all.slice(0, limit);
}

/** Indeks pencarian header, dibangun dari artikel nyata. */
export async function getSearchIndex(): Promise<SearchIndexItem[]> {
  const all = await getAllArticles();

  return all.slice(0, 80).map((article) => ({
    slug: article.slug,
    title: article.title,
    category: article.category,
    publishedAt: article.publishedAt,
    thumbnailUrl: article.thumbnailUrl,
  }));
}

/** Empat berita terbaru per kategori untuk mega menu header. */
export async function getMegaMenuArticles(): Promise<
  Record<string, Article[]>
> {
  const entries = await Promise.all(
    categories.map(async (category) => {
      const articles = await getArticlesByCategory(category.slug);
      return [category.slug, articles.slice(0, 4)] as const;
    }),
  );

  return Object.fromEntries(entries);
}
