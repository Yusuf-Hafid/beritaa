import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide';
}

const sizeVariants: Record<NonNullable<ContainerProps['size']>, string> = {
  default: 'max-w-[1280px]',
  narrow: 'max-w-[820px]',
  wide: 'max-w-[1440px]',
};

export function Container({ size = 'default', className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-5 sm:px-6 lg:px-8',
        sizeVariants[size],
        className,
      )}
      {...props}
    />
  );
}
