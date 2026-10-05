"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip, chipClassName } from "@/components/ui/chip";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { SortControl } from "@/components/commerce/sort-control";
import {
  activeFilterCount,
  toQueryString,
  withParams,
} from "@/lib/collection-params";
import type { CatalogueFacets, CollectionFilters } from "@/types/product";

export type CategoryOption = {
  label: string;
  href: string;
  active: boolean;
};

export type CollectionToolbarProps = {
  facets: CatalogueFacets;
  filters: CollectionFilters;
  categoryOptions: CategoryOption[];
  total: number;
  scopeTotal?: number;
  /** True when the category is a query param rather than the route itself. */
  clearCategory?: boolean;
};

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="eyebrow text-muted">{label}</p>
      {children}
    </div>
  );
}

function EmptyFacet({ children }: { children: React.ReactNode }) {
  return <p className="text-xs leading-relaxed text-muted">{children}</p>;
}

/**
 * Filter + sort bar for the collection pages.
 *
 * Desktop/tablet renders the groups inline; below `md` they live in a bottom
 * drawer so the grid keeps the full width.
 */
export function CollectionToolbar({
  facets,
  filters,
  categoryOptions,
  total,
  scopeTotal,
  clearCategory = false,
}: CollectionToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const count =
    activeFilterCount(filters) +
    (clearCategory && filters.category !== undefined ? 1 : 0);
  const hasFilters = count > 0;

  const minFromFilters = filters.minPrice !== undefined ? String(filters.minPrice) : "";
  const maxFromFilters = filters.maxPrice !== undefined ? String(filters.maxPrice) : "";
  const [min, setMin] = React.useState(minFromFilters);
  const [max, setMax] = React.useState(maxFromFilters);

  // Adopt values changed from outside (Clear all, browser back) during
  // render instead of in an effect, so no cascading update mid-typing.
  const [seenMin, setSeenMin] = React.useState(minFromFilters);
  const [seenMax, setSeenMax] = React.useState(maxFromFilters);
  if (minFromFilters !== seenMin) {
    setSeenMin(minFromFilters);
    setMin(minFromFilters);
  }
  if (maxFromFilters !== seenMax) {
    setSeenMax(maxFromFilters);
    setMax(maxFromFilters);
  }

  const apply = React.useCallback(
    (changes: Record<string, string | null>) => {
      const next = withParams(searchParams, changes);
      router.replace(`${pathname}${toQueryString(next)}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const sizeOptions = React.useMemo(() => {
    const values = [...facets.sizes];
    for (const value of filters.sizes ?? []) {
      if (!values.some((label) => label.toLowerCase() === value.toLowerCase())) {
        values.push(value);
      }
    }
    return values;
  }, [facets.sizes, filters.sizes]);

  const colorOptions = React.useMemo(() => {
    const values = [...facets.colors];
    for (const name of filters.colors ?? []) {
      if (!values.some((color) => color.name === name)) {
        values.push({ name, hex: "#0b0b0c" });
      }
    }
    return values;
  }, [facets.colors, filters.colors]);

  const toggleSize = (label: string) => {
    const selected = filters.sizes ?? [];
    const next = selected.includes(label)
      ? selected.filter((value) => value !== label)
      : [...selected, label];

    apply({ size: next.length > 0 ? next.join(",") : null });
  };

  const toggleColor = (name: string) => {
    const selected = filters.colors ?? [];
    const next = selected.includes(name)
      ? selected.filter((value) => value !== name)
      : [...selected, name];

    apply({ color: next.length > 0 ? next.join(",") : null });
  };

  const clearAll = () =>
    apply({
      size: null,
      color: null,
      min: null,
      max: null,
      ...(clearCategory ? { category: null } : {}),
    });

  const priceHint = facets.price
    ? `${formatPrice(facets.price.min)} – ${formatPrice(facets.price.max)}`
    : null;

  const groups = (
    <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
      <Group label="Category">
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((option) => (
            <Link
              key={option.label}
              href={option.href}
              aria-current={option.active ? "page" : undefined}
              className={chipClassName(option.active)}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </Group>

      <Group label="Size">
        {sizeOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((label) => (
              <Chip
                key={label}
                active={(filters.sizes ?? []).includes(label)}
                onClick={() => toggleSize(label)}
              >
                {label}
              </Chip>
            ))}
          </div>
        ) : (
          <EmptyFacet>No sizes published in this collection yet.</EmptyFacet>
        )}
      </Group>

      <Group label="Colour">
        {colorOptions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {colorOptions.map((color) => (
              <Chip
                key={color.name}
                active={(filters.colors ?? []).includes(color.name)}
                onClick={() => toggleColor(color.name)}
              >
                <span
                  aria-hidden="true"
                  className="size-3 rounded-full border border-ink/20"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </Chip>
            ))}
          </div>
        ) : (
          <EmptyFacet>No colours published in this collection yet.</EmptyFacet>
        )}
      </Group>

      <Group label="Price">
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            apply({ min: min.trim() || null, max: max.trim() || null });
          }}
        >
          <div className="flex items-center gap-2">
            <Input
              size="sm"
              type="number"
              min={0}
              inputMode="numeric"
              value={min}
              onChange={(event) => setMin(event.target.value)}
              placeholder="Min"
              aria-label="Minimum price"
            />
            <span aria-hidden="true" className="text-muted">
              –
            </span>
            <Input
              size="sm"
              type="number"
              min={0}
              inputMode="numeric"
              value={max}
              onChange={(event) => setMax(event.target.value)}
              placeholder="Max"
              aria-label="Maximum price"
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.7rem] leading-relaxed text-muted">
              {priceHint ?? "No price range yet"}
            </p>
            <Button type="submit" variant="outline" size="sm">
              Apply
            </Button>
          </div>
        </form>
      </Group>
    </div>
  );

  const resultCount =
    scopeTotal !== undefined && hasFilters
      ? `Showing ${total} of ${scopeTotal}`
      : `${total} ${total === 1 ? "product" : "products"}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            className="inline-flex h-10 items-center gap-2 border border-ink/25 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/[0.04] md:hidden"
          >
            <SlidersHorizontal className="size-4" strokeWidth={1.5} />
            Filters
            {count > 0 ? (
              <span className="grid min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[0.6rem] leading-5 text-paper">
                {count}
              </span>
            ) : null}
          </button>

          <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            {resultCount}
          </p>
        </div>

        <SortControl />
      </div>

      <div className="hidden border border-line bg-chalk p-6 md:block">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="eyebrow text-graphite">Filters</p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
              Clear all
            </button>
          ) : null}
        </div>
        {groups}
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Filters"
        placement="bottom"
        footer={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!hasFilters}
              onClick={clearAll}
            >
              Clear all
            </Button>
            <Button className="flex-1" onClick={() => setDrawerOpen(false)}>
              Show {total} {total === 1 ? "product" : "products"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-7">{groups}</div>
      </Drawer>
    </div>
  );
}
