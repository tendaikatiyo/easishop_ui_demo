"use client";

import Image from "next/image";
import { useState } from "react";
import { PackageOpen } from "lucide-react";
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
        <PackageOpen className="size-10" strokeWidth={1.25} />
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
