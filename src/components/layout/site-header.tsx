"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { Container } from "@/components/layout/container";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchOverlay } from "@/components/ui/search-overlay";
import { storeNav } from "@/config/site";

export function SiteHeader() {
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  const closeMenu = React.useCallback(() => setMenuOpen(false), []);
  const closeSearch = React.useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md">
        <Container className="relative flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="-ml-2 grid size-11 place-items-center text-ink transition-colors hover:text-gilt lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>

            <Link
              href="/"
              className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center leading-none lg:static lg:translate-x-0 lg:items-start"
              aria-label="Worldwide Collection — home"
            >
              <span className="font-display text-sm font-medium uppercase tracking-[0.32em] transition-colors duration-300 hover:text-gilt md:text-base">
                Worldwide
              </span>
              <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.5em] text-muted md:text-[0.55rem]">
                Collection
              </span>
            </Link>
          </div>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex"
            aria-label="Primary"
          >
            {storeNav.map((item) => {
              const active =
                item.href === "/new-arrivals"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    "nav-link py-1",
                    active ? "text-ink" : "text-graphite hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="grid size-11 place-items-center text-ink transition-colors hover:text-gilt"
            >
              <Search className="size-[1.15rem]" strokeWidth={1.5} />
            </button>

            <Link
              href="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative grid size-11 place-items-center text-ink transition-colors hover:text-gilt"
            >
              <ShoppingBag className="size-[1.15rem]" strokeWidth={1.5} />
              {cartCount > 0 ? (
                <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-flare px-1 text-[0.55rem] font-bold leading-4 text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}
            </Link>
          </div>
        </Container>
      </header>

      <MobileNav open={menuOpen} onClose={closeMenu} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
