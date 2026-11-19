'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { categories } from '@/data/categories';
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';
import {
  createAdminClient,
  type AdminSupabaseClient,
} from '@/utils/supabase/server';
import { parseContent } from './article-content';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_CATEGORIES = new Set<string>(
  categories.map((category) => category.slug)
);
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Accepted MIME types mapped to the extension used in Supabase Storage. */
const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/ogg': 'ogv',
  'video/x-matroska': 'mkv',
};

type CreateArticleResult =
  | { success: true; slug: string }
  | { success: false; error: string };

export type ArticleMutationResult =
  | { success: true }
  | { success: false; error: string };

interface ArticleInput {
  title: string;
  excerpt: string;
  author: string;
  category: string;
  content: string;
  thumbnail: File | null;
}

function isSupportedMedia(type: string): boolean {
  return type.startsWith('image/') || type.startsWith('video/');
}

function extensionFor(type: string): string {
  const known = MIME_EXTENSIONS[type.toLowerCase()];
  if (known) return known;

  const subtype = type.split('/')[1]?.toLowerCase() ?? '';
  return /^[a-z0-9-]+$/.test(subtype) ? subtype : 'bin';
}

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function readArticleInput(formData: FormData): ArticleInput {
  const thumbnail = formData.get('thumbnail');

  return {
    title: readText(formData, 'title'),
    excerpt: readText(formData, 'excerpt'),
    author: readText(formData, 'author'),
    category: readText(formData, 'category'),
    content: readText(formData, 'content'),
    thumbnail:
      thumbnail instanceof File && thumbnail.size > 0 ? thumbnail : null,
  };
}

/** Mengembalikan pesan error pertama, atau null bila seluruh input valid. */
function validateArticleInput(input: ArticleInput): string | null {
  if (input.title.length < 8 || input.title.length > 160) {
    return 'Judul harus terdiri dari 8–160 karakter.';
  }

  if (input.excerpt.length < 20 || input.excerpt.length > 320) {
    return 'Excerpt harus terdiri dari 20–320 karakter.';
  }

  if (input.author.length < 2 || input.author.length > 100) {
    return 'Nama penulis harus terdiri dari 2–100 karakter.';
  }

  if (!ALLOWED_CATEGORIES.has(input.category)) {
    return 'Pilih kategori berita yang valid.';
  }

  if (input.content.length < 40 || input.content.length > 20_000) {
    return 'Konten harus terdiri dari 40–20.000 karakter.';
  }

  return null;
}

function validateMedia(file: File): string | null {
  if (!isSupportedMedia(file.type)) {
    return 'Format file harus gambar atau video.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Ukuran file maksimal 5 MB.';
  }

  return null;
}

async function getAdminSession() {
  const cookieStore = await cookies();

  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
}

function getSupabase():
  | { client: AdminSupabaseClient }
  | { error: string } {
  try {
    return { client: createAdminClient() };
  } catch (error) {
    console.error(
      '[articles] Supabase config error:',
      error instanceof Error ? error.message : 'unknown'
    );

    return {
      error:
        'Konfigurasi server belum lengkap. Tambahkan SUPABASE_SERVICE_ROLE_KEY.',
    };
  }
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function uploadMedia(
  supabase: AdminSupabaseClient,
  file: File,
  slug: string
): Promise<{ path: string; publicUrl: string } | { error: string }> {
  const storagePath = `${Date.now()}-${slug}.${extensionFor(file.type)}`;

  const { error: uploadError } = await supabase.storage
    .from('article-images')
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    console.error('[articles] storage upload failed:', uploadError.message);
    const bucketMissing = uploadError.message
      .toLowerCase()
      .includes('bucket not found');

    return {
      error: bucketMissing
        ? 'Bucket article-images belum tersedia. Buat bucket tersebut terlebih dahulu.'
        : `Gagal mengunggah thumbnail: ${uploadError.message}`,
    };
  }

  const { data } = supabase.storage
    .from('article-images')
    .getPublicUrl(storagePath);

  return { path: storagePath, publicUrl: data.publicUrl };
}

export async function createArticleAction(
  formData: FormData
): Promise<CreateArticleResult> {
  const session = await getAdminSession();

  if (!session) {
    return {
      success: false,
      error: 'Sesi Anda sudah berakhir. Silakan masuk kembali.',
    };
  }

  const input = readArticleInput(formData);
  const validationError = validateArticleInput(input);

  if (validationError) {
    return { success: false, error: validationError };
  }

  if (!input.thumbnail) {
    return { success: false, error: 'Thumbnail wajib diunggah.' };
  }

  const mediaError = validateMedia(input.thumbnail);

  if (mediaError) {
    return { success: false, error: mediaError };
  }

  const blocks = parseContent(input.content);

  if (blocks.length === 0) {
    return { success: false, error: 'Konten berita tidak boleh kosong.' };
  }

  const supabaseResult = getSupabase();

  if ('error' in supabaseResult) {
    return { success: false, error: supabaseResult.error };
  }

  const supabase = supabaseResult.client;
  const baseSlug = slugify(input.title) || `berita-${Date.now().toString(36)}`;
  let slug = baseSlug;

  const { data: existingArticle, error: slugError } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (slugError) {
    console.error('[create-article] slug check failed:', slugError.message);
    return {
      success: false,
      error: 'Gagal memeriksa slug artikel. Silakan coba lagi.',
    };
  }

  if (existingArticle) {
    slug = `${baseSlug}-${Date.now().toString(36).slice(-5)}`;
  }

  const upload = await uploadMedia(supabase, input.thumbnail, slug);

  if ('error' in upload) {
    return { success: false, error: upload.error };
  }

  const { error: insertError } = await supabase.from('articles').insert({
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: blocks,
    category: input.category,
    author_name: input.author,
    source: 'editorial',
    published_at: new Date().toISOString(),
    thumbnail_url: upload.publicUrl,
    thumbnail_hint: `Ilustrasi: ${input.title}`,
    tags: [input.category],
    is_breaking: false,
    is_featured: false,
  });

  if (insertError) {
    await supabase.storage.from('article-images').remove([upload.path]);
    console.error('[create-article] insert failed:', insertError.message);

    if (insertError.code === '23505') {
      return {
        success: false,
        error: 'Slug artikel sudah dipakai. Ubah judul lalu coba lagi.',
      };
    }

    return {
      success: false,
      error: `Gagal menyimpan berita: ${insertError.message}`,
    };
  }

  revalidatePath('/');
  revalidatePath('/admin/dashboard/kelola');

  return { success: true, slug };
}

export async function updateArticleAction(
  id: string,
  formData: FormData
): Promise<ArticleMutationResult> {
  const session = await getAdminSession();

  if (!session) {
    return {
      success: false,
      error: 'Sesi Anda sudah berakhir. Silakan masuk kembali.',
    };
  }

  if (!UUID_PATTERN.test(id)) {
    return { success: false, error: 'ID berita tidak valid.' };
  }

  const input = readArticleInput(formData);
  const validationError = validateArticleInput(input);

  if (validationError) {
    return { success: false, error: validationError };
  }

  if (input.thumbnail) {
    const mediaError = validateMedia(input.thumbnail);

    if (mediaError) {
      return { success: false, error: mediaError };
    }
  }

  const blocks = parseContent(input.content);

  if (blocks.length === 0) {
    return { success: false, error: 'Konten berita tidak boleh kosong.' };
  }

  const supabaseResult = getSupabase();

  if ('error' in supabaseResult) {
    return { success: false, error: supabaseResult.error };
  }

  const supabase = supabaseResult.client;

  const { data: existing, error: fetchError } = await supabase
    .from('articles')
    .select('id, slug, thumbnail_url')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    console.error('[update-article] load failed:', fetchError.message);
    return {
      success: false,
      error: 'Gagal memuat data berita. Silakan coba lagi.',
    };
  }

  if (!existing) {
    return {
      success: false,
      error: 'Berita tidak ditemukan. Mungkin sudah dihapus.',
    };
  }

  let thumbnailUrl = existing.thumbnail_url;
  let uploadedPath: string | null = null;

  if (input.thumbnail) {
    const upload = await uploadMedia(
      supabase,
      input.thumbnail,
      existing.slug ?? id
    );

    if ('error' in upload) {
      return { success: false, error: upload.error };
    }

    thumbnailUrl = upload.publicUrl;
    uploadedPath = upload.path;
  }

  const { error: updateError } = await supabase
    .from('articles')
    .update({
      title: input.title,
      excerpt: input.excerpt,
      content: blocks,
      category: input.category,
      author_name: input.author,
      thumbnail_url: thumbnailUrl,
    })
    .eq('id', id);

  if (updateError) {
    if (uploadedPath) {
      await supabase.storage.from('article-images').remove([uploadedPath]);
    }

    console.error('[update-article] update failed:', updateError.message);
    return {
      success: false,
      error: `Gagal menyimpan perubahan: ${updateError.message}`,
    };
  }

  revalidatePath('/admin/dashboard/kelola');
  revalidatePath(`/admin/dashboard/kelola/${id}`);

  return { success: true };
}

export async function deleteArticleAction(
  id: string
): Promise<ArticleMutationResult> {
  const session = await getAdminSession();

  if (!session) {
    return {
      success: false,
      error: 'Sesi Anda sudah berakhir. Silakan masuk kembali.',
    };
  }

  if (!UUID_PATTERN.test(id)) {
    return { success: false, error: 'ID berita tidak valid.' };
  }

  const supabaseResult = getSupabase();

  if ('error' in supabaseResult) {
    return { success: false, error: supabaseResult.error };
  }

  const supabase = supabaseResult.client;

  const { data: existing, error: fetchError } = await supabase
    .from('articles')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    console.error('[delete-article] load failed:', fetchError.message);
    return {
      success: false,
      error: 'Gagal memeriksa data berita. Silakan coba lagi.',
    };
  }

  if (!existing) {
    return {
      success: false,
      error: 'Berita tidak ditemukan. Mungkin sudah dihapus.',
    };
  }

  const { error: deleteError } = await supabase
    .from('articles')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('[delete-article] delete failed:', deleteError.message);
    return {
      success: false,
      error: `Gagal menghapus berita: ${deleteError.message}`,
    };
  }

  revalidatePath('/admin/dashboard/kelola');

  return { success: true };
}
