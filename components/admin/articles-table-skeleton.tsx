import { Skeleton } from '@/components/ui/skeleton';

export function ArticlesTableSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat daftar berita"
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_9rem_8rem_6rem] gap-4 border-b border-border bg-muted/40 px-5 py-3.5">
        <Skeleton variant="text" className="h-3 w-12" />
        <Skeleton variant="text" className="h-3 w-16" />
        <Skeleton variant="text" className="h-3 w-14" />
        <Skeleton variant="text" className="ml-auto h-3 w-10" />
      </div>

      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[minmax(0,1fr)_9rem_8rem_6rem] items-center gap-4 border-b border-border/70 px-5 py-4 last:border-0"
        >
          <div className="space-y-2">
            <Skeleton variant="text" className="h-4 w-3/4" />
            <Skeleton variant="text" className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton variant="text" className="h-4 w-24" />
          <div className="flex justify-end gap-1.5">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-9 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
