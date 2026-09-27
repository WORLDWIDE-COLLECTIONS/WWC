"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/input";

const options = [
  { value: "newest", label: "Newest first" },
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function SortControl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = searchParams.get("sort") ?? "newest";

  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow text-muted">Sort</span>
      <Select
        size="sm"
        value={current}
        aria-label="Sort products"
        className="w-56"
        onChange={(event) => {
          const params = new URLSearchParams(searchParams.toString());
          const value = event.target.value;

          if (value && value !== "newest") params.set("sort", value);
          else params.delete("sort");

          const search = params.toString();
          router.replace(search ? `${pathname}?${search}` : pathname);
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
