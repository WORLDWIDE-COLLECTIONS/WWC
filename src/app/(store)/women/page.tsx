import type { Metadata } from "next";

import { CollectionShell } from "@/components/commerce/collection-shell";
import { SortControl } from "@/components/commerce/sort-control";
import { getProducts } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { CollectionFilters } from "@/types/product";

export const metadata: Metadata = {
  title: "Women",
  description:
    "Shop women's clothing from WORLDWIDE COLLECTION — dresses, knitwear, outerwear and essentials.",
};

export default async function WomenPage(props: PageProps<"/women">) {
  const searchParams = await props.searchParams;
  const sort = (
    typeof searchParams.sort === "string" ? searchParams.sort : "newest"
  ) as NonNullable<CollectionFilters["sort"]>;

  const products = await getProducts({ category: "women", sort });
  const configured = isSupabaseConfigured();

  return (
    <CollectionShell
      eyebrow="Collection 02"
      title="Women"
      description="Fluid silhouettes and sharp tailoring — womenswear designed to move across seasons and cities."
      products={products}
      emptyTitle={
        configured
          ? "Nothing published in this collection yet"
          : "The women's catalogue syncs from Supabase"
      }
      emptyDescription={
        configured
          ? "Set a product to active in the admin dashboard and it lands here automatically — nothing is hardcoded."
          : "Add your Supabase credentials to .env.local and run supabase/schema.sql to connect the live catalogue."
      }
      footer={<SortControl />}
    />
  );
}
