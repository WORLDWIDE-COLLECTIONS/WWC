"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { useBodyScrollLock, useEscapeKey, useMounted } from "@/hooks/use-overlay";
import { storeNav } from "@/config/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const mounted = useMounted();
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  useBodyScrollLock(open);
  useEscapeKey(open, onClose);

  React.useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    const value = typeof query === "string" ? query.trim() : "";

    if (!value) return;

    onClose();
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50">
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/60 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the store"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -32, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative border-b border-line bg-paper"
          >
            <Container className="py-8 md:py-12">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex items-center justify-between gap-6">
                  <p className="eyebrow text-gilt">Search</p>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close search"
                    className="grid size-10 place-items-center text-graphite transition-colors hover:text-ink"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 border-b border-ink pb-4">
                  <Search className="size-5 shrink-0 text-muted" aria-hidden="true" />
                  <input
                    ref={inputRef}
                    type="search"
                    name="q"
                    autoComplete="off"
                    placeholder="Search coats, denim, knitwear…"
                    aria-label="Search products"
                    className="w-full bg-transparent font-display text-2xl text-ink outline-none placeholder:text-muted/70 md:text-4xl"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="grid size-10 shrink-0 place-items-center bg-ink text-paper transition-colors hover:bg-graphite"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow mr-2 text-muted">Explore</span>
                  {storeNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="rounded-full border border-line px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-graphite transition-colors hover:border-ink hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </form>
            </Container>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
