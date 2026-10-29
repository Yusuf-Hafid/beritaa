import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getCategory } from '@/data/categories';

interface CategoryBadgeProps {
  slug: string;
  variant?: 'solid' | 'outline' | 'pill';
  className?: string;
  asLink?: boolean;
}

export function CategoryBadge({
  slug,
  variant = 'solid',
  className,
  asLink = true,
}: CategoryBadgeProps) {
  const category = getCategory(slug);
  if (!category) return null;

  const baseClass = 'inline-flex items-center gap-1 text-[0.5625rem] font-extrabold uppercase leading-none tracking-[0.18em] transition-all';

  const variantClass =
    variant === 'pill'
      ? 'rounded-full px-2.5 py-1 border'
      : 'rounded-md px-2 py-1';

  const badgeClassName = cn(
    baseClass,
    variantClass,
    asLink && 'hover:opacity-80 active:opacity-70',
    className,
  );

  const style =
    variant === 'outline' || variant === 'pill'
      ? { color: category.color, borderColor: `${category.color}40`, backgroundColor: `${category.color}10` }
      : { backgroundColor: category.color, color: '#fff' };

  if (!asLink) {
    return (
      <span className={badgeClassName} style={style}>
        {category.name}
      </span>
    );
  }

  return (
    <Link href={`/${slug}`} className={badgeClassName} style={style}>
      {category.name}
    </Link>
  );
}
