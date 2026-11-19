import { Skeleton } from '@/components/ui/skeleton';
import { ArticleFormSkeleton } from './article-form-skeleton';

export default function DashboardLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat halaman dashboard"
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]"
    >
      <div className="min-w-0">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Skeleton variant="text" className="h-3 w-36" />
            <Skeleton variant="text" className="mt-3 h-9 w-64 max-w-full" />
            <Skeleton variant="text" className="mt-3 h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-10 w-28 shrink-0 rounded-xl" />
        </div>

        <ArticleFormSkeleton />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-card">
          <Skeleton variant="text" className="h-3 w-32" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="text"
                className={index === 3 ? 'h-3 w-3/4' : 'h-3 w-full'}
              />
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
