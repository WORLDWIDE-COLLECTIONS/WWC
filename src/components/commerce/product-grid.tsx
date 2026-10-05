import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/commerce/product-card";
import type { ProductWithRelations } from "@/types/product";

export type ProductGridProps = {
  products: ProductWithRelations[];
  onQuickAdd?: (product: ProductWithRelations) => void;
  className?: string;
  columns?: "default" | "compact";
};

export function ProductGrid({
  products,
  onQuickAdd,
  className,
  columns = "default",
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-5 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:gap-x-8",
        columns === "default" && "lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
}
