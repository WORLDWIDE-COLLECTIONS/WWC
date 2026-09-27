import * as React from "react";

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  size: string;
  quantity: number;
};

export type CartInput = {
  productId: string;
  name: string;
  price: number;
  image?: string | null;
  size: string;
  quantity?: number;
};

const STORAGE_KEY = "wwc-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage may be unavailable (private mode) — cart stays in memory.
  }
}

function emit() {
  items = [...items];
  listeners.forEach((listener) => listener());
}

function load() {
  if (typeof window === "undefined") return;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      items = parsed.filter(
        (row): row is CartItem =>
          Boolean(row) &&
          typeof (row as CartItem).productId === "string" &&
          typeof (row as CartItem).name === "string" &&
          typeof (row as CartItem).quantity === "number",
      );
    }
  } catch {
    items = EMPTY;
  }
}

if (typeof window !== "undefined") {
  load();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return items;
}

function getServerSnapshot() {
  return EMPTY;
}

export function addToCart(input: CartInput) {
  const size = input.size || "OS";
  const key = `${input.productId}:${size}`;
  const existing = items.find((item) => item.key === key);

  if (existing) {
    items = items.map((item) =>
      item.key === key
        ? { ...item, quantity: item.quantity + (input.quantity ?? 1) }
        : item,
    );
  } else {
    items = [
      ...items,
      {
        key,
        productId: input.productId,
        name: input.name,
        price: input.price,
        image: input.image ?? null,
        size,
        quantity: input.quantity ?? 1,
      },
    ];
  }

  persist();
  emit();
}

export function setQuantity(key: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(key);
    return;
  }

  items = items.map((item) =>
    item.key === key ? { ...item, quantity } : item,
  );
  persist();
  emit();
}

export function removeFromCart(key: string) {
  items = items.filter((item) => item.key !== key);
  persist();
  emit();
}

export function clearCart() {
  items = EMPTY;
  persist();
  emit();
}

export function cartSubtotal(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function useCart() {
  const cart = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return React.useMemo(
    () => ({
      cart,
      count: cart.reduce((total, item) => total + item.quantity, 0),
      subtotal: cartSubtotal(cart),
      add: addToCart,
      setQuantity,
      remove: removeFromCart,
      clear: clearCart,
    }),
    [cart],
  );
}
