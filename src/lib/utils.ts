import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currency = process.env.NEXT_PUBLIC_CURRENCY ?? "NGN";
const wholeUnits = currency === "NGN";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency,
  currencyDisplay: "narrowSymbol",
  minimumFractionDigits: wholeUnits ? 0 : 2,
  maximumFractionDigits: wholeUnits ? 0 : 2,
});

export function formatPrice(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatStock(count: number) {
  if (count <= 0) return "Out of stock";
  if (count <= 5) return `Only ${count} left`;
  return "In stock";
}

export function absoluteUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
