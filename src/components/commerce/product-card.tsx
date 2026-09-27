"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Plus, Shirt } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/commerce/price";
import type { ProductWithRelations } from "@/types/product";

export type ProductCardProps = {
  product: ProductWithRelations;
  priority?: boolean;
  onQuickAdd?: (product: ProductWithRelations) => void;
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProductImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-bone text-muted",
        className,
      )}
    >
      <Shirt className="size-7" strokeWidth={1.25} aria-hidden="true" />
      <span className="eyebrow">Worldwide</span>
    </div>
  );
}

export function ProductCard({
  product,
  priority,
  onQuickAdd,
  className,
}: ProductCardProps) {
  const reduce = useReducedMotion();
  const cover = product.images[0]?.url;
  const secondary = product.images[1]?.url;
  const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
  const soldOut = product.stock <= 0 && totalStock <= 0;

  return (
    <motion.article
      className={cn("group flex flex-col gap-3", className)}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-bone">
        <Link
          href={`/product/${product.id}`}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 block"
        >
          <span className="sr-only">{product.name}</span>
          {cover ? (
            <>
              <Image
                src={cover}
                alt=""
                fill
                priority={priority}
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-all duration-700 ease-editorial",
                  secondary
                    ? "opacity-100 group-hover:scale-[1.03] group-hover:opacity-0"
                    : "scale-100 group-hover:scale-[1.04]",
                )}
              />
              {secondary ? (
                <Image
                  src={secondary}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="scale-[1.06] object-cover opacity-0 transition-all duration-700 ease-editorial group-hover:scale-100 group-hover:opacity-100"
                />
              ) : null}
            </>
          ) : (
            <ProductImagePlaceholder />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-col items-start gap-2">
          {product.is_new_arrival ? <Badge variant="solid">New</Badge> : null}
          {product.is_featured ? <Badge variant="gilt">Featured</Badge> : null}
          {soldOut ? <Badge variant="accent">Sold out</Badge> : null}
        </div>

        <div className="absolute inset-x-2 bottom-2 z-20 flex translate-y-3 gap-2 opacity-0 transition-all duration-500 ease-editorial max-lg:translate-y-0 max-lg:opacity-100 lg:pointer-events-none lg:group-hover:pointer-events-auto lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
          {onQuickAdd ? (
            <button
              type="button"
              onClick={() => onQuickAdd(product)}
              disabled={soldOut}
              className="flex h-10 flex-1 items-center justify-center gap-2 bg-chalk/95 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="size-3.5" strokeWidth={2} />
              Quick add
            </button>
          ) : null}
          <Link
            href={`/product/${product.id}`}
            className={cn(
              "flex h-10 items-center justify-center gap-2 bg-ink/90 px-4 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-paper transition-colors duration-300 hover:bg-ink",
              onQuickAdd ? "flex-1" : "w-full",
            )}
          >
            View product
            <ArrowUpRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="eyebrow text-muted">
          {product.category === "men" ? "Men" : "Women"}
        </span>

        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/product/${product.id}`}
            className="product-name text-ink transition-colors duration-300 hover:text-gilt"
          >
            {product.name}
          </Link>
          <Price
            amount={product.price}
            compareAt={product.compare_at_price}
            size="sm"
          />
        </div>

        {product.colors.length > 0 ? (
          <span className="flex items-center gap-1.5 pt-0.5">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.id}
                title={color.name}
                className="size-2.5 rounded-full border border-line"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 4 ? (
              <span className="text-[0.6rem] text-muted">
                +{product.colors.length - 4}
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
    </motion.article>
  );
}
