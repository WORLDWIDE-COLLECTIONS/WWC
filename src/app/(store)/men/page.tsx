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
  title: "Men",
  description:
    "Shop men's clothing from WORLDWIDE COLLECTION — outerwear, denim, knitwear and essentials.",
};

export default async function MenPage(props: PageProps<"/men">) {
  const searchParams = await props.searchParams;
  // The route owns the category; query params only narrow within it.
  const filters = parseCollectionParams(searchParams, { routeCategory: "men" });

  const scope = await getProducts({ category: "men", sort: filters.sort });
  const products = applyCollectionFilters(scope, filters);
  const facets = deriveFacets(scope);

  const configured = isSupabaseConfigured();
  const filtered = hasActiveFilters(filters);

  const categoryOptions: CategoryOption[] = [
    { label: "Men", href: categoryHref("/men", searchParams), active: true },
    {
      label: "Women",
      href: categoryHref("/women", searchParams),
      active: false,
    },
  ];

  const empty = filtered
    ? {
        title: "No products match your filters",
        description:
          "Try a wider price range, or clear a size or colour — your sort and category stay where they are.",
        action: { label: "Clear filters", href: clearFilterHref("/men", searchParams) },
      }
    : configured
      ? {
          title: "Nothing published in this collection yet",
          description:
            "Set a product to active in the admin dashboard and it lands here automatically — nothing is hardcoded.",
          action: undefined,
        }
      : {
          title: "The men's catalogue syncs from Supabase",
          description:
            "Add your Supabase credentials to .env.local and run supabase/schema.sql to connect the live catalogue.",
          action: undefined,
        };

  return (
    <CollectionShell
      eyebrow="Collection 01"
      title="Men"
      description="Considered menswear for every latitude — outerwear, denim, knitwear and everyday tailoring."
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
        />
      }
    />
  );
}
