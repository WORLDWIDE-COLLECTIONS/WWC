"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PlusSquare,
} from "lucide-react";

import { signOut } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";
import { Drawer } from "@/components/ui/drawer";
import { adminNav } from "@/config/site";

const icons: Record<string, React.ReactNode> = {
  "/admin": <LayoutDashboard className="size-4" />,
  "/admin/products": <Package className="size-4" />,
  "/admin/products/new": <PlusSquare className="size-4" />,
};

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Admin">
      {adminNav.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 border-l-2 px-4 py-3 text-sm transition-colors duration-200",
              active
                ? "border-flare bg-bone font-medium text-ink"
                : "border-transparent text-graphite hover:bg-bone/60 hover:text-ink",
            )}
          >
            {icons[item.href] ?? <Package className="size-4" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function BrandMark() {
  return (
    <Link href="/admin" className="flex flex-col leading-none">
      <span className="font-display text-sm font-medium uppercase tracking-[0.3em]">
        Worldwide
      </span>
      <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.45em] text-muted">
        Admin
      </span>
    </Link>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-chalk lg:flex">
        <div className="flex h-20 items-center border-b border-line px-6">
          <BrandMark />
        </div>
        <div className="flex flex-1 flex-col justify-between py-6">
          <NavList />
          <div className="flex flex-col gap-4 px-6">
            <div className="rule" />
            <button
              type="button"
              onClick={() => void signOut()}
              className="eyebrow flex items-center gap-2 text-muted transition-colors hover:text-danger"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
            <Link
              href="/"
              className="eyebrow flex items-center gap-2 text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft className="size-3.5" />
              Back to store
            </Link>
          </div>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-chalk px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="-ml-2 grid size-10 place-items-center text-ink"
        >
          <Menu className="size-5" />
        </button>
        <BrandMark />
        <Link
          href="/"
          aria-label="Back to store"
          className="-mr-2 grid size-10 place-items-center text-ink"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      <Drawer open={open} onClose={close} title="Admin">
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="-mx-5"
        >
          <NavList onNavigate={close} />
        </motion.div>
        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
          <button
            type="button"
            onClick={() => void signOut()}
            className="eyebrow flex items-center gap-2 text-muted transition-colors hover:text-danger"
          >
            <LogOut className="size-3.5" />
            Sign out
          </button>
          <Link
            href="/"
            onClick={close}
            className="eyebrow flex items-center gap-2 text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" />
            Back to store
          </Link>
        </div>
      </Drawer>
    </>
  );
}
