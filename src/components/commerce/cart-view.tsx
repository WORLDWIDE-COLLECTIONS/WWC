"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";

import { cartSubtotal, useCart } from "@/lib/cart";
import { cn, formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";

export function CartView() {
  const { cart, setQuantity, remove } = useCart();
  const { toast } = useToast();
  const subtotal = cartSubtotal(cart);
  const digits = siteConfig.whatsapp.replace(/\D/g, "");

  if (cart.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="size-7" />}
        title="Your cart is empty"
        description="Add pieces from the collection and they will show up here, ready for WhatsApp checkout."
        action={{ label: "Start shopping", href: "/new-arrivals" }}
      />
    );
  }

  const handleCheckout = () => {
    if (!digits) {
      toast({
        title: "WhatsApp is not configured",
        description:
          "Add NEXT_PUBLIC_WHATSAPP_NUMBER to .env.local to accept checkout messages.",
        variant: "error",
      });
      return;
    }

    const lines = cart.map(
      (item) =>
        `• ${item.quantity} × ${item.name} (${item.size}) — ${formatPrice(
          item.price * item.quantity,
        )}`,
    );

    const message = [
      "Hi Worldwide Collection! I'd like to order:",
      "",
      ...lines,
      "",
      `Subtotal: ${formatPrice(subtotal)}`,
      "",
      "Name:",
      "Delivery city:",
    ].join("\n");

    window.open(
      `https://wa.me/${digits}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <ul className="flex flex-1 flex-col border border-line bg-chalk">
        {cart.map((item) => (
          <li
            key={item.key}
            className="flex gap-4 border-b border-line p-4 last:border-b-0 sm:p-5"
          >
            <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden border border-line bg-bone sm:w-24">
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
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => remove(item.key)}
                  className="grid size-8 place-items-center text-muted transition-colors hover:text-danger"
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

      <aside className="flex w-full flex-col gap-5 border border-line bg-chalk p-5 lg:w-80 lg:shrink-0">
        <h2 className="eyebrow text-graphite">Order summary</h2>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium text-ink">{formatPrice(subtotal)}</span>
        </div>

        <p className="text-xs leading-relaxed text-muted">
          Shipping and payment are confirmed over WhatsApp — no card details are
          collected on this site.
        </p>

        <Button size="lg" className="w-full" onClick={handleCheckout}>
          Checkout on WhatsApp
          <ArrowRight className="size-4" />
        </Button>

        <p className="text-center text-xs text-muted">
          {digits
            ? "Opens WhatsApp with your order pre-filled."
            : "Set NEXT_PUBLIC_WHATSAPP_NUMBER to enable checkout."}
        </p>

        <div className="rule" />

        <Link
          href="/new-arrivals"
          className={cn(
            "eyebrow inline-flex items-center justify-center gap-2 text-graphite transition-colors hover:text-ink",
          )}
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
