'use client';

import Link, { useLinkStatus } from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FilePlus2,
  ListChecks,
  LoaderCircle,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  {
    href: '/admin/dashboard/upload',
    label: 'Upload Berita',
    icon: FilePlus2,
  },
  {
    href: '/admin/dashboard/kelola',
    label: 'Kelola Berita',
    icon: ListChecks,
  },
] as const;

function TabContent({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  const { pending } = useLinkStatus();

  return (
    <>
      <span
        className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center"
        aria-hidden
      >
        <Icon
          className={cn(
            'h-4 w-4 transition-opacity duration-150 motion-reduce:transition-none',
            pending && 'opacity-0'
          )}
        />
        {pending ? (
          <LoaderCircle className="absolute h-4 w-4 animate-spin motion-reduce:animate-none" />
        ) : null}
      </span>
      {label}
      <span role="status" className="sr-only">
        {pending ? `Memuat halaman ${label}` : ''}
      </span>
    </>
  );
}

export function DashboardTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi pengelolaan berita">
      <div className="grid w-full grid-cols-2 gap-1 rounded-xl border border-border bg-muted/50 p-1 shadow-sm sm:inline-grid sm:w-auto">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none',
                active
                  ? 'bg-brand text-brand-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
              )}
            >
              <TabContent icon={tab.icon} label={tab.label} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
