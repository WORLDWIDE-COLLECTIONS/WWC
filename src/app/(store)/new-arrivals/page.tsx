import type { Metadata } from "next";

import { CollectionShell } from "@/components/commerce/collection-shell";
import { SortControl } from "@/components/commerce/sort-control";
import { getProducts } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { CollectionFilters } from "@/types/product";

export const metadata: Metadata = {
  title: "New Arrivals",
  description:
    "The latest drops from WORLDWIDE COLLECTION — fresh silhouettes for men and women.",
};

export default async function NewArrivalsPage(
  props: PageProps<"/new-arrivals">,
) {
  const searchParams = await props.searchParams;
  const sort = (
    typeof searchParams.sort === "string" ? searchParams.sort : "newest"
  ) as NonNullable<CollectionFilters["sort"]>;

  const products = await getProducts({ newArrivals: true, sort });
  const configured = isSupabaseConfigured();

  return (
    <CollectionShell
      eyebrow="Just landed"
      title="New Arrivals"
      description="Every drop, first — the freshest pieces across men's and women's, updated the moment stock changes."
      products={products}
      emptyTitle={
        configured
          ? "No drops published yet"
          : "New arrivals sync from Supabase"
      }
      emptyDescription={
        configured
          ? "Products flagged as new arrivals in the admin dashboard appear here automatically."
          : "Add your Supabase credentials to .env.local and run supabase/schema.sql to connect the live catalogue."
      }
      footer={<SortControl />}
    />
  );
}
