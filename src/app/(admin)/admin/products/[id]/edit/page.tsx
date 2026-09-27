import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/ui/page-header";
import { getAdminProduct } from "@/lib/admin/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Edit product",
};

export default async function EditProductPage(
  props: PageProps<"/admin/products/[id]/edit">,
) {
  const { id } = await props.params;
  const product = isSupabaseConfigured() ? await getAdminProduct(id) : null;

  if (isSupabaseConfigured() && !product) notFound();

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Catalogue"
        title="Edit product"
        description={
          product
            ? `Update ${product.name} — price, stock, variants and publishing flags.`
            : `Update record ${id} — price, stock, variants and publishing flags.`
        }
      />
      <ProductForm mode="edit" productId={id} product={product} />
    </div>
  );
}
