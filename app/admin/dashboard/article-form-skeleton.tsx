import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SectionCard({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
      {children}
    </section>
  );
}

function SectionHeadingSkeleton() {
  return (
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
      <div className="space-y-2">
        <Skeleton variant="text" className="h-5 w-44 max-w-full" />
        <Skeleton variant="text" className="h-3 w-64 max-w-full" />
      </div>
    </div>
  );
}

/** Kerangka form upload/edit yang dipakai oleh loading boundary route admin. */
export function ArticleFormSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat formulir berita"
      className="space-y-6"
    >
      <SectionCard>
        <SectionHeadingSkeleton />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Skeleton className="h-14 rounded-xl sm:col-span-2" />
          <Skeleton className="h-24 rounded-xl sm:col-span-2" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeadingSkeleton />
        <Skeleton className="mt-6 h-64 rounded-xl" />
      </SectionCard>

      <SectionCard>
        <SectionHeadingSkeleton />
        <Skeleton className="mt-6 aspect-[16/9] w-full rounded-2xl" />
      </SectionCard>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <Skeleton variant="text" className="h-3 w-72 max-w-full" />
        <Skeleton className="h-12 w-40 shrink-0 rounded-xl" />
      </div>
    </div>
  );
}
