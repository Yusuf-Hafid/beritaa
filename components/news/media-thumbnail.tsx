'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogv', '.mkv'] as const;

/** Dashboard uploads and seeds can point at a video instead of a photo. */
export function isVideoThumbnail(url: string): boolean {
  const path = url.split(/[?#]/)[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => path.endsWith(extension));
}

interface MediaThumbnailProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

function ThumbnailFallback({ alt }: { alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      data-thumbnail-fallback
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted via-muted to-muted/50 text-muted-foreground"
    >
      <ImageOff className="h-6 w-6 opacity-45" aria-hidden />
    </div>
  );
}

/**
 * Renders the story thumbnail as a photo, or as a playable video when the
 * uploaded file is a video. Both fill the parent's aspect-ratio frame and
 * fall back to a neutral placeholder when the media cannot be loaded.
 */
export function MediaThumbnail({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: MediaThumbnailProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const failed = src.trim().length === 0 || failedSrc === src;

  useEffect(() => {
    const image = imageRef.current;

    if (image?.complete && image.naturalWidth === 0) {
      setFailedSrc(src);
    }

    if (videoRef.current?.error) {
      setFailedSrc(src);
    }
  }, [src]);

  if (failed) {
    return <ThumbnailFallback alt={alt} />;
  }

  if (isVideoThumbnail(src)) {
    return (
      <video
        ref={videoRef}
        src={src}
        muted
        controls
        playsInline
        preload="metadata"
        aria-label={alt}
        onError={() => setFailedSrc(src)}
        onClick={(event) => {
          // Cards wrap the thumbnail in a <Link>; keep control clicks local.
          event.preventDefault();
          event.stopPropagation();
        }}
        className={cn('absolute inset-0 h-full w-full object-cover', className)}
      />
    );
  }

  return (
    <Image
      ref={imageRef}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
}
