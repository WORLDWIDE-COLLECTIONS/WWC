"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastRecord = Required<Omit<ToastInput, "description">> & {
  id: string;
  description?: string;
};

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  dismiss: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const EASE = [0.16, 1, 0.3, 1] as const;

const icons: Record<ToastVariant, React.ReactNode> = {
  default: <Info className="size-4" aria-hidden="true" />,
  success: <CheckCircle2 className="size-4" aria-hidden="true" />,
  error: <TriangleAlert className="size-4" aria-hidden="true" />,
};

const accents: Record<ToastVariant, string> = {
  default: "border-l-ink",
  success: "border-l-success text-success",
  error: "border-l-danger text-danger",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastRecord[]>([]);

  const dismiss = React.useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = React.useCallback(
    ({ title, description, variant = "default", duration = 4500 }: ToastInput) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setToasts((current) => [
        ...current.slice(-2),
        { id, title, description, variant, duration },
      ]);

      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-stretch gap-2 p-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[22rem]"
        role="status"
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence initial={false}>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 border border-line border-l-2 bg-chalk px-4 py-3.5 shadow-lift",
                accents[item.variant],
              )}
            >
              <span className="mt-0.5 shrink-0">{icons[item.variant]}</span>
              <div className="flex-1">
                <p className="product-name text-ink">{item.title}</p>
                {item.description ? (
                  <p className="body-sm mt-1 text-muted">{item.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="-mr-1 grid size-7 shrink-0 place-items-center text-muted transition-colors hover:text-ink"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
