"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useBodyScrollLock, useEscapeKey, useMounted } from "@/hooks/use-overlay";

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-3xl",
  full: "max-w-[calc(100vw-2rem)]",
} as const;

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: keyof typeof sizes;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  className,
}: ModalProps) {
  const mounted = useMounted();
  useBodyScrollLock(open);
  useEscapeKey(open, onClose);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
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
              "relative flex max-h-[90vh] w-full flex-col border border-line bg-chalk shadow-lift",
              sizes[size],
              className,
            )}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-6 border-b border-line px-5 py-4 md:px-7">
              <div className="flex flex-col gap-1">
                {title ? (
                  <h2 className="font-display text-xl md:text-2xl">{title}</h2>
                ) : null}
                {description ? (
                  <p className="text-xs leading-relaxed text-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-m-2 grid size-9 place-items-center text-graphite transition-colors hover:text-ink"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-5 md:px-7 md:py-6">
              {children}
            </div>
            {footer ? (
              <div className="flex flex-col gap-3 border-t border-line px-5 py-4 md:flex-row md:justify-end md:px-7">
                {footer}
              </div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
