import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "New product",
};

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Catalogue"
        title="New product"
        description="Create a garment record — pricing, stock, sizes, colours and imagery."
      />
      <ProductForm mode="create" />
    </div>
  );
}
