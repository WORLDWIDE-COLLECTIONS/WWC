import type {
  CollectionFilters,
  ProductCategory,
  ProductWithRelations,
} from "@/types/product";
import { PRODUCT_SELECT, getPublicClient } from "@/lib/supabase/public";

export type CatalogueQuery = {
  category?: ProductCategory;
  newArrivals?: boolean;
  featured?: boolean;
  sort?: CollectionFilters["sort"];
  limit?: number;
};

function sortRelations(product: ProductWithRelations): ProductWithRelations {
  const byPosition = <T extends { position: number }>(rows: T[]) =>
    [...rows].sort((a, b) => a.position - b.position);

  return {
    ...product,
    price: Number(product.price),
    compare_at_price:
      product.compare_at_price === null ? null : Number(product.compare_at_price),
    images: byPosition(product.images ?? []),
    sizes: byPosition(product.sizes ?? []),
    colors: byPosition(product.colors ?? []),
  };
}

async function run<T>(query: PromiseLike<{ data: T | null; error: { message: string } | null }>) {
  const { data, error } = await query;

  if (error) {
    console.warn(`[catalogue] ${error.message}`);
    return null;
  }

  return data;
}

/**
 * Public catalogue reads. Every query is scoped to active products and
 * degrades to an empty list until Supabase is configured.
 */
export async function getProducts(
  query: CatalogueQuery = {},
): Promise<ProductWithRelations[]> {
  const supabase = getPublicClient();
  if (!supabase) return [];

  const { category, newArrivals, featured, sort = "newest", limit } = query;

  let request = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active");

  if (category) request = request.eq("category", category);
  if (newArrivals) request = request.eq("is_new_arrival", true);
  if (featured) request = request.eq("is_featured", true);

  switch (sort) {
    case "price-asc":
      request = request.order("price", { ascending: true });
      break;
    case "price-desc":
      request = request.order("price", { ascending: false });
      break;
    case "featured":
      request = request
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      break;
    default:
      request = request.order("created_at", { ascending: false });
  }

  if (limit) request = request.limit(limit);

  const rows = await run(request.returns<ProductWithRelations[]>());
  if (!rows) return [];

  return rows.map(sortRelations);
}

/** Lookup by id (storefront route) or slug (shareable URLs). */
export async function getProduct(
  idOrSlug: string,
): Promise<ProductWithRelations | null> {
  const supabase = getPublicClient();
  if (!supabase || !idOrSlug) return null;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      idOrSlug,
    );

  const request = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active");

  const row = await run(
    (isUuid ? request.eq("id", idOrSlug) : request.eq("slug", idOrSlug))
      .maybeSingle<ProductWithRelations>(),
  );

  return row ? sortRelations(row) : null;
}

/** Free-text catalogue search across name, slug and description. */
export async function searchProducts(
  term: string,
  limit = 24,
): Promise<ProductWithRelations[]> {
  const supabase = getPublicClient();
  const query = term.trim();
  if (!supabase || !query) return [];

  const escaped = query.replace(/[%_,()]/g, " ");

  const rows = await run(
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "active")
      .or(
        `name.ilike.%${escaped}%,slug.ilike.%${escaped}%,description.ilike.%${escaped}%`,
      )
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<ProductWithRelations[]>(),
  );

  if (!rows) return [];

  return rows.map(sortRelations);
}
