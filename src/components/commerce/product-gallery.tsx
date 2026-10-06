"use client";

import * as React from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductImagePlaceholder } from "@/components/commerce/product-card";
import type { ProductWithRelations } from "@/types/product";

function clampIndex(value: number, count: number) {
  return Math.min(Math.max(value, 0), count - 1);
}

export function ProductGallery({ product }: { product: ProductWithRelations }) {
  const reduce = useReducedMotion();
  const images = product.images;
  const count = Math.max(images.length, 1);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState(0);

  const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
  const soldOut = product.stock <= 0 && totalStock <= 0;

  const goTo = (index: number) => {
    const track = trackRef.current;
    const target = clampIndex(index, count);
    setActive(target);

    track?.scrollTo({
      left: target * track.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth <= 0) return;

    const index = clampIndex(
      Math.round(track.scrollLeft / track.clientWidth),
      count,
    );
    setActive((current) => (current === index ? current : index));
  };

  // Resizing changes the slide width — realign the scroll position to the
  // slide the customer was already looking at.
  React.useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleResize = () => {
      track.scrollLeft = clampIndex(active, count) * track.clientWidth;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [active, count]);

  return (
    <div
      className="flex flex-col gap-3"
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          goTo(active - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          goTo(active + 1);
        }
      }}
    >
      <div className="relative overflow-hidden border border-line bg-bone">
        <div
          ref={trackRef}
          onScroll={handleScroll}
          role="group"
          aria-roledescription="carousel"
          aria-label={`${product.name} images`}
          className="no-scrollbar flex w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {images.length === 0 ? (
            <div className="relative aspect-[3/4] w-full shrink-0 snap-center">
              <ProductImagePlaceholder />
            </div>
          ) : (
            images.map((image, index) => (
              <figure
                key={image.id}
                className="relative aspect-[3/4] w-full shrink-0 snap-center"
              >
                <Image
                  src={image.url}
                  alt={image.alt ?? product.name}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </figure>
            ))
          )}
        </div>

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col items-start gap-2 sm:left-4 sm:top-4">
          {product.is_new_arrival ? <Badge variant="solid">New Arrival</Badge> : null}
          {product.is_featured ? <Badge variant="gilt">Featured</Badge> : null}
          {soldOut ? <Badge variant="accent">Sold Out</Badge> : null}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              className="absolute left-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center border border-line bg-chalk/90 text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-0 sm:grid"
            >
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => goTo(active + 1)}
              disabled={active === count - 1}
              className="absolute right-3 top-1/2 z-10 hidden size-10 -translate-y-1/2 place-items-center border border-line bg-chalk/90 text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-0 sm:grid"
            >
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </button>
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4">
        {count > 1 ? (
          <div className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "relative aspect-[3/4] w-16 shrink-0 overflow-hidden border transition-colors duration-300 sm:w-20",
                  index === active
                    ? "border-ink"
                    : "border-line opacity-55 hover:border-graphite/60 hover:opacity-100",
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
        ) : (
          <span />
        )}

        {count > 1 ? (
          <p className="hidden shrink-0 text-[0.65rem] font-semibold tabular-nums tracking-[0.2em] text-muted sm:block">
            <span className="text-ink">{String(active + 1).padStart(2, "0")}</span>
            <span className="px-1 text-line">/</span>
            {String(count).padStart(2, "0")}
          </p>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="flex items-center justify-center gap-1.5 sm:hidden">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to image ${index + 1}`}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === active ? "w-7 bg-ink" : "w-3.5 bg-line",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
