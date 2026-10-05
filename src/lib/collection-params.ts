import type { CollectionFilters, ProductCategory } from "@/types/product";

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export type CollectionParams = SearchParamsRecord | URLSearchParams | string;

const SORTS: ReadonlyArray<NonNullable<CollectionFilters["sort"]>> = [
  "newest",
  "price-asc",
  "price-desc",
  "featured",
];

function first(value: string | string[] | null | undefined) {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}

function splitList(value: string | string[] | null | undefined): string[] {
  return (first(value) ?? "")
    .split(",")
    .map((row) => row.trim())
    .filter(Boolean);
}

function toPrice(value: string | string[] | null | undefined): number | undefined {
  const raw = first(value);
  if (!raw) return undefined;

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/**
 * Accepts the RSC `searchParams` record, a URLSearchParams (including Next's
 * `ReadonlyURLSearchParams`) or a raw query string.
 */
export function normalizeParams(input: CollectionParams): URLSearchParams {
  if (typeof input === "string") {
    return new URLSearchParams(input.replace(/^\?/, ""));
  }

  // Duck-typed: ReadonlyURLSearchParams does not always pass `instanceof`.
  if (typeof (input as URLSearchParams).getAll === "function") {
    return new URLSearchParams(input.toString());
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((row) => params.append(key, row));
    else params.set(key, value);
  }

  return params;
}

/**
 * Reads the collection query string into a typed filter object.
 *
 * `routeCategory` pins the category for routes that own it (`/men`, `/women`);
 * without it the `category` param is honoured, which is how `/new-arrivals`
 * narrows to a single category without leaving the page.
 */
export function parseCollectionParams(
  input: CollectionParams,
  options: { routeCategory?: ProductCategory } = {},
): CollectionFilters {
  const params = normalizeParams(input);
  const rawCategory = params.get("category");
  const rawSort = params.get("sort") ?? "";

  const category =
    options.routeCategory ??
    (rawCategory === "men" || rawCategory === "women" ? rawCategory : undefined);

  return {
    category,
    sizes: splitList(params.get("size")),
    colors: splitList(params.get("color")),
    minPrice: toPrice(params.get("min")),
    maxPrice: toPrice(params.get("max")),
    sort: SORTS.find((value) => value === rawSort) ?? "newest",
  };
}

/** Counts the filter *groups* in play — the badge shown next to "Filters". */
export function activeFilterCount(filters: CollectionFilters): number {
  let count = 0;
  if (filters.sizes?.length) count += 1;
  if (filters.colors?.length) count += 1;
  if (filters.minPrice !== undefined) count += 1;
  if (filters.maxPrice !== undefined) count += 1;
  return count;
}

/** True when size / colour / price narrowing is applied. */
export function hasActiveFilters(filters: CollectionFilters): boolean {
  return activeFilterCount(filters) > 0;
}

/** Returns a new query with `changes` merged in; `null` removes the key. */
export function withParams(
  input: CollectionParams,
  changes: Record<string, string | null>,
): URLSearchParams {
  const params = normalizeParams(input);

  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === "") params.delete(key);
    else params.set(key, value);
  }

  return params;
}

export function toQueryString(input: CollectionParams): string {
  const search = normalizeParams(input).toString();
  return search ? `?${search}` : "";
}

/**
 * Category chips are links, so the active category lives in the path rather
 * than the query on `/men` and `/women`. Other filters travel with it.
 */
export function categoryHref(
  pathname: string,
  input: CollectionParams,
  category?: ProductCategory,
): string {
  return `${pathname}${toQueryString(withParams(input, { category: category ?? null }))}`;
}

/** Keeps sort while dropping every narrowing filter. */
export function clearFilterHref(
  pathname: string,
  input: CollectionParams,
  options: { category?: boolean } = {},
): string {
  const params = withParams(input, {
    size: null,
    color: null,
    min: null,
    max: null,
    ...(options.category ? { category: null } : {}),
  });

  return `${pathname}${toQueryString(params)}`;
}
