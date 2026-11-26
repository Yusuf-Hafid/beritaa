import type { Article, ArticleContent, CategorySlug } from '@/lib/types';

/**
 * Klien berita eksternal portal.
 *
 * Sumber utama adalah RSS dari portal berita Indonesia (Antara, Tempo, CNN
 * Indonesia). RSS dibaca langsung di server, digabung per kategori, lalu
 * dinormalisasi dengan pipeline yang sama. Pencarian memakai NewsAPI.org
 * (`NEWSINDO_API_KEY`) lebih dulu; GNews → NewsAPI → Currents → MediaStack
 * dipakai sebagai cadangan bila RSS kosong atau seluruh feed gagal.
 *
 * Halaman detail artikel Antara, CNN Indonesia, dan Detik diperkaya dari
 * halaman sumber aslinya (dengan cache dan fallback ke ringkasan). Tidak ada
 * artikel, penulis, atau tanggal yang dikarang. Semua API key dibaca di server.
 */

const GNEWS_API = 'https://gnews.io/api/v4';
const NEWSAPI_API = 'https://newsapi.org/v2';

export const NEWS_REVALIDATE = 600;

/** Batas artikel per kategori/pencarian. */
const MAX_ARTICLES = 10;

/**
 * Kategori portal → endpoint GNews (cadangan).
 *
 * GNews tidak punya kategori `politik`, `lifestyle`, atau `hukum`, sehingga:
 * - nasional  → top-headlines `nation`, dibatasi `country=id`
 * - gaya-hidup → top-headlines `health`
 * - hukum     → endpoint search `hukum internasional OR pengadilan`
 *
 * Hanya `nasional` yang memakai `country=id`; tujuh kategori lain sengaja
 * tanpa batas negara agar cakupannya global (tetap `lang=id`).
 */
type FeedTarget =
  | { endpoint: 'top-headlines'; category: string }
  | { endpoint: 'search'; q: string };

export const CATEGORY_FEED: Record<CategorySlug, FeedTarget> = {
  nasional: { endpoint: 'top-headlines', category: 'nation' },
  internasional: { endpoint: 'top-headlines', category: 'world' },
  ekonomi: { endpoint: 'top-headlines', category: 'business' },
  olahraga: { endpoint: 'top-headlines', category: 'sports' },
  teknologi: { endpoint: 'top-headlines', category: 'technology' },
  hiburan: { endpoint: 'top-headlines', category: 'entertainment' },
  'gaya-hidup': { endpoint: 'top-headlines', category: 'health' },
  hukum: { endpoint: 'search', q: 'hukum internasional OR pengadilan' },
};

/**
 * Feed RSS terverifikasi (Nov 2026): satu sampai dua kanal per kategori.
 *
 * - Antara menyediakan kanal XML per topik.
 * - Tempo hanya membuka `/nasional` dan `/bisnis`; kanal lain 403 Cloudflare.
 * - CNN Indonesia memakai satu feed gabungan; item difilter dari segmen
 *   pertama path URL (`/olahraga/`, `/teknologi/`, dst.).
 */
interface RssFeed {
  url: string;
  source: string;
  category: CategorySlug;
  /** Segmen path pertama yang wajib cocok (feed gabungan CNN). */
  section?: string;
  /** Kategori diturunkan dari path URL, bukan dari konfigurasi feed. */
  deriveCategory?: boolean;
}

const CNN_RSS = 'https://www.cnnindonesia.com/rss';

const RSS_CHANNELS: Record<CategorySlug, RssFeed[]> = {
  nasional: [
    {
      url: 'https://www.antaranews.com/rss/politik.xml',
      source: 'Antara News',
      category: 'nasional',
    },
    {
      url: 'https://rss.tempo.co/nasional',
      source: 'Tempo.co',
      category: 'nasional',
    },
  ],
  internasional: [
    {
      url: 'https://www.antaranews.com/rss/dunia-internasional.xml',
      source: 'Antara News',
      category: 'internasional',
    },
    {
      url: CNN_RSS,
      source: 'CNN Indonesia',
      category: 'internasional',
      section: 'internasional',
    },
  ],
  ekonomi: [
    {
      url: 'https://www.antaranews.com/rss/ekonomi.xml',
      source: 'Antara News',
      category: 'ekonomi',
    },
    {
      url: 'https://rss.tempo.co/bisnis',
      source: 'Tempo.co',
      category: 'ekonomi',
    },
  ],
  olahraga: [
    {
      url: 'https://www.antaranews.com/rss/olahraga.xml',
      source: 'Antara News',
      category: 'olahraga',
    },
    {
      url: CNN_RSS,
      source: 'CNN Indonesia',
      category: 'olahraga',
      section: 'olahraga',
    },
  ],
  teknologi: [
    {
      url: 'https://www.antaranews.com/rss/tekno.xml',
      source: 'Antara News',
      category: 'teknologi',
    },
    {
      url: CNN_RSS,
      source: 'CNN Indonesia',
      category: 'teknologi',
      section: 'teknologi',
    },
  ],
  hiburan: [
    {
      url: 'https://www.antaranews.com/rss/hiburan.xml',
      source: 'Antara News',
      category: 'hiburan',
    },
    {
      url: CNN_RSS,
      source: 'CNN Indonesia',
      category: 'hiburan',
      section: 'hiburan',
    },
  ],
  'gaya-hidup': [
    {
      url: 'https://www.antaranews.com/rss/lifestyle.xml',
      source: 'Antara News',
      category: 'gaya-hidup',
    },
    {
      url: CNN_RSS,
      source: 'CNN Indonesia',
      category: 'gaya-hidup',
      section: 'gaya-hidup',
    },
  ],
  hukum: [
    {
      url: 'https://www.antaranews.com/rss/hukum.xml',
      source: 'Antara News',
      category: 'hukum',
    },
  ],
};

/**
 * Pencarian memakai semua kanal unik. Feed gabungan CNN hanya didaftarkan
 * sekali dan kategorinya diturunkan dari path tiap item.
 */
const RSS_SEARCH_FEEDS: RssFeed[] = (() => {
  const seen = new Set<string>();
  const feeds: RssFeed[] = [];

  for (const channel of Object.values(RSS_CHANNELS)) {
    for (const feed of channel) {
      if (seen.has(feed.url)) continue;
      seen.add(feed.url);
      feeds.push(
        feed.url === CNN_RSS
          ? {
              url: feed.url,
              source: feed.source,
              category: 'nasional',
              deriveCategory: true,
            }
          : feed,
      );
    }
  }

  return feeds;
})();

/**
 * Slug artikel eksternal: `<judul>-<8 hex>`.
 * Hash URL dipakai agar id stabil tanpa bergantung pada `article_id` penyedia.
 */
const EXTERNAL_SLUG_PATTERN = /-([0-9a-f]{8})$/i;

interface GNewsRawArticle {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  source?: { name?: string | null; url?: string | null } | null;
}

/** Artikel dari sumber mana pun setelah dinormalisasi ke bentuk internal. */
interface RawArticle {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  image?: string | null;
  publishedAt?: string | null;
  sourceName?: string | null;
  authorName?: string | null;
}

export interface NewsFeedResult {
  articles: Article[];
  /** GNews tidak menyediakan pagination pada paket gratis. */
  nextPage: null;
}

export function isNewsArticleSlug(slug: string): boolean {
  return EXTERNAL_SLUG_PATTERN.test(slug);
}

function apiKey(): string | null {
  const key = process.env.GNEWS_API_KEY?.trim();
  return key ? key : null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 70)
    .replace(/^-|-$/g, '');
}

/** Hash djb2 → 8 karakter hex, stabil antar-render. */
function urlHash(value: string): string {
  let hash = 5381;

  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(index)) >>> 0;
  }

  return hash.toString(16).padStart(8, '0');
}

function cleanText(value?: string | null): string {
  if (!value) return '';

  return value
    .replace(/\[\+?\d+ chars\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Sebagian API mengirim string `"None"`/`"null"` sebagai pengganti nilai kosong. */
function blankToNull(value?: string | null): string | null {
  const trimmed = typeof value === 'string' ? value.trim() : '';

  if (!trimmed || /^(none|null|undefined)$/i.test(trimmed)) return null;

  return trimmed;
}

function normalizeDate(value?: string | null): string | undefined {
  const raw = blankToNull(value);
  if (!raw) return undefined;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/** URL dari Currents kadang dikirim tanpa skema (`kompas.com/...`). */
function withScheme(value?: string | null): string | null {
  const raw = blankToNull(value);
  if (!raw) return null;

  return /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
}

const LEET_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
};

function guardedBody(keyword: string): string {
  // Setiap karakter dipisah pemisah pendek (` `, `-`, `.`, `*`, dst.) agar
  // trik `s l o t` / `max-win` tertangkap, tanpa melompati kata lain.
  return keyword
    .split('')
    .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('[^a-z0-9]{0,3}');
}

function buildGuardedPattern(keyword: string): RegExp {
  // Akhiran angka dibiarkan lolos (`slot88`), tetapi bukan huruf, supaya kata
  // biasa seperti `deposito` tidak ikut tersaring.
  return new RegExp(`(?<![a-z])${guardedBody(keyword)}(?![a-z])`);
}

/** Frasa multi-kata; spasi boleh hilang (`slotgacor`) atau jadi pemisah. */
function buildPhrasePattern(phrase: string): RegExp {
  const body = phrase
    .trim()
    .split(/\s+/)
    .map((word) => guardedBody(word))
    .join('[^a-z0-9]{0,3}');

  return new RegExp(`(?<![a-z])${body}(?![a-z])`);
}

function normalizeForMatch(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/([a-z])([013457]+)(?=[a-z])/g, (match) => {
      const lead = match.charAt(0);
      const digits = match.slice(1);

      return (
        lead +
        [...digits].map((digit) => LEET_MAP[digit] ?? digit).join('')
      );
    });
}

function decodeUrl(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Frasa yang sudah sangat khas judi online. Frasa ini selalu ditolak.
 * Kata ambigu seperti `slot`, `deposit`, `poker`, dan `domino` tidak langsung
 * ditolak agar artikel sah seperti "slot waktu", "deposit bank", atau
 * "Toto Wolff" tetap lolos.
 */
const STRONG_GAMBLING_PHRASES = [
  'gacor',
  'judol',
  'maxwin',
  'togel',
  'sbobet',
  'judi',
  'perjudian',
  'slot online',
  'situs slot',
  'link slot',
  'daftar slot',
  'bandar slot',
  'slot gacor',
  'slot 88',
  'slot 77',
  'slot 99',
  'slot demo',
  'slot mahjong',
  'mahjong ways',
  'mahjong wins',
  'mahjong slot',
  'mahjong gacor',
  'gates of olympus',
  'sweet bonanza',
  'starlight princess',
  'judi online',
  'bandar judi',
  'situs judi',
  'link judi',
  'toto online',
  'bandar toto',
  'toto 4d',
  'poker online',
  'domino online',
  'casino online',
  'kasino online',
  'pragmatic play',
  'scatter hitam',
  'scatter slot',
  'zeus slot',
  'slot zeus',
  'rtp slot',
  'slot rtp',
  'jackpot slot',
  'slot jackpot',
  'bonus slot',
  'slot bonus',
  'bonus deposit',
  'deposit bonus',
  'minimal deposit',
  'deposit pulsa',
  'deposit qris',
  'deposit ovo',
  'deposit gopay',
  'deposit 10rb',
  'deposit 20rb',
  'deposit 50rb',
  'slot deposit',
  'deposit slot',
  'slot pulsa',
  'slot dana',
  'slot qris',
  'anti rungkad',
];

const STRONG_GAMBLING_PATTERNS = STRONG_GAMBLING_PHRASES.map(buildPhrasePattern);

/**
 * Frasa sah yang mengandung kata ambigu. Dibuang sebelum pengecekan agar
 * "slot waktu", "deposit bank", "poker face", dan "efek domino" tidak
 * dianggap judi.
 */
const SAFE_SLOT_PATTERN =
  /(?<![a-z])slot[^a-z0-9]{1,3}(?:waktu|parkir|penerbangan|terbang|anggaran|kebijakan|acara|siaran|produksi|jadwal|jam|ruang|lahan|pekerjaan|posisi|kuota|alokasi|investasi|pembangunan|proyek|tender|kontrak|memori|kartu|sim|usb|ekspansi|pci|server|hardware|perangkat|layanan|bisnis|pasar|regulasi|tarif|biaya|pajak|subsidi|bantuan|distribusi|logistik|energi|listrik|air|jaringan|internet|frekuensi|kanal|program|kelas|ujian|wawancara|terapi|operasi)(?![a-z])/g;

const SAFE_DEPOSIT_PATTERN =
  /(?<![a-z])deposit[^a-z0-9]{1,3}(?:bank|perbankan|fidusia|berjangka|giro|tabungan|nasabah|on[^a-z0-9]{1,3}call|insurance|guarantee|ratio|dana[^a-z0-9]{1,3}pihak[^a-z0-9]{1,3}ketiga|valuta|devisa|penjaminan|simpanan|sertifikat|lps)(?![a-z])/g;

const SAFE_POKER_PATTERN =
  /(?<![a-z])poker[^a-z0-9]{1,3}face(?![a-z])/g;

const SAFE_DOMINO_PATTERN =
  /(?<![a-z])(?:efek|teori)[^a-z0-9]{1,3}domino(?![a-z])|(?<![a-z])domino'?s(?![a-z])|(?<![a-z])domino[^a-z0-9]{1,3}(?:effect|pizza)(?![a-z])/g;

const SLOT_PATTERN = buildGuardedPattern('slot');
const SLOTS_PATTERN = buildGuardedPattern('slots');
const DEPOSIT_PATTERN = buildGuardedPattern('deposit');
const DEPOSITS_PATTERN = buildGuardedPattern('deposits');
const POKER_PATTERN = buildGuardedPattern('poker');
const DOMINO_PATTERN = buildGuardedPattern('domino');
const DOMINOES_PATTERN = buildGuardedPattern('dominoes');

/** Konteks yang membuat `deposit`/`poker`/`domino` jelas mengarah ke judi. */
const GAMBLING_CONTEXT_PATTERNS = [
  'slot',
  'gacor',
  'maxwin',
  'judi',
  'judol',
  'togel',
  'taruhan',
  'bandar',
  'depo',
  'wd',
  'withdraw',
  'spin',
  'putaran',
  'pulsa',
  'qris',
  'dana',
  'ovo',
  'gopay',
  'uang',
  'mahjong',
  'zeus',
  'scatter',
  'rtp',
  'jackpot',
  'casino',
  'kasino',
].map(buildGuardedPattern);

function stripSafePhrases(value: string): string {
  return value
    .replace(SAFE_SLOT_PATTERN, ' ')
    .replace(SAFE_DEPOSIT_PATTERN, ' ')
    .replace(SAFE_POKER_PATTERN, ' ')
    .replace(SAFE_DOMINO_PATTERN, ' ');
}

function hasGamblingSignal(value?: string | null): boolean {
  if (!value) return false;

  const normalized = stripSafePhrases(normalizeForMatch(decodeUrl(value)));

  if (STRONG_GAMBLING_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return true;
  }

  // Sisa `slot` setelah frasa sah dibuang tetap dianggap sinyal judi.
  if (SLOT_PATTERN.test(normalized) || SLOTS_PATTERN.test(normalized)) {
    return true;
  }

  const hasContext = GAMBLING_CONTEXT_PATTERNS.some((pattern) =>
    pattern.test(normalized),
  );
  if (!hasContext) return false;

  return (
    DEPOSIT_PATTERN.test(normalized) ||
    DEPOSITS_PATTERN.test(normalized) ||
    POKER_PATTERN.test(normalized) ||
    DOMINO_PATTERN.test(normalized) ||
    DOMINOES_PATTERN.test(normalized)
  );
}

/** Deteksi kata kunci judi/spam pada satu atau beberapa nilai teks. */
function containsGamblingSignal(
  ...values: (string | null | undefined)[]
): boolean {
  return values.some((value) => hasGamblingSignal(value));
}

/**
 * Validasi URL gambar: hanya `http:`/`https:` absolut yang sehat yang dipakai.
 * URL kosong, tidak valid, non-http, atau terindikasi judi/spam → `null`.
 */
function sanitizeImageUrl(value?: string | null): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  if (!parsed.hostname.includes('.')) return null;

  if (
    containsGamblingSignal(
      parsed.hostname,
      parsed.pathname,
      parsed.search,
    )
  ) {
    return null;
  }

  return parsed.toString();
}

function buildContent(description: string, content: string): ArticleContent[] {
  const blocks: ArticleContent[] = [];
  const normalize = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (description) {
    blocks.push({ type: 'paragraph', text: description });
  }

  content
    .split(/\n+/)
    .map((paragraph) => cleanText(paragraph))
    .filter((paragraph) => paragraph.length >= 40 && paragraph !== description)
    .forEach((paragraph) => {
      // `content` GNews sering mengulang deskripsi di awal kalimat. Bila begitu,
      // simpan versi terpanjang dan jangan tampilkan paragraf kembar.
      const excerptKey = normalize(description).slice(0, 60);
      const repeatsExcerpt =
        excerptKey.length > 0 &&
        (normalize(paragraph).startsWith(excerptKey) ||
          excerptKey.startsWith(normalize(paragraph).slice(0, 60)));

      if (repeatsExcerpt) {
        if (blocks.length > 0 && paragraph.length > description.length) {
          blocks[0] = { type: 'paragraph', text: paragraph };
        }
        return;
      }

      blocks.push({ type: 'paragraph', text: paragraph });
    });

  return blocks;
}

function estimateReadTime(content: ArticleContent[], excerpt: string): number {
  const text = [...content.map((block) => block.text ?? ''), excerpt]
    .join(' ')
    .trim();

  if (!text) return 1;

  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

function cleanSourceName(value?: string | null): string {
  const text = cleanText(value);
  if (!text) return '';

  try {
    return new URL(text).hostname.replace(/^www\./i, '') || text;
  } catch {
    return text;
  }
}

function mapArticle(
  raw: RawArticle,
  fallbackCategory: CategorySlug,
  defaultSource: string,
): Article | null {
  raw = {
    ...raw,
    url: raw.url ? (withScheme(raw.url) ?? undefined) : undefined,
    publishedAt: normalizeDate(raw.publishedAt) ?? undefined,
  };
  const title = cleanText(raw.title);
  const url = raw.url?.trim();
  const publishedAt = raw.publishedAt;

  // Tanggal wajib valid: artikel tanpa waktu terbit dilewati, bukan diberi
  // waktu sekarang sebagai tanggal palsu.
  if (!title || !url || !publishedAt) return null;

  // Buang artikel yang judul, ringkasan, isi, URL, atau gambar sumbernya
  // mengandung indikasi judi online / slot / spam sebelum masuk aplikasi.
  if (
    containsGamblingSignal(
      title,
      raw.description,
      raw.content,
      url,
      raw.image,
    )
  ) {
    return null;
  }

  const excerpt =
    cleanText(raw.description) || cleanText(raw.content).slice(0, 240);
  const content = buildContent(excerpt, raw.content ?? '');

  // Tanpa ringkasan maupun isi, halaman detail akan kosong. Lebih baik
  // dilewati daripada menampilkan artikel tanpa badan berita.
  if (!excerpt && content.length === 0) return null;

  const sourceName = cleanSourceName(raw.sourceName) || defaultSource;
  const authorName = cleanText(raw.authorName) || sourceName;
  const slug = `${slugify(title) || 'berita'}-${urlHash(url)}`;

  const ageHours =
    (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60);

  return {
    id: urlHash(url),
    slug,
    title,
    excerpt,
    content,
    category: fallbackCategory,
    author: {
      id: `source-${urlHash(url)}`,
      name: authorName,
      role: `Sumber: ${sourceName}`,
      avatarUrl: '',
    },
    publishedAt,
    readTime: estimateReadTime(content, excerpt),
    thumbnailUrl: sanitizeImageUrl(raw.image) ?? '',
    thumbnailAlt: title,
    tags: [fallbackCategory],
    isBreaking: ageHours >= 0 && ageHours <= 3,
    isFeatured: false,
    sourceUrl: url,
    sourceName,
  };
}

/** Pemetaan + penyaringan yang sama untuk semua sumber berita. */
function mapArticles(
  raws: RawArticle[],
  category: CategorySlug,
  provider: string,
): Article[] {
  const articles = raws
    .map((raw) => mapArticle(raw, category, provider))
    .filter((article): article is Article => article !== null);

  const dropped = raws.length - articles.length;
  if (dropped > 0) {
    console.warn(
      `[news] ${provider}: ${dropped} artikel disaring (indikasi judi/spam atau data tidak valid) dari ${raws.length}`,
    );
  }

  return articles;
}

interface FeedRequest {
  category?: CategorySlug;
  q?: string;
  sortby?: 'publishedAt' | 'relevance';
}

function resolveTarget(request: FeedRequest): FeedTarget {
  if (request.q) {
    return { endpoint: 'search', q: request.q };
  }

  if (request.category) {
    return CATEGORY_FEED[request.category];
  }

  return { endpoint: 'top-headlines', category: 'general' };
}

/**
 * Memo tingkat proses: komponen yang meminta feed sama dalam satu render
 * berbagi satu hasil, dan kegagalan tidak diulang pada setiap render.
 */
const MEMO_TTL = 60_000;
const FAILURE_TTL = 5 * 60_000;

const feedMemo = new Map<
  string,
  { expiresAt: number; value: NewsFeedResult }
>();

function memoKey(target: FeedTarget, request: FeedRequest): string {
  return target.endpoint === 'top-headlines'
    ? `headlines:${target.category}`
    : `search:${target.q}:${request.sortby ?? 'publishedAt'}`;
}

/* ------------------------------------------------------------------------- *
 * RSS utama
 *
 * Parser sengaja ringan (regex, tanpa dependency) karena feed yang dipakai
 * adalah RSS 2.0 yang stabil. Setiap item tetap melewati `mapArticle`, jadi
 * filter judi/spam dan sanitasi gambar tidak berbeda dari sumber API.
 * ------------------------------------------------------------------------- */

const RSS_HEADERS = {
  accept: 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
  copy: '©',
  reg: '®',
  trade: '™',
  euro: '€',
  pound: '£',
  yen: '¥',
  cent: '¢',
  middot: '·',
  bull: '•',
  deg: '°',
  times: '×',
  divide: '÷',
};

function decodeCodePoint(
  value: string,
  radix: number,
  fallback: string,
): string {
  const codePoint = Number.parseInt(value, radix);

  if (!Number.isFinite(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return fallback;
  }

  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return fallback;
  }
}

/** Lepas CDATA dan decode entity XML/HTML umum tanpa dependency. */
function decodeXmlEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (match, hex: string) =>
      decodeCodePoint(hex, 16, match),
    )
    .replace(/&#(\d+);/g, (match, decimal: string) =>
      decodeCodePoint(decimal, 10, match),
    )
    .replace(
      /&([a-z][a-z0-9]+);/gi,
      (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match,
    );
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function tagContent(block: string, tag: string): string {
  const escaped = escapeRegExp(tag);
  const match = block.match(
    new RegExp(`<${escaped}\\b[^>]*>([\\s\\S]*?)<\\/${escaped}>`, 'i'),
  );

  return match?.[1] ?? '';
}

function tagAttribute(block: string, tag: string, attribute: string): string {
  const tagPattern = new RegExp(`<${escapeRegExp(tag)}\\b([^>]*)>`, 'gi');
  const attributePattern = new RegExp(
    `(?:^|\\s)${escapeRegExp(attribute)}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i',
  );

  for (const match of block.matchAll(tagPattern)) {
    const attributes = match[1] ?? '';
    const attributeMatch = attributePattern.exec(attributes);

    if (attributeMatch) {
      const value =
        attributeMatch[1] ?? attributeMatch[2] ?? attributeMatch[3] ?? '';
      const decoded = decodeXmlEntities(value).trim();

      if (decoded) return decoded;
    }
  }

  return '';
}

/** HTML feed → teks dengan pemisah paragraf, tanpa script/style. */
function htmlToText(value: string): string {
  if (!value) return '';

  const withoutMarkup = decodeXmlEntities(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li|h[1-6]|blockquote|tr|section|article)>/gi, '\n')
    .replace(/<li\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');

  return decodeXmlEntities(withoutMarkup)
    .replace(/[ \t\f\v]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function resolveImageUrl(value: string, baseUrl: string): string | null {
  const raw = decodeXmlEntities(value).trim();
  if (!raw) return null;

  try {
    return sanitizeImageUrl(new URL(raw, baseUrl).toString());
  } catch {
    return null;
  }
}

function firstHtmlImageUrl(html: string, baseUrl: string): string | null {
  if (!html) return null;

  const decoded = decodeXmlEntities(html);
  const sourcePattern =
    /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;

  for (const match of decoded.matchAll(sourcePattern)) {
    const source = match[1] ?? match[2] ?? match[3] ?? '';
    const image = resolveImageUrl(source, baseUrl);

    if (image) return image;
  }

  // Sebagian feed (Tempo) memakai <img>URL</img>, bukan atribut src.
  const innerMatch = decoded.match(/<img\b[^>]*>([\s\S]*?)<\/img>/i);
  if (innerMatch) {
    const inner = htmlToText(innerMatch[1] ?? '');

    if (/^https?:\/\//i.test(inner)) {
      const image = resolveImageUrl(inner, baseUrl);
      if (image) return image;
    }
  }

  return null;
}

function readImage(block: string, link: string): string {
  for (const tag of ['enclosure', 'media:content', 'media:thumbnail']) {
    const image = resolveImageUrl(tagAttribute(block, tag, 'url'), link);
    if (image) return image;
  }

  const direct = htmlToText(tagContent(block, 'img'));
  if (direct) {
    const image = resolveImageUrl(direct, link);
    if (image) return image;
  }

  const description =
    tagContent(block, 'description') || tagContent(block, 'summary');
  const content =
    tagContent(block, 'content:encoded') || tagContent(block, 'content');

  return firstHtmlImageUrl(`${description}\n${content}`, link) ?? '';
}

function extractItems(xml: string): string[] {
  const items = [
    ...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi),
  ].map((match) => match[1] ?? '');

  if (items.length > 0) return items;

  return [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map(
    (match) => match[1] ?? '',
  );
}

function readLink(block: string): string {
  const link = decodeXmlEntities(tagContent(block, 'link')).trim();
  if (link) return link;

  const href = tagAttribute(block, 'link', 'href');
  if (href) return href;

  for (const tag of ['guid', 'id']) {
    const value = decodeXmlEntities(tagContent(block, tag)).trim();
    if (/^https?:\/\//i.test(value)) return value;
  }

  return '';
}

function readDate(block: string): string | undefined {
  for (const tag of ['pubDate', 'published', 'updated', 'dc:date']) {
    const value = normalizeDate(htmlToText(tagContent(block, tag)));
    if (value) return value;
  }

  return undefined;
}

function readAuthor(block: string): string {
  for (const tag of ['dc:creator', 'author']) {
    const value = htmlToText(tagContent(block, tag));
    if (value) return value;
  }

  return '';
}

function itemSection(url: string): string {
  try {
    return new URL(url).pathname.split('/').filter(Boolean)[0] ?? '';
  } catch {
    return '';
  }
}

const CNN_SECTION_CATEGORY: Record<string, CategorySlug> = {
  nasional: 'nasional',
  internasional: 'internasional',
  ekonomi: 'ekonomi',
  olahraga: 'olahraga',
  teknologi: 'teknologi',
  hiburan: 'hiburan',
  'gaya-hidup': 'gaya-hidup',
};

interface ParsedRssItem {
  raw: RawArticle;
  category: CategorySlug;
  source: string;
}

function parseRssFeed(xml: string, feed: RssFeed): ParsedRssItem[] {
  const items: ParsedRssItem[] = [];

  for (const block of extractItems(xml)) {
    const title = htmlToText(tagContent(block, 'title'));
    const link = readLink(block);
    const publishedAt = readDate(block);

    // Tanpa tanggal valid, item dilewati agar tidak memakai waktu sekarang
    // sebagai tanggal palsu.
    if (!title || !link || !publishedAt) continue;

    const section = itemSection(link);
    if (feed.section && section !== feed.section) continue;

    let category = feed.category;
    if (feed.deriveCategory) {
      const derived = CNN_SECTION_CATEGORY[section];
      if (!derived) continue;
      category = derived;
    }

    const description = htmlToText(
      tagContent(block, 'description') || tagContent(block, 'summary'),
    );
    const content = htmlToText(
      tagContent(block, 'content:encoded') || tagContent(block, 'content'),
    );

    items.push({
      raw: {
        title,
        description,
        content,
        url: link,
        image: readImage(block, link),
        publishedAt,
        sourceName: feed.source,
        authorName: readAuthor(block),
      },
      category,
      source: feed.source,
    });
  }

  return items;
}

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchesQuery(article: Article, query: string): boolean {
  const terms = normalizeForSearch(query)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

  if (terms.length === 0) return true;

  const haystack = normalizeForSearch(
    [
      article.title,
      article.excerpt,
      ...article.content.map((block) => block.text ?? ''),
    ].join(' '),
  );

  return terms.every((term) => haystack.includes(term));
}

function mapRssItems(items: ParsedRssItem[], label: string): Article[] {
  const articles: Article[] = [];

  for (const item of items) {
    const article = mapArticle(item.raw, item.category, item.source);
    if (article) articles.push(article);
  }

  const dropped = items.length - articles.length;
  if (dropped > 0) {
    console.warn(
      `[rss] ${label}: ${dropped} artikel disaring (indikasi judi/spam atau data tidak valid) dari ${items.length}`,
    );
  }

  return articles;
}

const rssTextMemo = new Map<
  string,
  { expiresAt: number; promise: Promise<string | null> }
>();

function fetchRssText(url: string): Promise<string | null> {
  const cached = rssTextMemo.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;

  const promise = (async (): Promise<string | null> => {
    try {
      const response = await fetch(url, {
        next: { revalidate: NEWS_REVALIDATE },
        headers: RSS_HEADERS,
        signal: AbortSignal.timeout(6000),
      });

      if (!response.ok) {
        console.warn(`[rss] HTTP ${response.status} untuk ${url}`);
        return null;
      }

      return await response.text();
    } catch (error) {
      console.warn(
        `[rss] gagal mengambil ${url}:`,
        error instanceof Error ? error.message : 'unknown error',
      );
      return null;
    }
  })();

  const entry = { expiresAt: Date.now() + MEMO_TTL, promise };
  rssTextMemo.set(url, entry);

  void promise.then((text) => {
    if (!text && rssTextMemo.get(url) === entry) {
      entry.expiresAt = Date.now() + FAILURE_TTL;
    }
  });

  return promise;
}

async function fetchRssFeed(feed: RssFeed): Promise<ParsedRssItem[]> {
  const xml = await fetchRssText(feed.url);
  if (!xml) return [];

  try {
    return parseRssFeed(xml, feed);
  } catch (error) {
    console.warn(
      `[rss] gagal mem-parsing ${feed.url}:`,
      error instanceof Error ? error.message : 'unknown error',
    );
    return [];
  }
}

async function requestRssFeeds(
  feeds: RssFeed[],
  label: string,
): Promise<Article[]> {
  const results = await Promise.all(feeds.map((feed) => fetchRssFeed(feed)));
  return mapRssItems(results.flat(), label);
}

async function requestRssCategory(category: CategorySlug): Promise<Article[]> {
  const articles = await requestRssFeeds(
    RSS_CHANNELS[category],
    `kategori ${category}`,
  );

  return sortByDate(dedupe(articles)).slice(0, MAX_ARTICLES);
}

async function requestRssAggregate(query?: string): Promise<Article[]> {
  const articles = await requestRssFeeds(
    RSS_SEARCH_FEEDS,
    query ? `pencarian "${query}"` : 'semua kanal',
  );
  const filtered = query
    ? articles.filter((article) => matchesQuery(article, query))
    : articles;

  return sortByDate(dedupe(filtered)).slice(0, MAX_ARTICLES);
}

async function requestRss(request: FeedRequest): Promise<Article[]> {
  if (request.q) return requestRssAggregate(request.q);
  if (request.category) return requestRssCategory(request.category);
  return requestRssAggregate();
}

interface ProviderAttempt {
  articles: Article[];
  /** True bila GNews gagal, tanpa key, atau kosong setelah disaring. */
  needsFallback: boolean;
}

/**
 * GNews membatasi satu request per detik. Fallback kategori dijalankan
 * paralel, jadi request diserialkan agar tidak langsung kena 429.
 */
let gnewsLastRequestAt = 0;

async function throttleGNews(): Promise<void> {
  const wait = 1100 - (Date.now() - gnewsLastRequestAt);
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
  gnewsLastRequestAt = Date.now();
}

async function requestGNews(
  target: FeedTarget,
  request: FeedRequest,
  category: CategorySlug,
): Promise<ProviderAttempt> {
  const key = apiKey();

  if (!key) {
    console.warn('[gnews] GNEWS_API_KEY tidak tersedia di environment');
    return { articles: [], needsFallback: true };
  }

  const url = new URL(`${GNEWS_API}/${target.endpoint}`);
  url.searchParams.set('apikey', key);
  url.searchParams.set('lang', 'id');
  url.searchParams.set('max', String(MAX_ARTICLES));

  // Berita nasional dibatasi ke Indonesia; kategori lain bersifat global.
  if (request.category === 'nasional') {
    url.searchParams.set('country', 'id');
  }

  if (target.endpoint === 'top-headlines') {
    url.searchParams.set('category', target.category);
  } else {
    url.searchParams.set('q', target.q);
    url.searchParams.set('sortby', request.sortby ?? 'publishedAt');
  }

  try {
    await throttleGNews();

    const response = await fetch(url.toString(), {
      next: { revalidate: NEWS_REVALIDATE },
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const reason =
        response.status === 401 || response.status === 403
          ? 'API key GNews tidak valid'
          : response.status === 429
            ? 'kuota/rate limit GNews tercapai'
            : `HTTP ${response.status}`;
      console.warn(`[gnews] ${reason} untuk ${target.endpoint}`);
      return { articles: [], needsFallback: true };
    }

    const payload = (await response.json()) as {
      articles?: GNewsRawArticle[];
      errors?: string[];
    };

    if (!Array.isArray(payload.articles)) {
      const message = payload.errors?.[0] ?? 'respons GNews tidak dikenali';
      console.warn(`[gnews] ${message}`);
      return { articles: [], needsFallback: true };
    }

    const articles = mapArticles(
      payload.articles.map((raw) => ({
        ...raw,
        sourceName: raw.source?.name,
      })),
      category,
      'gnews',
    );

    return { articles, needsFallback: articles.length === 0 };
  } catch (error) {
    console.warn(
      '[gnews] gagal mengambil berita:',
      error instanceof Error ? error.message : 'unknown error',
    );
    return { articles: [], needsFallback: true };
  }
}

/* ------------------------------------------------------------------------- *
 * Sumber cadangan
 *
 * Dipakai hanya saat RSS dan GNews tidak menghasilkan artikel. Setiap artikel
 * melewati `mapArticles` yang sama, sehingga filter judi/spam dan sanitasi
 * gambar tetap berlaku. Kuota cadangan juga kecil, jadi kegagalan sebuah
 * penyedia menutupnya sementara (cooldown) agar tidak boros request.
 * ------------------------------------------------------------------------- */

type FallbackOutcome =
  | { status: 'unavailable' }
  | { status: 'error' }
  | { status: 'ok'; articles: Article[] };

const CURRENTS_API = 'https://api.currentsapi.services/v1';
/** Paket gratis MediaStack tidak melayani HTTPS, jadi endpoint HTTP dipakai. */
const MEDIASTACK_API = 'http://api.mediastack.com/v1/news';

/** Cooldown untuk 429/key ditolak, dan untuk error lain yang mungkin sementara. */
const PROVIDER_COOLDOWN = 60 * 60_000;
const PROVIDER_RETRY = 5 * 60_000;

const providerBlockedUntil = new Map<string, number>();

function isProviderBlocked(provider: string): boolean {
  return (providerBlockedUntil.get(provider) ?? 0) > Date.now();
}

function blockProvider(provider: string, cooldown: number): void {
  providerBlockedUntil.set(provider, Date.now() + cooldown);
}

/* ------------------------------------------------------------------------- *
 * NewsAPI.org (`NEWSINDO_API_KEY`)
 *
 * Plan yang tersedia tidak punya top-headlines Indonesia (country/language
 * `id` selalu kosong), tetapi `everything?language=id` berfungsi. Karena itu
 * NewsAPI dipakai untuk pencarian dan cadangan kategori, bukan feed kategori
 * utama. `content` dari plan ini tetap terpotong; halaman detail Antara/CNN/
 * Detik diperkaya terpisah dari halaman sumber aslinya.
 * ------------------------------------------------------------------------- */

const NEWSAPI_CATEGORY_QUERY: Record<CategorySlug, string> = {
  nasional: 'Indonesia',
  internasional: 'internasional OR dunia OR global',
  ekonomi: 'ekonomi OR bisnis OR investasi OR "pasar modal"',
  olahraga: 'olahraga OR "sepak bola" OR motogp OR bulu tangkis',
  teknologi: 'teknologi OR gadget OR "kecerdasan buatan" OR startup',
  hiburan: 'hiburan OR selebriti OR film OR musik',
  'gaya-hidup': '"gaya hidup" OR kesehatan OR kuliner OR wisata',
  hukum: 'hukum OR pengadilan OR kejaksaan OR "mahkamah agung"',
};

interface NewsApiRawArticle {
  title?: string | null;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  author?: string | null;
  source?: { id?: string | null; name?: string | null } | null;
}

function fromNewsApi(raw: NewsApiRawArticle): RawArticle {
  return {
    title: raw.title,
    description: raw.description,
    content: raw.content,
    url: raw.url,
    image: raw.urlToImage,
    publishedAt: raw.publishedAt,
    sourceName: raw.source?.name,
    authorName: raw.author,
  };
}

function newsApiKey(): string | null {
  // Nama resmi di brief adalah NEWSINDO_API_KEY. Sebagian environment lokal
  // memakai alias NEWSDATA_API_KEY untuk key NewsAPI.org yang sama.
  const key =
    process.env.NEWSINDO_API_KEY?.trim() ||
    process.env.NEWSDATA_API_KEY?.trim();

  return key || null;
}

async function requestNewsApi(
  request: FeedRequest,
  category: CategorySlug,
): Promise<ProviderAttempt> {
  const key = newsApiKey();

  if (!key) {
    console.warn(
      '[newsapi] NEWSINDO_API_KEY/NEWSDATA_API_KEY tidak tersedia di environment',
    );
    return { articles: [], needsFallback: true };
  }

  if (isProviderBlocked('newsapi')) {
    return { articles: [], needsFallback: true };
  }

  const url = new URL(`${NEWSAPI_API}/everything`);
  url.searchParams.set('apiKey', key);
  url.searchParams.set('language', 'id');
  url.searchParams.set('pageSize', String(MAX_ARTICLES));
  url.searchParams.set(
    'sortBy',
    request.sortby === 'relevance' ? 'relevancy' : 'publishedAt',
  );

  if (request.q) {
    url.searchParams.set('q', request.q);
  } else {
    url.searchParams.set('q', NEWSAPI_CATEGORY_QUERY[category]);
    url.searchParams.set('searchIn', 'title,description');

    // Batasi cadangan kategori ke sepekan terakhir agar tidak menyajikan
    // berita lama sebagai feed terkini.
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    url.searchParams.set('from', from);
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: NEWS_REVALIDATE },
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const reason =
        response.status === 401 || response.status === 403
          ? 'API key NewsAPI tidak valid'
          : response.status === 429
            ? 'kuota NewsAPI habis'
            : response.status === 426
              ? 'plan NewsAPI tidak mendukung endpoint ini'
              : `HTTP ${response.status}`;
      console.warn(`[newsapi] ${reason}`);

      const permanent =
        response.status === 401 ||
        response.status === 403 ||
        response.status === 426;
      blockProvider(
        'newsapi',
        permanent || response.status === 429
          ? PROVIDER_COOLDOWN
          : PROVIDER_RETRY,
      );
      return { articles: [], needsFallback: true };
    }

    const payload = (await response.json()) as {
      status?: string;
      articles?: NewsApiRawArticle[];
      code?: string;
      message?: string;
    };

    if (!Array.isArray(payload.articles)) {
      console.warn(
        `[newsapi] ${payload.message ?? 'respons NewsAPI tidak dikenali'}`,
      );
      blockProvider('newsapi', PROVIDER_RETRY);
      return { articles: [], needsFallback: true };
    }

    const articles = mapArticles(
      payload.articles.map(fromNewsApi),
      category,
      'newsapi',
    );

    return { articles, needsFallback: articles.length === 0 };
  } catch (error) {
    console.warn(
      '[newsapi] gagal mengambil berita:',
      error instanceof Error ? error.message : 'unknown error',
    );
    blockProvider('newsapi', PROVIDER_RETRY);
    return { articles: [], needsFallback: true };
  }
}

/** Kategori portal → kategori Currents (tersedia: world, politics, lifestyle, ...). */
const CURRENTS_CATEGORY: Record<CategorySlug, string> = {
  nasional: 'general',
  internasional: 'world',
  ekonomi: 'business',
  olahraga: 'sports',
  teknologi: 'technology',
  hiburan: 'entertainment',
  'gaya-hidup': 'lifestyle',
  hukum: 'politics',
};

interface CurrentsRawArticle {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  published?: string | null;
  author?: string | null;
  source?: string | null;
}

function fromCurrents(raw: CurrentsRawArticle): RawArticle {
  return {
    title: raw.title,
    description: raw.description,
    url: raw.url,
    image: raw.image,
    publishedAt: raw.published,
    sourceName: raw.source ?? raw.author,
    authorName: raw.author,
  };
}

async function fetchCurrentsFeed(
  request: FeedRequest,
  category: CategorySlug,
): Promise<FallbackOutcome> {
  const key = process.env.CURRENTS_API_KEY?.trim();
  if (!key || isProviderBlocked('currents')) return { status: 'unavailable' };

  const url = new URL(`${CURRENTS_API}/${request.q ? 'search' : 'latest-news'}`);
  url.searchParams.set('language', 'id');
  url.searchParams.set('page_size', String(MAX_ARTICLES));

  if (request.q) {
    url.searchParams.set('keywords', request.q);
  } else {
    url.searchParams.set('category', CURRENTS_CATEGORY[category]);
    if (category === 'nasional') url.searchParams.set('country', 'ID');
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: NEWS_REVALIDATE },
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${key}`,
      },
    });

    if (!response.ok) {
      const quota =
        response.status === 429 ||
        response.status === 401 ||
        response.status === 403;
      console.warn(
        `[currents] HTTP ${response.status} — sumber cadangan dilewati`,
      );
      blockProvider('currents', quota ? PROVIDER_COOLDOWN : PROVIDER_RETRY);
      return { status: 'error' };
    }

    const payload = (await response.json()) as {
      status?: string;
      message?: string;
      news?: CurrentsRawArticle[];
    };

    if (!Array.isArray(payload.news)) {
      console.warn(
        `[currents] ${payload.message ?? 'respons tidak dikenali'}`,
      );
      blockProvider('currents', PROVIDER_RETRY);
      return { status: 'error' };
    }

    return {
      status: 'ok',
      articles: mapArticles(payload.news.map(fromCurrents), category, 'currents'),
    };
  } catch (error) {
    console.warn(
      '[currents] gagal mengambil berita:',
      error instanceof Error ? error.message : 'unknown error',
    );
    blockProvider('currents', PROVIDER_RETRY);
    return { status: 'error' };
  }
}

/** MediaStack tidak punya kategori politik/world; `hukum` memakai kata kunci. */
const MEDIASTACK_CATEGORY: Record<CategorySlug, string | null> = {
  nasional: 'general',
  internasional: 'general',
  ekonomi: 'business',
  olahraga: 'sports',
  teknologi: 'technology',
  hiburan: 'entertainment',
  'gaya-hidup': 'health',
  hukum: null,
};

interface MediaStackRawArticle {
  title?: string | null;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  published_at?: string | null;
  author?: string | null;
  source?: string | null;
}

function fromMediaStack(raw: MediaStackRawArticle): RawArticle {
  return {
    title: raw.title,
    description: raw.description,
    url: raw.url,
    image: raw.image,
    publishedAt: raw.published_at,
    sourceName: raw.source ?? raw.author,
    authorName: raw.author,
  };
}

async function fetchMediaStackFeed(
  request: FeedRequest,
  category: CategorySlug,
): Promise<FallbackOutcome> {
  const key = process.env.MEDIASTACK_API_KEY?.trim();
  if (!key || isProviderBlocked('mediastack')) {
    return { status: 'unavailable' };
  }

  const url = new URL(MEDIASTACK_API);
  url.searchParams.set('access_key', key);
  url.searchParams.set('languages', 'id');
  url.searchParams.set('limit', String(MAX_ARTICLES));
  url.searchParams.set('sort', 'published_desc');

  const mapped = MEDIASTACK_CATEGORY[category];
  if (mapped) url.searchParams.set('categories', mapped);
  if (category === 'nasional') url.searchParams.set('countries', 'id');
  if (request.q) url.searchParams.set('keywords', request.q);
  else if (category === 'hukum') url.searchParams.set('keywords', 'hukum');

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: NEWS_REVALIDATE },
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      const quota =
        response.status === 429 ||
        response.status === 401 ||
        response.status === 403;
      console.warn(
        `[mediastack] HTTP ${response.status} — sumber cadangan dilewati`,
      );
      blockProvider(
        'mediastack',
        quota ? PROVIDER_COOLDOWN : PROVIDER_RETRY,
      );
      return { status: 'error' };
    }

    const payload = (await response.json()) as {
      data?: MediaStackRawArticle[];
      error?: { message?: string };
    };

    if (!Array.isArray(payload.data)) {
      console.warn(
        `[mediastack] ${payload.error?.message ?? 'respons tidak dikenali'}`,
      );
      blockProvider('mediastack', PROVIDER_RETRY);
      return { status: 'error' };
    }

    return {
      status: 'ok',
      articles: mapArticles(
        payload.data.map(fromMediaStack),
        category,
        'mediastack',
      ),
    };
  } catch (error) {
    console.warn(
      '[mediastack] gagal mengambil berita:',
      error instanceof Error ? error.message : 'unknown error',
    );
    blockProvider('mediastack', PROVIDER_RETRY);
    return { status: 'error' };
  }
}

const FALLBACK_PROVIDERS: ((
  request: FeedRequest,
  category: CategorySlug,
) => Promise<FallbackOutcome>)[] = [fetchCurrentsFeed, fetchMediaStackFeed];

/** Coba penyedia cadangan berurutan; hasil pertama yang berisi artikel menang. */
async function requestFallback(
  request: FeedRequest,
  category: CategorySlug,
): Promise<Article[]> {
  for (const provider of FALLBACK_PROVIDERS) {
    const outcome = await provider(request, category);
    if (outcome.status === 'ok' && outcome.articles.length > 0) {
      return outcome.articles;
    }
  }

  return [];
}

async function requestFeed(
  request: FeedRequest,
): Promise<NewsFeedResult> {
  const empty: NewsFeedResult = { articles: [], nextPage: null };
  const target = resolveTarget(request);
  const cacheKey = memoKey(target, request);
  const category: CategorySlug = request.category ?? 'nasional';

  const cached = feedMemo.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const remember = (value: NewsFeedResult, ttl: number): NewsFeedResult => {
    feedMemo.set(cacheKey, { expiresAt: Date.now() + ttl, value });
    return value;
  };

  // Pencarian: NewsAPI.org didahulukan, lalu RSS, lalu GNews.
  if (request.q) {
    const newsApi = await requestNewsApi(request, category);
    if (!newsApi.needsFallback) {
      return remember(
        { articles: newsApi.articles, nextPage: null },
        MEMO_TTL,
      );
    }

    const rssArticles = await requestRss(request);
    if (rssArticles.length > 0) {
      return remember({ articles: rssArticles, nextPage: null }, MEMO_TTL);
    }

    const gnews = await requestGNews(target, request, category);
    if (!gnews.needsFallback) {
      return remember({ articles: gnews.articles, nextPage: null }, MEMO_TTL);
    }

    const articles = await requestFallback(request, category);
    if (articles.length > 0) {
      return remember({ articles, nextPage: null }, MEMO_TTL);
    }

    return remember(empty, FAILURE_TTL);
  }

  // Kategori: RSS tetap utama. GNews dipakai lebih dulu karena punya
  // pemetaan kategori asli; NewsAPI menjadi cadangan berikutnya.
  const rssArticles = await requestRss(request);
  if (rssArticles.length > 0) {
    return remember({ articles: rssArticles, nextPage: null }, MEMO_TTL);
  }

  console.warn(
    `[rss] tidak ada artikel untuk ${cacheKey}; fallback ke API ber-key`,
  );

  const gnews = await requestGNews(target, request, category);
  if (!gnews.needsFallback) {
    return remember({ articles: gnews.articles, nextPage: null }, MEMO_TTL);
  }

  const newsApi = await requestNewsApi(request, category);
  if (!newsApi.needsFallback) {
    return remember({ articles: newsApi.articles, nextPage: null }, MEMO_TTL);
  }

  const articles = await requestFallback(request, category);
  if (articles.length > 0) {
    return remember({ articles, nextPage: null }, MEMO_TTL);
  }

  return remember(empty, FAILURE_TTL);
}

/** Feed bebas: filter kategori portal atau kata kunci pencarian. */
export async function getNewsFeed(
  options: { category?: CategorySlug; q?: string } = {},
): Promise<NewsFeedResult> {
  return requestFeed({
    category: options.category,
    q: options.q?.trim() || undefined,
  });
}

/** Sepuluh berita terbaru untuk satu kategori portal. */
export async function getCategoryFeed(
  category: CategorySlug,
): Promise<Article[]> {
  const { articles } = await requestFeed({ category });
  return articles;
}

/** Deduplikasi berdasarkan URL dan judul yang sudah dinormalisasi. */
function dedupe(articles: Article[]): Article[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();

  return articles.filter((article) => {
    const urlKey = (article.sourceUrl ?? '').trim().toLowerCase();
    const titleKey = normalizeForSearch(article.title)
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

    if (urlKey && seenUrls.has(urlKey)) return false;
    if (titleKey && seenTitles.has(titleKey)) return false;

    if (urlKey) seenUrls.add(urlKey);
    if (titleKey) seenTitles.add(titleKey);

    return true;
  });
}

function sortByDate(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Seluruh kategori digabung, urut terbaru, tanpa duplikat. */
export async function getAllNewsArticles(): Promise<Article[]> {
  const slugs = Object.keys(CATEGORY_FEED) as CategorySlug[];
  const feeds = await Promise.all(slugs.map((slug) => getCategoryFeed(slug)));

  return sortByDate(dedupe(feeds.flat()));
}

/** Kata kunci pencarian dari slug `<judul>-<8 hex>`. */
function titleFromSlug(slug: string): string {
  return slug
    .replace(EXTERNAL_SLUG_PATTERN, '')
    .replace(/-/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 12)
    .join(' ');
}

/* ------------------------------------------------------------------------- *
 * Isi penuh halaman detail
 *
 * Hanya Antara, CNN Indonesia, dan Detik yang diizinkan. Halaman sumber
 * diambil sekali per URL (cache 6 jam), lalu paragrafnya diekstrak. Bila
 * gagal, artikel tetap memakai ringkasan asli — tidak ada isi yang dikarang.
 * Tempo sengaja tidak diambil karena halaman artikelnya menolak akses (403).
 * ------------------------------------------------------------------------- */

const FULLTEXT_CACHE_TTL = 6 * 60 * 60_000;
const FULLTEXT_FAILURE_TTL = 15 * 60_000;
const FULLTEXT_MAX_PARAGRAPHS = 30;
const FULLTEXT_MAX_CHARS = 18_000;
const FULLTEXT_MIN_CHARS = 300;

type FullTextSource = 'antara' | 'cnn' | 'detik';

const PAGE_HEADERS = {
  accept: 'text/html,application/xhtml+xml',
  'user-agent': RSS_HEADERS['user-agent'],
};

interface FullTextData {
  content: ArticleContent[];
  authorName?: string;
}

function fullTextSource(url: string): FullTextSource | null {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');

    if (host === 'antaranews.com' || host.endsWith('.antaranews.com')) {
      return 'antara';
    }
    if (host === 'cnnindonesia.com' || host.endsWith('.cnnindonesia.com')) {
      return 'cnn';
    }
    if (host === 'detik.com' || host.endsWith('.detik.com')) {
      return 'detik';
    }
  } catch {
    return null;
  }

  return null;
}

/** Ambil isi `<div>` yang cocok, termasuk seluruh div bersarang di dalamnya. */
function findDivHtml(
  html: string,
  matches: (openingTag: string) => boolean,
): string | null {
  const openingPattern = /<div\b[^>]*>/gi;

  for (const match of html.matchAll(openingPattern)) {
    const openingTag = match[0];
    if (!matches(openingTag)) continue;

    const start = (match.index ?? 0) + openingTag.length;
    const depthPattern = /<\/?div\b[^>]*>/gi;
    depthPattern.lastIndex = start;

    let depth = 1;
    let nested: RegExpExecArray | null;

    while ((nested = depthPattern.exec(html)) !== null) {
      if (/^<\/div/i.test(nested[0])) {
        depth -= 1;
        if (depth === 0) return html.slice(start, nested.index);
      } else {
        depth += 1;
      }
    }
  }

  return null;
}

function extractBodyHtml(
  html: string,
  source: FullTextSource,
): string | null {
  if (source === 'antara') {
    return findDivHtml(html, (tag) =>
      /class=["'][^"']*wrap__article-detail-content[^"']*["']/i.test(tag),
    );
  }

  if (source === 'cnn') {
    return (
      findDivHtml(html, (tag) =>
        /\bid=["']article-content-body["']/i.test(tag),
      ) ??
      findDivHtml(html, (tag) =>
        /class=["'][^"']*detail__body-text[^"']*["']/i.test(tag),
      )
    );
  }

  return (
    findDivHtml(html, (tag) =>
      /class=["'][^"']*detail__body-text[^"']*["']/i.test(tag),
    ) ??
    findDivHtml(html, (tag) =>
      /class=["'][^"']*itp_bodycontent[^"']*["']/i.test(tag),
    )
  );
}

const BOILERPLATE_PARAGRAPH_PATTERNS = [
  /^baca juga\b/i,
  /^simak juga\b/i,
  /^baca berita\b/i,
  /^berita terkait\b/i,
  /^artikel terkait\b/i,
  /^rekomendasi\b/i,
  /^ikuti\b/i,
  /^editor\s*:/i,
  /^penulis\s*:/i,
  /^tags?\s*:/i,
  /^foto\s*:/i,
  /^ilustrasi\s*:/i,
  /^antarafoto\b/i,
  /^scroll to\b/i,
  /^advertisement\b/i,
  /^iklan\b/i,
  /^share\b/i,
  /^bagikan\b/i,
  /^copyright\b/i,
  /^hak cipta\b/i,
  /^download\b/i,
  /^baca selengkapnya\b/i,
  /^simak video\b/i,
  /^video terkait\b/i,
];

function paragraphsFromHtml(html: string): string[] {
  const paragraphs: string[] = [];
  const seen = new Set<string>();

  const add = (value: string): void => {
    const text = cleanText(value);
    if (text.length < 40) return;
    if (
      BOILERPLATE_PARAGRAPH_PATTERNS.some((pattern) => pattern.test(text))
    ) {
      return;
    }
    if (hasGamblingSignal(text)) return;

    const key = normalizeForSearch(text)
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    if (!key || seen.has(key)) return;

    seen.add(key);
    paragraphs.push(text);
  };

  for (const match of html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)) {
    add(htmlToText(match[1] ?? ''));
  }

  if (paragraphs.length === 0) {
    for (const part of htmlToText(html).split(/\n+/)) add(part);
  }

  return paragraphs;
}

const GENERIC_AUTHOR_NAMES = new Set([
  'antaranews.com',
  'antara news',
  'cnn indonesia',
  'cnn indonesia tv',
  'detikcom',
  'detik.com',
  'redaksi',
  'editor',
  'admin',
  'administrator',
]);

function cleanAuthorName(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const text = cleanText(value);
  if (!text || text.length > 80) return null;
  if (/^https?:\/\//i.test(text)) return null;
  if (GENERIC_AUTHOR_NAMES.has(text.toLowerCase())) return null;

  return text;
}

/** Penulis asli dari JSON-LD atau meta halaman; null bila hanya nama penerbit. */
function extractAuthorName(html: string): string | null {
  const scripts = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script[1] ?? '') as unknown;
      const graph =
        parsed && typeof parsed === 'object' && '@graph' in parsed
          ? (parsed as { '@graph'?: unknown })['@graph']
          : undefined;
      const nodes = Array.isArray(parsed)
        ? parsed
        : Array.isArray(graph)
          ? graph
          : [parsed];

      for (const node of nodes) {
        if (!node || typeof node !== 'object') continue;

        const record = node as Record<string, unknown>;
        const type = record['@type'];
        const isArticle = Array.isArray(type)
          ? type.some(
              (item) => typeof item === 'string' && /article/i.test(item),
            )
          : typeof type === 'string' && /article/i.test(type);

        if (!isArticle) continue;

        const author = record.author;
        const first = Array.isArray(author) ? author[0] : author;
        const candidate =
          typeof first === 'string'
            ? cleanAuthorName(first)
            : first && typeof first === 'object'
              ? cleanAuthorName((first as Record<string, unknown>).name)
              : null;

        if (candidate) return candidate;
      }
    } catch {
      // JSON-LD tidak valid; lanjut ke meta author.
    }
  }

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (
      !/(?:name|property)=["'](?:author|article:author)["']/i.test(tag)
    ) {
      continue;
    }

    const candidate = cleanAuthorName(
      tag.match(/content=["']([^"']*)["']/i)?.[1],
    );
    if (candidate) return candidate;
  }

  return null;
}

async function fetchFullTextData(
  url: string,
  source: FullTextSource,
): Promise<FullTextData | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: NEWS_REVALIDATE },
      headers: PAGE_HEADERS,
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.warn(`[fulltext] HTTP ${response.status} untuk ${url}`);
      return null;
    }

    const html = await response.text();
    const bodyHtml = extractBodyHtml(html, source);
    if (!bodyHtml) return null;

    const paragraphs = paragraphsFromHtml(bodyHtml);
    if (paragraphs.length === 0) return null;

    const content: ArticleContent[] = [];
    let totalChars = 0;

    for (const paragraph of paragraphs) {
      if (content.length >= FULLTEXT_MAX_PARAGRAPHS) break;
      if (totalChars + paragraph.length > FULLTEXT_MAX_CHARS) break;

      content.push({ type: 'paragraph', text: paragraph });
      totalChars += paragraph.length;
    }

    if (totalChars < FULLTEXT_MIN_CHARS) return null;

    return {
      content,
      authorName: extractAuthorName(html) ?? undefined,
    };
  } catch (error) {
    console.warn(
      `[fulltext] gagal mengambil ${url}:`,
      error instanceof Error ? error.message : 'unknown error',
    );
    return null;
  }
}

const fullTextMemo = new Map<
  string,
  { expiresAt: number; promise: Promise<FullTextData | null> }
>();

function getFullTextData(
  url: string,
  source: FullTextSource,
): Promise<FullTextData | null> {
  const cached = fullTextMemo.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.promise;

  const promise = fetchFullTextData(url, source);
  const entry = { expiresAt: Date.now() + FULLTEXT_CACHE_TTL, promise };
  fullTextMemo.set(url, entry);

  void promise.then((data) => {
    if (!data) entry.expiresAt = Date.now() + FULLTEXT_FAILURE_TTL;
  });

  if (fullTextMemo.size > 200) {
    const oldest = fullTextMemo.keys().next().value;
    if (oldest) fullTextMemo.delete(oldest);
  }

  return promise;
}

async function enrichArticleWithFullText(article: Article): Promise<Article> {
  const sourceUrl = article.sourceUrl?.trim();
  if (!sourceUrl) return article;

  const source = fullTextSource(sourceUrl);
  if (!source) return article;

  const data = await getFullTextData(sourceUrl, source);
  if (!data) return article;

  const existingChars = article.content
    .map((block) => block.text ?? '')
    .join(' ').length;
  const bodyChars = data.content
    .map((block) => block.text ?? '')
    .join(' ').length;

  if (bodyChars < FULLTEXT_MIN_CHARS || bodyChars <= existingChars) {
    return article;
  }

  const excerpt =
    article.excerpt || (data.content[0]?.text ?? '').slice(0, 240);
  const excerptKey = normalizeForSearch(excerpt).slice(0, 80);
  const content = data.content.filter((block) => {
    const text = normalizeForSearch(block.text ?? '');
    return !excerptKey || !text.startsWith(excerptKey);
  });

  if (content.length === 0) return article;

  return {
    ...article,
    excerpt,
    content,
    author: data.authorName
      ? { ...article.author, name: data.authorName }
      : article.author,
    readTime: estimateReadTime(content, excerpt),
  };
}

/**
 * Detail artikel eksternal.
 *
 * Feed kategori yang sudah ter-cache dicari lebih dulu (tanpa request baru,
 * kategori tetap akurat). Bila belum ada, judul dari slug dipakai sebagai
 * kata kunci pencarian — satu request, tanpa mengarang isi berita.
 *
 * Untuk Antara, CNN Indonesia, dan Detik, isi halaman sumber diambil sekali
 * dan di-cache; bila gagal, ringkasan asli tetap dipakai.
 */
export async function getNewsArticleBySlug(
  slug: string,
): Promise<Article | null> {
  if (!isNewsArticleSlug(slug)) return null;

  const pool = await getAllNewsArticles();
  const cached = pool.find((article) => article.slug === slug);
  if (cached) return enrichArticleWithFullText(cached);

  const query = titleFromSlug(slug);
  if (!query) return null;

  const { articles } = await requestFeed({ q: query, sortby: 'relevance' });
  const found = articles.find((article) => article.slug === slug);
  return found ? enrichArticleWithFullText(found) : null;
}
