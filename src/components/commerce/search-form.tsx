"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

export type SearchFormProps = {
  initialQuery?: string;
  className?: string;
};

/**
 * Query field for /search. Submitting jumps straight to the results; typing
 * rewrites the query string after a short debounce so results update live.
 * The query itself stays in the URL, which keeps results shareable and lets
 * `searchProducts()` remain the single source of truth.
 */
export function SearchForm({ initialQuery = "", className }: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = React.useState(initialQuery);

  // Adopt a query that changed from outside this field (browser back, a
  // link to /search?q=…) — adjusted during render rather than in an effect
  // so typing never triggers a cascading update.
  const [seenInitial, setSeenInitial] = React.useState(initialQuery);
  if (initialQuery !== seenInitial) {
    setSeenInitial(initialQuery);
    setValue(initialQuery);
  }

  React.useEffect(() => {
    const next = value.trim();
    if (next === initialQuery) return;

    const handle = window.setTimeout(() => {
      router.replace(
        next ? `/search?q=${encodeURIComponent(next)}` : "/search",
        { scroll: false },
      );
    }, 400);

    return () => window.clearTimeout(handle);
  }, [value, initialQuery, router]);

  const goTo = (term: string) => {
    const next = term.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        goTo(value);
      }}
      className={cn(
        "flex h-12 items-center gap-3 border border-line bg-chalk px-4 transition-colors duration-200 focus-within:border-ink",
        className,
      )}
    >
      <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search coats, denim, knitwear…"
        aria-label="Search products"
        autoComplete="off"
        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
      />
      <button
        type="submit"
        className="shrink-0 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:text-gilt"
      >
        Search
      </button>
    </form>
  );
}
