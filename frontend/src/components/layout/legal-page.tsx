import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export function LegalPage({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: title },
        ]}
      />
      <article className="space-y-5 rounded-3xl bg-white p-5 md:p-8">
        <header className="space-y-1.5">
          <h1 className="font-heading text-2xl font-semibold md:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </header>
        <div className="space-y-4 text-sm leading-relaxed text-foreground/80">
          {children}
        </div>
        <p className="pt-2 text-sm text-muted-foreground">
          <Link href="/" className="underline underline-offset-2">
            Back home
          </Link>
        </p>
      </article>
    </div>
  );
}
