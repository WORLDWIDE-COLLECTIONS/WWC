import type { Metadata } from "next";

import { CollectionShell } from "@/components/commerce/collection-shell";
import {
  CollectionToolbar,
  type CategoryOption,
} from "@/components/commerce/collection-toolbar";
import {
  applyCollectionFilters,
  deriveFacets,
  getProducts,
} from "@/lib/catalog";
import {
  categoryHref,
  clearFilterHref,
  hasActiveFilters,
  parseCollectionParams,
} from "@/lib/collection-params";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "The latest drops from WORLDWIDE COLLECTION — fresh silhouettes for men and women.",
};

export default async function NewArrivalsPage(
  props: PageProps<"/new-arrivals">,
) {
  const searchParams = await props.searchParams;
  // No route-level category here: `?category=` narrows within the drop.
  const filters = parseCollectionParams(searchParams);

  const scope = await getProducts({
    newArrivals: true,
    category: filters.category,
    sort: filters.sort,
  });
  const products = applyCollectionFilters(scope, filters);
  const facets = deriveFacets(scope);

  const configured = isSupabaseConfigured();
  const filtered = hasActiveFilters(filters) || filters.category !== undefined;

  const categoryOptions: CategoryOption[] = [
    {
      label: "All",
      href: categoryHref("/new-arrivals", searchParams),
      active: filters.category === undefined,
    },
    {
      label: "Men",
      href: categoryHref("/new-arrivals", searchParams, "men"),
      active: filters.category === "men",
    },
    {
      label: "Women",
      href: categoryHref("/new-arrivals", searchParams, "women"),
      active: filters.category === "women",
    },
  ];

  const empty = filtered
    ? {
        title: "No products match your filters",
        description:
          "Try a wider price range, another category, or clear a size or colour to see the full drop.",
        action: {
          label: "Clear filters",
          href: clearFilterHref("/new-arrivals", searchParams, { category: true }),
        },
      }
    : configured
      ? {
          title: "No drops published yet",
          description:
            "Products flagged as new arrivals in the admin dashboard appear here automatically.",
          action: undefined,
        }
      : {
          title: "New arrivals sync from Supabase",
          description:
            "Add your Supabase credentials to .env.local and run supabase/schema.sql to connect the live catalogue.",
          action: undefined,
        };

  return (
    <CollectionShell
      eyebrow="Just landed"
      title="New Arrivals"
      description="Every drop, first — the freshest pieces across men's and women's, updated the moment stock changes."
      products={products}
      emptyTitle={empty.title}
      emptyDescription={empty.description}
      emptyAction={empty.action}
      toolbar={
        <CollectionToolbar
          facets={facets}
          filters={filters}
          categoryOptions={categoryOptions}
          total={products.length}
          scopeTotal={scope.length}
          clearCategory
        />
      }
    />
  );
}
