"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { addToCart } from "@/lib/cart";
import { cn, formatStock } from "@/lib/utils";
import { Price } from "@/components/commerce/price";
import { ProductImagePlaceholder } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import type { ProductWithRelations } from "@/types/product";

export function ProductDetail({ product }: { product: ProductWithRelations }) {
  const { toast } = useToast();
  const sizes = product.sizes.map((size) => size.label);
  const [selectedSize, setSelectedSize] = React.useState(
    sizes[0] ?? "One size",
  );
  const [quantity, setQuantity] = React.useState(1);
  const [activeImage, setActiveImage] = React.useState(0);

  const images = product.images;
  const cover = images[activeImage]?.url;
  const soldOut = product.stock <= 0;

  const handleAdd = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: images[0]?.url ?? null,
      size: selectedSize,
      quantity,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} — size ${selectedSize} × ${quantity}`,
      variant: "success",
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[3/4] w-full overflow-hidden border border-line bg-bone">
          {cover ? (
            <Image
              src={cover}
              alt={product.images[activeImage]?.alt ?? product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <ProductImagePlaceholder />
          )}
        </div>

        {images.length > 1 ? (
          <div className="flex gap-3">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`View image ${index + 1}`}
                className={cn(
                  "relative aspect-[3/4] w-20 overflow-hidden border transition-colors",
                  index === activeImage
                    ? "border-ink"
                    : "border-line hover:border-graphite/60",
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <p className="eyebrow text-gilt">
            {product.category === "men" ? "Men" : "Women"}
            {product.is_new_arrival ? " · New arrival" : ""}
          </p>
          <h1 className="display-2">{product.name}</h1>
          <Price
            amount={Number(product.price)}
            compareAt={product.compare_at_price}
            size="lg"
          />
          <p
            className={cn(
              "text-xs uppercase tracking-[0.18em]",
              soldOut ? "text-flare" : "text-muted",
            )}
          >
            {formatStock(product.stock)}
          </p>
        </div>

        <Separator />

        {product.description ? (
          <p className="text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        ) : null}

        {product.colors.length > 0 ? (
          <div className="flex flex-col gap-3">
            <p className="eyebrow text-graphite">Colour</p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <span
                  key={color.id}
                  className="flex items-center gap-2 text-xs text-graphite"
                >
                  <span
                    className="size-4 rounded-full border border-line"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  {color.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-3">
          <p className="eyebrow text-graphite">
            Size{sizes.length > 0 ? "" : " · One size"}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.length > 0 ? (
              sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize === size}
                  className={cn(
                    "grid h-11 min-w-11 place-items-center border px-3 text-xs transition-colors",
                    selectedSize === size
                      ? "border-ink bg-ink text-paper"
                      : "border-line bg-chalk text-graphite hover:border-graphite/60",
                  )}
                >
                  {size}
                </button>
              ))
            ) : (
              <span className="grid h-11 min-w-11 place-items-center border border-line bg-chalk px-3 text-xs text-muted">
                One size
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="eyebrow text-graphite">Quantity</p>
          <div className="flex h-11 w-36 items-center justify-between border border-line bg-chalk">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="grid h-full w-11 place-items-center text-graphite transition-colors hover:text-ink"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="text-sm text-ink">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((value) => Math.min(99, value + 1))}
              className="grid h-full w-11 place-items-center text-graphite transition-colors hover:text-ink"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={soldOut}
          onClick={handleAdd}
        >
          {soldOut ? "Sold out" : "Add to cart"}
        </Button>

        <p className="text-xs leading-relaxed text-muted">
          Shipping worldwide — checkout happens over WhatsApp so we can confirm
          sizing, delivery and payment with you directly.
        </p>
      </div>
    </div>
  );
}
