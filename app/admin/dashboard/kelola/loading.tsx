import { Skeleton } from '@/components/ui/skeleton';
import { ArticlesTableSkeleton } from '@/components/admin/articles-table-skeleton';

export default function KelolaLoading() {
  return (
    <div data-kelola-page aria-busy="true" aria-label="Memuat kontrol berita">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton variant="text" className="h-3 w-36" />
          <Skeleton variant="text" className="mt-3 h-9 w-56 max-w-full" />
          <Skeleton variant="text" className="mt-3 h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-28 shrink-0 rounded-xl" />
      </div>

      <div className="overflow-x-auto">
        <ArticlesTableSkeleton />
      </div>
    </div>
  );
}
