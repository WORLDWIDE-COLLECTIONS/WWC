"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, Music2, ShoppingBag, X } from "lucide-react";

import { Container } from "@/components/layout/container";
import {
  useBodyScrollLock,
  useEscapeKey,
  useMounted,
} from "@/hooks/use-overlay";
import { siteConfig, storeNav } from "@/config/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const firstLinkRef = React.useRef<HTMLAnchorElement>(null);

  useBodyScrollLock(open);
  useEscapeKey(open, onClose);

  React.useEffect(() => {
    if (!open || reduce) return;
    const frame = requestAnimationFrame(() => firstLinkRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open, reduce]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-ink text-paper"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
        >
          <div className="border-b border-paper/10">
            <Container className="flex items-center justify-between py-4">
              <span className="flex flex-col leading-none">
                <span className="font-display text-sm font-medium uppercase tracking-[0.35em]">
                  Worldwide
                </span>
                <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.5em] text-paper/50">
                  Collection
                </span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="-mr-2 grid size-11 place-items-center text-paper transition-colors hover:text-gilt-soft"
              >
                <X className="size-6" />
              </button>
            </Container>
          </div>

          <nav className="flex-1" aria-label="Mobile">
            <Container className="flex h-full flex-col justify-center gap-1 py-8">
            {storeNav.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: reduce ? 0 : 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: reduce ? 0 : 0.12 + index * 0.07,
                  duration: 0.5,
                  ease: EASE,
                }}
              >
                <Link
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline justify-between border-b border-paper/10 py-5"
                >
                  <span className="font-display text-4xl transition-colors duration-300 group-hover:text-gilt-soft md:text-5xl">
                    {item.label}
                  </span>
                  <span className="eyebrow text-paper/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: reduce ? 0 : 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: reduce ? 0 : 0.33,
                duration: 0.5,
                ease: EASE,
              }}
              className="mt-8 flex flex-col gap-6"
            >
              <Link
                href="/cart"
                onClick={onClose}
                className="eyebrow inline-flex items-center gap-3 text-paper/70 transition-colors hover:text-paper"
              >
                <ShoppingBag className="size-4" />
                Cart
              </Link>

              <div className="flex items-center gap-4">
                <a
                  href={siteConfig.links.instagram}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-10 place-items-center border border-paper/20 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                >
                  <Camera className="size-4" />
                </a>
                <a
                  href={siteConfig.links.tiktok}
                  aria-label="TikTok"
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-10 place-items-center border border-paper/20 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                >
                  <Music2 className="size-4" />
                </a>
              </div>
            </motion.div>
            </Container>
          </nav>

          <div className="border-t border-paper/10">
            <Container className="py-5">
              <p className="eyebrow text-paper/40">Shipping worldwide</p>
            </Container>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
