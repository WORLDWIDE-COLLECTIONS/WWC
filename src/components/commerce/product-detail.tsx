"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Price } from "@/components/commerce/price";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { Separator } from "@/components/ui/separator";
import type { ProductWithRelations } from "@/types/product";

export function ProductDetail({ product }: { product: ProductWithRelations }) {
  const { sizes } = product;

  const totalStock = sizes.reduce((sum, size) => sum + size.stock, 0);
  const available = product.stock > 0 ? product.stock : totalStock;
  const soldOut = product.stock <= 0 && totalStock <= 0;
  const lowStock = !soldOut && available <= 5;

  const categoryLabel = product.category === "men" ? "Men" : "Women";
  const onSale =
    typeof product.compare_at_price === "number" &&
    product.compare_at_price > product.price;

  // Per-size stock only governs when sizes are actually tracked — otherwise
  // the product-level total is the source of truth. A sold-out piece closes
  // every size at once.

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 xl:gap-20">
      <ProductGallery product={product} />

      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-3">
          <p className="eyebrow text-gilt">
            {categoryLabel}
            {product.is_new_arrival ? " · New arrival" : ""}
          </p>

          <h1 className="display-2">{product.name}</h1>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <Price
              amount={Number(product.price)}
              compareAt={product.compare_at_price}
              size="lg"
              className="text-xl md:text-2xl"
            />
            {onSale ? <span className="eyebrow text-flare">Sale</span> : null}
          </div>

          <p
            className={cn(
              "flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em]",
              soldOut ? "text-flare" : lowStock ? "text-gilt" : "text-success",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                soldOut ? "bg-flare" : lowStock ? "bg-gilt" : "bg-success",
              )}
            />
            {soldOut ? "Sold out" : lowStock ? `Only ${available} left` : "In stock"}
          </p>
        </header>

        <Separator />

        <div className="flex flex-col gap-3">
          {product.description ? (
            <p className="text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          ) : null}

          <p
            className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-graphite">
            <span className="text-muted">Category</span>
            <span aria-hidden="true" className="h-px w-6 bg-line" />
            <span className="text-ink">{categoryLabel}</span>
          </p>
        </div>
      </div>
    </div>
  );
}