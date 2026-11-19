'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, Loader2, Save, Send, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { categories } from '@/data/categories';
import {
  FloatingInput,
  FloatingTextarea,
} from '@/app/admin/_components/floating-field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { createArticleAction, updateArticleAction } from './actions';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const VIDEO_URL_PATTERN = /\.(mp4|webm|mov|ogv|ogg|mkv)(?:[?#]|$)/i;

export interface ArticleFormValues {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  category: string;
  content: string;
  thumbnailUrl: string | null;
}

interface ArticleFormProps {
  mode?: 'create' | 'edit';
  initialValues?: ArticleFormValues;
}

export function ArticleForm({
  mode = 'create',
  initialValues,
}: ArticleFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit' && Boolean(initialValues);
  const existingThumbnailUrl = initialValues?.thumbnailUrl ?? null;

  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    clearError('thumbnail');

    if (!file) {
      setFileName(null);
      setPreviewType(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      event.target.value = '';
      setFileName(null);
      setPreviewType(null);
      setPreviewUrl(null);
      setErrors((current) => ({
        ...current,
        thumbnail: 'Format file harus gambar atau video.',
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      event.target.value = '';
      setFileName(null);
      setPreviewType(null);
      setPreviewUrl(null);
      setErrors((current) => ({
        ...current,
        thumbnail: 'Ukuran file maksimal 5 MB.',
      }));
      return;
    }

    setFileName(file.name);
    setPreviewType(file.type);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearFile() {
    if (fileInputRef.current) fileInputRef.current.value = '';
    setFileName(null);
    setPreviewType(null);
    setPreviewUrl(null);
    clearError('thumbnail');
  }

  function resetForm() {
    formRef.current?.reset();
    setCategory('');
    setFileName(null);
    setPreviewType(null);
    setPreviewUrl(null);
    setErrors({});
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pending) return;

    const form = formRef.current;

    if (!form) return;

    const formData = new FormData(form);
    const title = String(formData.get('title') ?? '').trim();
    const excerpt = String(formData.get('excerpt') ?? '').trim();
    const author = String(formData.get('author') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const thumbnail = formData.get('thumbnail');
    const hasNewThumbnail =
      thumbnail instanceof File && thumbnail.size > 0;

    const nextErrors: Record<string, string> = {};

    if (title.length < 8) {
      nextErrors.title = 'Judul minimal 8 karakter.';
    }

    if (excerpt.length < 20) {
      nextErrors.excerpt = 'Excerpt minimal 20 karakter.';
    }

    if (author.length < 2) {
      nextErrors.author = 'Nama penulis minimal 2 karakter.';
    }

    if (!category) {
      nextErrors.category = 'Pilih kategori berita.';
    }

    if (content.length < 40) {
      nextErrors.content = 'Konten minimal 40 karakter.';
    }

    if (!hasNewThumbnail && !existingThumbnailUrl) {
      nextErrors.thumbnail = 'Thumbnail wajib diunggah.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Lengkapi data yang ditandai.');
      return;
    }

    setPending(true);

    try {
      const result =
        isEdit && initialValues
          ? await updateArticleAction(initialValues.id, formData)
          : await createArticleAction(formData);

      if (!result.success) {
        toast.error(
          isEdit ? 'Berita gagal diperbarui' : 'Berita gagal di-upload',
          { description: result.error }
        );
        return;
      }

      if (isEdit) {
        toast.success('Berita berhasil diperbarui', {
          description: `“${title}” sudah disimpan.`,
        });
        router.push('/admin/dashboard/kelola');
        return;
      }

      toast.success('Berita berhasil di-upload', {
        description: `“${title}” sudah tersimpan di database.`,
      });
      resetForm();
    } catch {
      toast.error(
        isEdit ? 'Berita gagal diperbarui' : 'Berita gagal di-upload',
        {
          description:
            'Terjadi kesalahan tak terduga. Silakan coba lagi.',
        }
      );
    } finally {
      setPending(false);
    }
  }

  const hasExistingVideo = existingThumbnailUrl
    ? VIDEO_URL_PATTERN.test(existingThumbnailUrl)
    : false;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      className="space-y-6"
    >
      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <SectionHeading
          step="01"
          title="Informasi berita"
          description="Detail utama yang akan tampil di halaman publik."
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FloatingInput
              label="Judul berita"
              name="title"
              required
              maxLength={160}
              defaultValue={initialValues?.title}
              error={errors.title}
              onChange={() => clearError('title')}
              disabled={pending}
            />
          </div>

          <div className="sm:col-span-2">
            <FloatingTextarea
              label="Excerpt / ringkasan"
              name="excerpt"
              required
              rows={3}
              maxLength={320}
              defaultValue={initialValues?.excerpt}
              error={errors.excerpt}
              hint="Satu sampai dua kalimat ringkas untuk kartu berita."
              onChange={() => clearError('excerpt')}
              disabled={pending}
            />
          </div>

          <FloatingInput
            label="Nama penulis"
            name="author"
            required
            maxLength={100}
            defaultValue={initialValues?.authorName}
            error={errors.author}
            onChange={() => clearError('author')}
            disabled={pending}
          />

          <div className="relative w-full">
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                clearError('category');
              }}
              onOpenChange={setCategoryOpen}
            >
              <SelectTrigger
                id="category"
                aria-required="true"
                aria-invalid={errors.category ? true : undefined}
                aria-describedby={
                  errors.category ? 'category-error' : undefined
                }
                className={cn(
                  'peer h-12 w-full rounded-xl border-input bg-card px-4 text-left text-sm shadow-sm ring-offset-0 focus:border-brand focus:ring-2 focus:ring-brand/20',
                  errors.category &&
                    'border-destructive focus:border-destructive focus:ring-destructive/20'
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.slug} value={item.slug}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label
              htmlFor="category"
              className={cn(
                'pointer-events-none absolute left-3 z-10 origin-left px-1 text-sm font-medium text-muted-foreground transition-all duration-200 ease-editorial motion-reduce:transition-none',
                categoryOpen || category
                  ? 'top-0 -translate-y-1/2 bg-card text-xs font-semibold text-brand'
                  : 'top-1/2 -translate-y-1/2'
              )}
            >
              Kategori
              <span aria-hidden className="ml-0.5 text-brand">
                *
              </span>
            </label>

            <input type="hidden" name="category" value={category} />

            {errors.category && (
              <p
                id="category-error"
                role="alert"
                className="mt-1.5 text-xs text-destructive"
              >
                {errors.category}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <SectionHeading
          step="02"
          title="Isi berita"
          description="Tulis konten dengan struktur yang mudah dibaca."
        />

        <div className="mt-6">
          <FloatingTextarea
            label="Konten berita"
            name="content"
            required
            rows={12}
            maxLength={20_000}
            defaultValue={initialValues?.content}
            error={errors.content}
            hint="Pisahkan paragraf dengan baris kosong. Awali baris dengan ## untuk subjudul dan > untuk kutipan."
            onChange={() => clearError('content')}
            disabled={pending}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <SectionHeading
          step="03"
          title="Thumbnail"
          description="Gunakan gambar atau video rasio 16:9 agar tampil optimal di semua kartu."
        />

        <div className="mt-6">
          <label
            htmlFor={fileInputId}
            className={cn(
              'group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors duration-200 hover:border-brand/50 hover:bg-brand/5 focus-within:ring-2 focus-within:ring-brand/20 motion-reduce:transition-none',
              errors.thumbnail &&
                'border-destructive/70 bg-destructive/5 hover:border-destructive/70',
              pending && 'pointer-events-none opacity-60'
            )}
          >
            {previewUrl ? (
              <div className="w-full">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-background">
                  {previewType?.startsWith('video/') ? (
                    <video
                      src={previewUrl}
                      muted
                      playsInline
                      controls
                      preload="metadata"
                      aria-label="Pratinjau video berita"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Pratinjau thumbnail berita"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="mt-3 truncate text-sm font-semibold">
                  {fileName}
                </p>
                <p className="mt-1 cursor-pointer text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:text-brand-dark motion-reduce:transition-none">
                  Klik untuk mengganti file
                </p>
              </div>
            ) : existingThumbnailUrl ? (
              <div className="w-full">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-background">
                  {hasExistingVideo ? (
                    <video
                      src={existingThumbnailUrl}
                      muted
                      playsInline
                      controls
                      preload="metadata"
                      aria-label="Thumbnail video berita saat ini"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={existingThumbnailUrl}
                      alt="Thumbnail berita saat ini"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </div>
                <p className="mt-3 text-xs font-semibold text-muted-foreground">
                  Thumbnail saat ini
                </p>
                <p className="mt-1 cursor-pointer text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:text-brand-dark motion-reduce:transition-none">
                  Klik untuk mengganti file
                </p>
              </div>
            ) : (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <ImagePlus className="h-6 w-6" aria-hidden />
                </span>
                <span className="mt-4 text-sm font-semibold">
                  Klik untuk memilih thumbnail
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  Format gambar atau video (Maksimal 5 MB)
                </span>
              </>
            )}

            <input
              ref={fileInputRef}
              id={fileInputId}
              name="thumbnail"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={pending}
              className="sr-only"
            />
          </label>

          {fileName && (
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={clearFile}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                {isEdit ? 'Batalkan file baru' : 'Hapus file'}
              </button>
            </div>
          )}

          {errors.thumbnail && (
            <p role="alert" className="mt-1.5 text-xs text-destructive">
              {errors.thumbnail}
            </p>
          )}
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          {isEdit
            ? 'Perubahan langsung tersimpan ke database setelah Anda menekan simpan.'
            : 'Pastikan seluruh data sudah benar sebelum berita di-upload.'}
        </p>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-dark px-6 text-sm font-semibold text-brand-foreground shadow-glow-brand transition-all duration-200 hover:bg-brand-dark/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {isEdit ? 'Menyimpan...' : 'Mengunggah...'}
            </>
          ) : isEdit ? (
            <>
              <Save className="h-4 w-4" aria-hidden />
              Simpan Perubahan
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden />
              Upload Berita
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function SectionHeading({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-xs font-bold text-foreground">
        {step}
      </span>
      <div>
        <h2 className="font-serif text-xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
