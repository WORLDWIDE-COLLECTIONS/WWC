"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input, Select } from "@/components/ui/input";

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get("q") ?? "");

  const apply = React.useCallback(
    (next: { q?: string; status?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      const q = (next.q ?? params.get("q") ?? "").trim();
      const status = next.status ?? params.get("status") ?? "all";

      if (q) params.set("q", q);
      else params.delete("q");
      if (status && status !== "all") params.set("status", status);
      else params.delete("status");

      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname);
    },
    [pathname, router, searchParams],
  );

  React.useEffect(() => {
    const handle = window.setTimeout(() => {
      const current = searchParams.get("q") ?? "";
      if (query !== current) apply({ q: query });
    }, 350);

    return () => window.clearTimeout(handle);
  }, [query, apply, searchParams]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Input
        size="sm"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products"
        aria-label="Search products"
        className="sm:max-w-xs"
      />
      <Select
        size="sm"
        aria-label="Filter by status"
        className="sm:max-w-48"
        defaultValue={searchParams.get("status") ?? "all"}
        onChange={(event) => apply({ status: event.target.value })}
      >
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </Select>
    </div>
  );
}
