import { Skeleton } from '@/components/ui/skeleton';
import { ArticleFormSkeleton } from '../../article-form-skeleton';

export default function EditArticleLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat formulir edit berita">
      <div className="mb-7">
        <Skeleton variant="text" className="h-3 w-44" />
        <Skeleton variant="text" className="mt-5 h-3 w-28" />
        <Skeleton variant="text" className="mt-3 h-9 w-64 max-w-full" />
        <Skeleton variant="text" className="mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="min-w-0">
          <ArticleFormSkeleton />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
            <Skeleton variant="text" className="h-3 w-32" />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton variant="text" className="h-3 w-24" />
                  <Skeleton variant="text" className="h-4 w-32" />
                </div>
              ))}
            </div>
            <Skeleton variant="text" className="mt-5 h-3 w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}
