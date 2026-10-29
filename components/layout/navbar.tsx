import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/container';
import { mainNav } from '@/data/menu';
import { getArticlesByCategory } from '@/data/articles';
import { getCategory } from '@/data/categories';

export function Navbar() {
  return (
    <nav aria-label="Navigasi utama" className="border-b border-line bg-paper">
      <Container>
        <ul className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {mainNav.map((item) => {
            const isHome = item.href === '/';
            return (
              <li key={item.href} className="flex-shrink-0">
                <Link
                  href={item.href}
                  className={cn(
                    'group relative block whitespace-nowrap px-3 py-3 text-sm font-semibold text-ink-soft transition-colors hover:text-brand',
                    isHome && 'text-brand',
                  )}
                >
                  {item.label}
                  <span className="absolute inset-x-3 -bottom-px h-0.5 origin-left scale-x-0 bg-brand transition-transform group-hover:scale-x-100" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}

interface MegaMenuItemProps {
  slug: string;
  name: string;
}

export function MegaMenuItem({ slug, name }: MegaMenuItemProps) {
  const category = getCategory(slug);
  const categoryArticles = getArticlesByCategory(slug).slice(0, 4);
  const accent = category?.color ?? 'hsl(var(--brand))';

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-2 border-b border-line pb-2.5">
        <span className="h-4 w-1 rounded-full" style={{ backgroundColor: accent }} aria-hidden />
        <div>
          <p className="eyebrow text-muted-warm">Kategori</p>
          <h3 className="mt-0.5 font-serif text-lg font-bold leading-none text-ink">
            {name}
          </h3>
        </div>
        <Link
          href={`/${slug}`}
          className="ml-auto text-kicker font-extrabold uppercase text-teal transition-colors hover:text-brand"
        >
          Lihat semua
        </Link>
      </div>
      {categoryArticles.length === 0 ? (
        <p className="text-sm text-muted-warm">Belum ada artikel di kategori ini.</p>
      ) : (
        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
          {categoryArticles.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              className="group flex gap-3 rounded-[2px] p-2 transition-colors hover:bg-line-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.thumbnailUrl}
                alt={article.thumbnailAlt}
                className="h-14 w-20 flex-shrink-0 rounded-[2px] object-cover"
                loading="lazy"
              />
              <div className="min-w-0">
                <h4 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-ink group-hover:text-brand">
                  {article.title}
                </h4>
                <p className="mt-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-muted-warm">
                  {new Date(article.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}