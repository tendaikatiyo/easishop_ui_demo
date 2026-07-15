"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type SearchSuggestion = {
  id: string;
  name: string;
  image: string | null;
};

/** Google-style: typed prefix in regular weight, completion bold. */
export function highlightSuggestion(name: string, query: string) {
  const q = query.trim();
  if (!q) return <span className="font-medium">{name}</span>;

  const lowerName = name.toLowerCase();
  const lowerQ = q.toLowerCase();
  let idx = lowerName.indexOf(lowerQ);
  let matchLen = q.length;

  // Same apostrophe normalisation as search ("lays" ↔ "Lay's")
  if (idx === -1) {
    const nameBare = lowerName.replace(/[''`\u2018\u2019]/g, "");
    const qBare = lowerQ.replace(/[''`\u2018\u2019]/g, "");
    const bareIdx = nameBare.indexOf(qBare);
    if (bareIdx !== -1) {
      // Map bare index back onto the display string (apostrophes shift positions)
      let seen = 0;
      let start = 0;
      for (let i = 0; i < name.length; i++) {
        if (/[''`\u2018\u2019]/.test(name[i]!)) continue;
        if (seen === bareIdx) {
          start = i;
          break;
        }
        seen++;
      }
      let consumed = 0;
      let end = start;
      while (end < name.length && consumed < qBare.length) {
        if (!/[''`\u2018\u2019]/.test(name[end]!)) consumed++;
        end++;
      }
      idx = start;
      matchLen = end - start;
    }
  }

  if (idx === -1) {
    return <span className="font-medium">{name}</span>;
  }

  const before = name.slice(0, idx);
  const match = name.slice(idx, idx + matchLen);
  const after = name.slice(idx + matchLen);

  return (
    <span className="text-left">
      {before ? (
        <span className="font-medium text-foreground">{before}</span>
      ) : null}
      <span className="font-normal text-foreground/65">{match}</span>
      {after ? (
        <span className="font-semibold text-foreground">{after}</span>
      ) : null}
    </span>
  );
}

export function SearchSuggestPanel({
  query,
  suggestions,
  activeIndex,
  onHover,
  onSelect,
  id,
}: {
  query: string;
  suggestions: SearchSuggestion[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  id: string;
}) {
  if (!suggestions.length) return null;

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Search suggestions"
      className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_18px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl"
    >
      <ul className="max-h-[min(22rem,55vh)] overflow-y-auto py-1.5">
        {suggestions.map((suggestion, index) => {
          const active = index === activeIndex;
          return (
            <li key={suggestion.id} role="option" aria-selected={active}>
              <button
                type="button"
                id={`${id}-opt-${index}`}
                className={cn(
                  "flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm transition-colors",
                  active ? "bg-zinc-100" : "hover:bg-zinc-50"
                )}
                onMouseEnter={() => onHover(index)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(suggestion);
                }}
              >
                {suggestion.image ? (
                  <span className="relative size-9 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                    <Image
                      src={suggestion.image}
                      alt=""
                      fill
                      className="object-contain p-1"
                      sizes="36px"
                    />
                  </span>
                ) : (
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-foreground/45">
                    <Search size={16} aria-hidden />
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-left">
                  {highlightSuggestion(suggestion.name, query)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
