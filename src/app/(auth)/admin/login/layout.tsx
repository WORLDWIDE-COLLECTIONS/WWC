import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-ink text-paper lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/3 size-96 rounded-full bg-gilt-soft/15 blur-[120px]"
        />
        <Link href="/" className="relative flex flex-col leading-none">
          <span className="font-display text-sm font-medium uppercase tracking-[0.35em]">
            Worldwide
          </span>
          <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.55em] text-paper/50">
            Collection
          </span>
        </Link>

        <div className="relative flex flex-col gap-6">
          <p className="eyebrow text-gilt-soft">Control room</p>
          <h1 className="display-2 text-paper">
            Catalogue, stock and pricing — one console.
          </h1>
          <p className="max-w-sm text-sm leading-relaxed text-paper/50">
            Administration is protected by Supabase Authentication and guarded
            by row level security.
          </p>
        </div>

        <Link
          href="/"
          className="eyebrow relative inline-flex w-fit items-center gap-2 text-paper/50 transition-colors hover:text-paper"
        >
          <ArrowLeft className="size-3.5" />
          Back to store
        </Link>
      </section>

      <section className="flex flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-line px-6 py-5 lg:hidden">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-display text-sm font-medium uppercase tracking-[0.3em]">
              Worldwide
            </span>
            <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.45em] text-muted">
              Admin
            </span>
          </Link>
          <Link
            href="/"
            aria-label="Back to store"
            className="grid size-10 place-items-center text-ink"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </div>

        <div
          id="main"
          className="flex flex-1 items-center justify-center px-6 py-12"
        >
          {children}
        </div>
      </section>
    </div>
  );
}
