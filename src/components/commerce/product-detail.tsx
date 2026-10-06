"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

import { addToCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Price } from "@/components/commerce/price";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import type { ProductWithRelations } from "@/types/product";

export function ProductDetail({ product }: { product: ProductWithRelations }) {
  const { toast } = useToast();

  const sizes = product.sizes;
  const colors = product.colors;
  const hasSizes = sizes.length > 0;
  const hasColors = colors.length > 0;

  const totalStock = sizes.reduce((sum, size) => sum + size.stock, 0);
  const available = product.stock > 0 ? product.stock : totalStock;
  const soldOut = product.stock <= 0 && totalStock <= 0;
  const lowStock = !soldOut && available <= 5;
  const maxQuantity = Math.max(1, Math.min(99, available));

  const [selectedSize, setSelectedSize] = React.useState<string | null>(null);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [sizeError, setSizeError] = React.useState(false);
  const [colorError, setColorError] = React.useState(false);

  const categoryLabel = product.category === "men" ? "Men" : "Women";
  const onSale =
    typeof product.compare_at_price === "number" &&
    product.compare_at_price > product.price;

  // Per-size stock only governs when sizes are actually tracked — otherwise
  // the product-level total is the source of truth. A sold-out piece closes
  // every size at once.
  const isSizeUnavailable = (stock: number) =>
    soldOut || (totalStock > 0 && stock <= 0);

  const handleAdd = () => {
    if (soldOut) {
      toast({
        title: "Sold out",
        description: `${product.name} is out of stock right now.`,
        variant: "error",
      });
      return;
    }

    if (hasSizes && !selectedSize) {
      setSizeError(true);
      toast({
        title: "Choose a size",
        description: "Select a size before adding to your bag.",
        variant: "error",
      });
      return;
    }

    if (hasColors && !selectedColor) {
      setColorError(true);
      toast({
        title: "Choose a colour",
        description: "Select a colour before adding to your bag.",
        variant: "error",
      });
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0]?.url ?? null,
      size: selectedSize ?? "OS",
      color: selectedColor,
      quantity,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} — ${selectedSize ?? "OS"}${
        selectedColor ? ` · ${selectedColor}` : ""
      } × ${quantity}`,
      variant: "success",
    });
  };

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

          <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-graphite">
            <span className="text-muted">Category</span>
            <span aria-hidden="true" className="h-px w-6 bg-line" />
            <span className="text-ink">{categoryLabel}</span>
          </p>
        </div>

        <Stagger className="flex flex-col gap-6">
          <StaggerItem className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-graphite">
                Size{hasSizes ? "" : " · One size"}
              </p>
              {hasSizes ? (
                <p
                  className={cn(
                    "text-[0.6rem] font-semibold uppercase tracking-[0.16em]",
                    sizeError && !selectedSize ? "text-flare" : "text-muted",
                  )}
                >
                  {sizeError && !selectedSize
                    ? "Required"
                    : `${sizes.length} available`}
                </p>
              ) : null}
            </div>

            <div
              role="group"
              aria-label="Select a size"
              className="flex flex-wrap gap-2"
            >
              {hasSizes ? (
                sizes.map((size) => {
                  const unavailable = isSizeUnavailable(size.stock);
                  const selected = selectedSize === size.label;

                  return (
                    <button
                      key={size.id}
                      type="button"
                      disabled={unavailable}
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedSize(size.label);
                        setSizeError(false);
                      }}
                      title={unavailable ? `${size.label} — out of stock` : undefined}
                      className={cn(
                        "grid h-11 min-w-12 place-items-center border px-3 text-xs transition-all duration-300 ease-editorial",
                        unavailable
                          ? "cursor-not-allowed border-line bg-bone text-muted/60 line-through"
                          : selected
                            ? "border-ink bg-ink text-paper"
                            : "border-line bg-chalk text-graphite hover:border-graphite/60 hover:text-ink active:scale-[0.97]",
                        sizeError &&
                          !selectedSize &&
                          !unavailable &&
                          "border-flare/70",
                      )}
                    >
                      {size.label}
                    </button>
                  );
                })
              ) : (
                <span className="grid h-11 min-w-12 place-items-center border border-line bg-chalk px-3 text-xs text-muted">
                  One size
                </span>
              )}
            </div>

            {hasSizes && sizeError && !selectedSize ? (
              <p
                role="alert"
                className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-flare"
              >
                Select a size before adding to bag
              </p>
            ) : null}
          </StaggerItem>

          {hasColors ? (
            <StaggerItem className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-graphite">Colour</p>
                <p
                  className={cn(
                    "text-[0.6rem] font-semibold uppercase tracking-[0.16em]",
                    colorError && !selectedColor ? "text-flare" : "text-muted",
                  )}
                >
                  {colorError && !selectedColor
                    ? "Required"
                    : (selectedColor ?? `${colors.length} available`)}
                </p>
              </div>

              <div
                role="group"
                aria-label="Select a colour"
                className="flex flex-wrap gap-2"
              >
                {colors.map((color) => {
                  const selected = selectedColor === color.name;

                  return (
                    <button
                      key={color.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedColor(color.name);
                        setColorError(false);
                      }}
                      className={cn(
                        "flex h-11 items-center gap-2.5 border px-3 text-xs transition-all duration-300 ease-editorial",
                        selected
                          ? "border-ink bg-ink text-paper"
                          : "border-line bg-chalk text-graphite hover:border-graphite/60 hover:text-ink active:scale-[0.97]",
                        colorError && !selectedColor && "border-flare/70",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="size-4 rounded-full border border-line"
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.name}
                    </button>
                  );
                })}
              </div>

              {colorError && !selectedColor ? (
                <p
                  role="alert"
                  className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-flare"
                >
                  Select a colour before adding to bag
                </p>
              ) : null}
            </StaggerItem>
          ) : null}

          <StaggerItem className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-graphite">Quantity</p>
              {lowStock ? (
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gilt">
                  {available} available
                </p>
              ) : null}
            </div>

            <div className="flex h-12 w-36 items-center justify-between border border-line bg-chalk">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={soldOut || quantity <= 1}
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="grid h-full w-12 place-items-center text-graphite transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-3.5" />
              </button>
              <span
                aria-live="polite"
                className="text-sm tabular-nums text-ink"
              >
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= maxQuantity}
                onClick={() =>
                  setQuantity((value) => Math.min(maxQuantity, value + 1))
                }
                className="grid h-full w-12 place-items-center text-graphite transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </StaggerItem>

          <StaggerItem className="flex flex-col gap-3">
            <Button
              size="lg"
              className="w-full"
              onClick={handleAdd}
              disabled={soldOut}
            >
              {soldOut ? "Sold out" : "Add to cart"}
            </Button>

            <p className="text-xs leading-relaxed text-muted">
              Shipping worldwide — checkout happens over WhatsApp so we can
              confirm sizing, delivery and payment with you directly.
            </p>
          </StaggerItem>
        </Stagger>
      </div>
    </div>
  );
}
