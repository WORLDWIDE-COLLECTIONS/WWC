import type { Metadata } from "next";

import { CollectionShell } from "@/components/commerce/collection-shell";
import { SearchForm } from "@/components/commerce/search-form";
import { searchProducts } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the WORLDWIDE COLLECTION catalogue.",
};

export default async function SearchPage(props: PageProps<"/search">) {
  const searchParams = await props.searchParams;
  const term =
    typeof searchParams.q === "string" ? searchParams.q.trim() : "";

  const products = term ? await searchProducts(term) : [];
  const configured = isSupabaseConfigured();

  return (
    <CollectionShell
      eyebrow="Search"
      title={term ? `“${term}”` : "Search"}
      description={
        term
          ? `${products.length} result${products.length === 1 ? "" : "s"} across the live catalogue.`
          : "Type a garment, fabric or category to search the catalogue."
      }
      toolbar={<SearchForm initialQuery={term} className="md:max-w-xl" />}
      products={products}
      emptyTitle={
        !configured
          ? "Search runs against Supabase"
          : term
            ? "No matches found"
            : "Start typing to search"
      }
      emptyDescription={
        !configured
          ? "Add your Supabase credentials to .env.local and run supabase/schema.sql to enable catalogue search."
          : term
            ? "Try a different word — search covers product names, slugs and descriptions."
            : "Search covers product names, slugs and descriptions."
      }
    />
  );
}
