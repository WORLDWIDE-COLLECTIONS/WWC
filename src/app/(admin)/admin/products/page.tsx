"use client";

import { Package, Pencil, Trash } from "lucide-react";

import { ProductFilters } from "@/components/admin/product-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { deleteProduct } from "@/lib/admin/actions";
import { getAdminProducts } from "@/lib/admin/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatPrice } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import type { ProductStatus } from "@/types/product";

const statusVariant: Record<ProductStatus, "outline" | "gilt" | "accent"> = {
  active: "gilt",
  draft: "outline",
  archived: "accent",
};

function AdminProductsPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const search = q !== null && typeof q === "string" ? q.trim() : undefined;
  const rawStatus =
    typeof searchParams.get("status") === "string"
      ? searchParams.get("status")
      : "all";
  const status = rawStatus as ProductStatus | "all";

  const [products, setProducts] = useState<({
  id: string;
  name: string;
  slug: string;
  gender: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
} | null)[]>([]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      getAdminProducts({ search, status }).then((products) => {
        setProducts(products as ({ id: string; name: string; slug: string; gender: string; category: string; price: number; stock: number; status: ProductStatus; } | null)[]);
      });
    }
  }, [search, status]);

  const hasFilters = Boolean(search) || status !== "all";

  const { toast } = useToast();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    const id = confirmId;
    if (!id) return;

    startTransition(async () => {
      const result = await deleteProduct(id);

      if (result.ok) {
        toast({
          title: "Product deleted",
          description: "The record and its images were removed.",
          variant: "success",
        });
        setProducts((current) => current.filter((p) => p && p.id !== id));
        setConfirmId(null);
        return;
      }

      toast({
        title: "Could not delete product",
        description: result.error,
        variant: "error",
      });
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Every garment in the store — pricing, stock, publishing status and merchandising flags."
        actions={
          <Button href="/admin/products/new">
            <Package className="size-4" />
            New product
          </Button>
        }
      />

      <ProductFilters />

      <div className="border border-line bg-chalk">
        <div className="hidden grid-cols-12 gap-4 border-b border-line px-5 py-3 md:grid">
          <span className="eyebrow col-span-5 text-muted">Image</span>
          <span className="eyebrow col-span-2 text-muted">Product</span>
          <span className="eyebrow col-span-2 text-muted">Category</span>
          <span className="eyebrow col-span-1 text-muted">Gender</span>
          <span className="eyebrow col-span-1 text-muted">Price</span>
          <span className="eyebrow col-span-1 text-muted">Stock</span>
          <span className="eyebrow col-span-2 text-muted">Status</span>
          <span className="eyebrow col-span-2 text-right text-muted">Actions</span>
        </div>

        {products && products.length > 0 ? (
          <ul>
            {products.map((product) => {
              const prod =
                product as
                  | {
                    id: string;
                    name: string;
                    slug: string;
                    gender: string;
                    category: string;
                    price: number;
                    stock: number;
                    status: ProductStatus;
                  }
                  | undefined;
              if (!prod) return null;
              return (
                <li key={prod.id} className="grid grid-cols-12 items-center gap-4 border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-bone/60">
                  <span className="col-span-12 flex items-center gap-3 md:col-span-5">
                    <span className="grid size-10 shrink-0 place-items-center border border-line bg-bone text-muted">
                      <Package className="size-4" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-medium text-ink">
                        {prod.name}
                      </span>
                      <span className="text-xs text-muted">/{prod.slug}</span>
                    </span>
                  </span>
                  <span className="col-6 text-sm capitalize text-graphite md:col-span-2">
                    {prod.category}
                  </span>
                  <span className="col-span-3 text-sm text-graphite">
                    {prod.gender}
                  </span>
                  <span className="col-span-3 text-sm text-ink md:col-span-1">
                    {formatPrice(prod.price)}
                  </span>
                  <span className="col-span-3 text-sm text-graphite md:col-span-1">
                    {prod.stock}
                  </span>
                  <span className="col-span-4 text-sm font-medium uppercase text-graphite md:col-span-2">
                    {prod.status}
                  </span>
                  <span className="col-span-4 flex flex-wrap items-center justify-end gap-2 md:col-span-1">
                    <Badge variant={statusVariant[prod.status as ProductStatus]}>
                      {prod.status}
                    </Badge>
                    <Button
                      href={`/admin/products/${prod.id}/edit`}
                      variant="ghost"
                      size="sm"
                      className="w-9 px-0"
                    >
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Edit {prod.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-9 px-0"
                      aria-label={`Delete ${prod.name}`}
                      onClick={() => setConfirmId(prod.id)}
                    >
                      <Trash className="size-3.5" />
                    </Button>
                  </span>
                </li>
              );
            })}
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

      <Modal
        open={confirmId !== null}
        onClose={() => setConfirmId(null)}
        title="Delete this product?"
        description="This removes the record, its images and its variants from Supabase."
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => setConfirmId(null)}
            >
              Keep product
            </Button>
            <Button
              variant="accent"
              type="button"
              loading={pending}
              onClick={handleDelete}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted">
          The product will disappear from the storefront immediately. This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

export default AdminProductsPage;