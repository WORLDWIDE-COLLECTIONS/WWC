"use client";

import { useToast } from "@/components/ui/toast";
import { ProductGrid } from "@/components/commerce/product-grid";
import { addToCart } from "@/lib/cart";
import type { ProductWithRelations } from "@/types/product";

export function CollectionGrid({
  products,
}: {
  products: ProductWithRelations[];
}) {
  const { toast } = useToast();

  const handleQuickAdd = (product: ProductWithRelations) => {
    const size = product.sizes[0]?.label ?? "OS";

    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0]?.url ?? null,
      size,
      quantity: 1,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} — size ${size}`,
      variant: "success",
    });
  };

  return <ProductGrid products={products} onQuickAdd={handleQuickAdd} />;
}
