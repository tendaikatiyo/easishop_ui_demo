import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ProfileSectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-green-light)]">
        <Icon className="size-4 brand-green" strokeWidth={2} />
      </span>
      <div className="space-y-0.5">
        <h1 className="font-heading text-xl font-semibold leading-tight md:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export function ProfileNavLink({
  href,
  title,
  description,
  tone = "default",
}: {
  href: string;
  title: string;
  description: string;
  tone?: "default" | "danger";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-3xl bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md",
        tone === "danger" && "hover:bg-red-50"
      )}
    >
      <div className="min-w-0 flex-1 space-y-0.5">
        <p
          className={cn(
            "font-medium",
            tone === "danger" ? "text-destructive" : "text-foreground"
          )}
        >
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ChevronRight
        className={cn(
          "size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5",
          tone === "danger" && "text-destructive/70"
        )}
      />
    </Link>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

export function getInitials(name: string, surname?: string): string {
  const parts = [name, surname].filter(Boolean).join(" ").split(/\s+/);
  return (
    parts
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}
