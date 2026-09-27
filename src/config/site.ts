export type NavItem = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "WORLDWIDE COLLECTION",
  shortName: "WWC",
  tagline: "Clothing without borders",
  description:
    "WORLDWIDE COLLECTION is a modern fashion label crafting elevated everyday clothing for men and women.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsapp:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  links: {
    instagram: "https://instagram.com",
    tiktok: "https://tiktok.com",
  },
} as const;

export const storeNav: NavItem[] = [
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "New Arrivals", href: "/new-arrivals" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Shop",
    items: [
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Shipping & Returns", href: "/shipping" },
    ],
  },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "New Product", href: "/admin/products/new" },
];
