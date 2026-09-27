"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useBodyScrollLock, useEscapeKey, useMounted } from "@/hooks/use-overlay";

const placements = {
  right: {
    panel: "ml-auto h-full w-full max-w-md border-l",
    initial: { x: "100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 1 },
  },
  left: {
    panel: "mr-auto h-full w-full max-w-sm border-r",
    initial: { x: "-100%", opacity: 1 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 1 },
  },
  bottom: {
    panel: "mt-auto w-full max-h-[88vh] border-t",
    initial: { y: "100%", opacity: 1 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 1 },
  },
} as const;

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  placement?: keyof typeof placements;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Drawer({
  open,
  onClose,
  title,
  placement = "right",
  children,
  footer,
  className,
}: DrawerProps) {
  const mounted = useMounted();
  const placementConfig = placements[placement];
  useBodyScrollLock(open);
  useEscapeKey(open, onClose);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "relative flex flex-col bg-chalk shadow-lift",
              placementConfig.panel,
              className,
            )}
            initial={placementConfig.initial}
            animate={placementConfig.animate}
            exit={placementConfig.exit}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              {title ? (
                <h2 className="eyebrow text-graphite">{title}</h2>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-m-2 grid size-9 place-items-center text-graphite transition-colors hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              {children}
            </div>
            {footer ? (
              <div className="border-t border-line px-5 py-4">{footer}</div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
