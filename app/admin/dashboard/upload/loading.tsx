import { ArticleFormSkeleton } from '../article-form-skeleton';

export default function UploadLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Memuat formulir upload"
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]"
    >
      <div className="min-w-0">
        <ArticleFormSkeleton />
      </div>
    </div>
  );
}
