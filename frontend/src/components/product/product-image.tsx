"use client";

import Image from "next/image";
import { useState } from "react";
import { BoxArchive } from "reicon-react";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: {
  src: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="flex size-full items-center justify-center text-zinc-300"
        aria-label={alt}
        role="img"
      >
        <BoxArchive size={40} strokeWidth={1.25} aria-hidden />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(className)}
      onError={() => setFailed(true)}
    />
  );
}
