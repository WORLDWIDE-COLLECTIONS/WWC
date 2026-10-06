"use client";

import * as React from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

import Image from "next/image";
import { X, Plus, Minus } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { cart, setQuantity, remove } = useCart();
  const { toast } = useToast();
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <Drawer
      open={true}
      onClose={() => {}}
      title="Your bag"
      placement="right"
      className="max-w-sm"
    >
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 && (
          <p className="text-center text-paper/50 py-8">
            Your wardrobe is waiting.
          </p>
        )}
        {cart.length > 0 && (
          <ul className="flex flex-col gap-4">
            {cart.map((item) => (
              <li
                key={item.key}
                className="flex gap-4 border-b border-line bg-chalk p-4 last:border-b-0"
              >
                <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden border border-line bg-bone">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="eyebrow grid h-full w-full place-items-center text-muted">
                      WWC
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/product/${item.productId}`}
                        className="product-name text-ink transition-colors hover:text-gilt"
                      >
                        {item.name}
                      </Link>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted">
                        Size {item.size}
                        {item.color ? ` · ${item.color}` : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      onClick={() => remove(item.key)}
                      className="grid size-8 place-items-center text-muted transition-colors hover:text-muted/80"
                    >
                      <X className="size-4" />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-4">
                    <div className="flex h-9 w-32 items-center justify-between border border-line bg-chalk">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                        className="grid h-full w-9 place-items-center text-graphite transition-colors hover:text-ink"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="text-sm text-ink">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                        className="grid h-full w-9 place-items-center text-graphite transition-colors hover:text-ink"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-medium text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-line px-5 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </Drawer>
  );
}