import type { ProductStatus, ProductWithRelations } from "@/types/product";
import { PRODUCT_SELECT } from "@/lib/supabase/public";
import { maybeCreateClient } from "@/lib/supabase/server";

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

/** Signed-in admin check. Null when unconfigured or nobody is signed in. */
export async function getAdminUser() {
  const supabase = await maybeCreateClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export type AdminProductFilter = {
  search?: string;
  status?: ProductStatus | "all";
  limit?: number;
};

export async function getAdminProducts(
  filter: AdminProductFilter = {},
): Promise<ProductWithRelations[] | null> {
  const supabase = await maybeCreateClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let request = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });

  if (filter.status && filter.status !== "all") {
    request = request.eq("status", filter.status);
  }

  if (filter.search) {
    const term = filter.search.replace(/[%_,()]/g, " ").trim();
    if (term) {
      request = request.or(
        `name.ilike.%${term}%,slug.ilike.%${term}%`,
      );
    }
  }

  if (filter.limit) request = request.limit(filter.limit);

  const { data, error } = await request.returns<ProductWithRelations[]>();

  if (error) {
    console.warn(`[admin] ${error.message}`);
    return null;
  }

  return (data ?? []).map(sortRelations);
}

export async function getAdminProduct(
  id: string,
): Promise<ProductWithRelations | null> {
  const supabase = await maybeCreateClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    );

  const request = supabase.from("products").select(PRODUCT_SELECT);
  const { data, error } = await (
    isUuid ? request.eq("id", id) : request.eq("slug", id)
  ).maybeSingle<ProductWithRelations>();

  if (error) {
    console.warn(`[admin] ${error.message}`);
    return null;
  }

  return data ? sortRelations(data) : null;
}

export type CatalogueStats = {
  total: number;
  featured: number;
  newArrivals: number;
  lowStock: number;
};

export async function getCatalogueStats(): Promise<CatalogueStats | null> {
  const supabase = await maybeCreateClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [total, featured, newArrivals, lowStock] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_new_arrival", true),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .lte("stock", 5)
      .eq("status", "active"),
  ]);

  if (total.error || featured.error || newArrivals.error || lowStock.error) {
    return null;
  }

  return {
    total: total.count ?? 0,
    featured: featured.count ?? 0,
    newArrivals: newArrivals.count ?? 0,
    lowStock: lowStock.count ?? 0,
  };
}
