import Link from "next/link";
import { Package, Pencil, Plus } from "lucide-react";

import { ProductFilters } from "@/components/admin/product-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { formatPrice } from "@/lib/utils";
import { getAdminProducts } from "@/lib/admin/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ProductStatus } from "@/types/product";

export const metadata = {
  title: "Products",
};

const statusVariant: Record<ProductStatus, "outline" | "gilt" | "accent"> = {
  active: "gilt",
  draft: "outline",
  archived: "accent",
};

export default async function AdminProductsPage(
  props: PageProps<"/admin/products">,
) {
  const searchParams = await props.searchParams;
  const search =
    typeof searchParams.q === "string" ? searchParams.q.trim() : undefined;
  const rawStatus =
    typeof searchParams.status === "string" ? searchParams.status : "all";
  const status = rawStatus as ProductStatus | "all";

  const products = isSupabaseConfigured()
    ? await getAdminProducts({ search, status })
    : null;

  const hasFilters = Boolean(search) || status !== "all";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Every garment in the store — pricing, stock, publishing status and merchandising flags."
        actions={
          <Button href="/admin/products/new">
            <Plus className="size-4" />
            New product
          </Button>
        }
      />

      <ProductFilters />

      <div className="border border-line bg-chalk">
        <div className="hidden grid-cols-12 gap-4 border-b border-line px-5 py-3 md:grid">
          <span className="eyebrow col-span-5 text-muted">Product</span>
          <span className="eyebrow col-span-2 text-muted">Category</span>
          <span className="eyebrow col-span-2 text-muted">Price</span>
          <span className="eyebrow col-span-1 text-muted">Stock</span>
          <span className="eyebrow col-span-2 text-right text-muted">
            Status
          </span>
        </div>

        {products && products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="grid grid-cols-12 items-center gap-4 border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-bone/60"
                >
                  <span className="col-span-12 flex items-center gap-3 md:col-span-5">
                    <span className="grid size-10 shrink-0 place-items-center border border-line bg-bone text-muted">
                      <Package className="size-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-ink">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted">/{product.slug}</span>
                    </span>
                  </span>
                  <span className="col-span-6 text-sm capitalize text-graphite md:col-span-2">
                    {product.category}
                  </span>
                  <span className="col-span-6 text-sm text-ink md:col-span-2">
                    {formatPrice(product.price)}
                  </span>
                  <span className="col-span-6 text-sm text-graphite md:col-span-1">
                    {product.stock}
                  </span>
                  <span className="col-span-6 flex items-center justify-end gap-3 md:col-span-2">
                    <Badge variant={statusVariant[product.status]}>
                      {product.status}
                    </Badge>
                    <Pencil className="size-3.5 text-muted" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            variant="compact"
            icon={<Package className="size-6" />}
            title={
              !isSupabaseConfigured()
                ? "Supabase is not configured"
                : hasFilters
                  ? "No products match those filters"
                  : "No products yet"
            }
            description={
              !isSupabaseConfigured()
                ? "Add your Supabase credentials to .env.local and run supabase/schema.sql to unlock the catalogue."
                : hasFilters
                  ? "Try a different search term or clear the status filter."
                  : "Add your first garment to publish it to the storefront."
            }
            action={
              hasFilters ? undefined : { label: "Add product", href: "/admin/products/new" }
            }
          />
        )}
      </div>
    </div>
  );
}
