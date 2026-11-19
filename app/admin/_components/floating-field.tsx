'use client';

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

const inputLabelClasses =
  'pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 origin-left bg-transparent px-1 text-sm font-medium text-muted-foreground transition-all duration-200 ease-editorial peer-focus:-top-0.5 peer-focus:-translate-y-full peer-focus:bg-card peer-focus:text-xs peer-focus:font-semibold peer-focus:text-brand peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:-translate-y-full peer-[:not(:placeholder-shown)]:bg-card peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold motion-reduce:transition-none';

type FloatingFieldBaseProps = {
  label: string;
  error?: string;
  hint?: string;
};

export type FloatingInputProps = FloatingFieldBaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> & {
    rightSlot?: ReactNode;
    showRequiredIndicator?: boolean;
  };

export function FloatingInput({
  label,
  error,
  hint,
  rightSlot,
  className,
  id,
  required,
  showRequiredIndicator = true,
  ...props
}: FloatingInputProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const messageId = `${fieldId}-message`;
  const hasMessage = Boolean(error || hint);

  return (
    <div className="w-full">
      <div
        className={cn(
          'relative rounded-xl transition-shadow duration-200 focus-within:ring-2 focus-within:ring-brand/20 motion-reduce:transition-none',
          error && 'focus-within:ring-destructive/20'
        )}
      >
        <input
          id={fieldId}
          placeholder=" "
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cn(
            'peer h-12 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-[border-color] duration-200 placeholder:text-transparent focus:border-brand disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
            rightSlot && 'pr-12',
            error &&
              'border-destructive focus:border-destructive',
            className
          )}
          {...props}
        />

        <label htmlFor={fieldId} className={inputLabelClasses}>
          {label}
          {required && showRequiredIndicator && (
            <span aria-hidden className="ml-0.5 text-brand">
              *
            </span>
          )}
        </label>

        {rightSlot && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightSlot}
          </div>
        )}
      </div>

      {hasMessage && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn(
            'mt-1.5 text-xs leading-5',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export type FloatingTextareaProps = FloatingFieldBaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'placeholder'>;

/**
 * Textarea sengaja memakai label yang selalu berada di atas field.
 * Area textarea bisa sangat tinggi, sehingga label yang di tengah akan
 * terlihat janggal. Animasi tetap halus pada warna dan fokus.
 */
export function FloatingTextarea({
  label,
  error,
  hint,
  className,
  id,
  required,
  ...props
}: FloatingTextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const messageId = `${fieldId}-message`;
  const hasMessage = Boolean(error || hint);

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          id={fieldId}
          placeholder=" "
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cn(
            'peer w-full resize-y rounded-xl border border-input bg-background px-4 pb-3 pt-7 text-sm leading-6 text-foreground shadow-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-transparent focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
            error &&
              'border-destructive focus:border-destructive focus:ring-destructive/20',
            className
          )}
          {...props}
        />

        <label
          htmlFor={fieldId}
          className="pointer-events-none absolute left-4 top-2.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 peer-focus:text-brand motion-reduce:transition-none"
        >
          {label}
          {required && (
            <span aria-hidden className="ml-0.5 text-brand">
              *
            </span>
          )}
        </label>
      </div>

      {hasMessage && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn(
            'mt-1.5 text-xs leading-5',
            error ? 'text-destructive' : 'text-muted-foreground'
          )}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
