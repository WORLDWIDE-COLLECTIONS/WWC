import Link from "next/link";
import { Package, Sparkles, Star, TriangleAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAdminProducts, getCatalogueStats } from "@/lib/admin/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { formatPrice } from "@/lib/utils";
import type { ProductStatus } from "@/types/product";

export const metadata = {
  title: "Dashboard",
};

const statusVariant: Record<ProductStatus, "outline" | "gilt" | "accent"> = {
  active: "gilt",
  draft: "outline",
  archived: "accent",
};

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();
  const [stats, recent] = await Promise.all([
    configured ? getCatalogueStats() : Promise.resolve(null),
    configured ? getAdminProducts({ limit: 5 }) : Promise.resolve(null),
  ]);

  const metrics = [
    { label: "Products", icon: <Package className="size-4" />, value: stats?.total },
    { label: "Featured", icon: <Star className="size-4" />, value: stats?.featured },
    {
      label: "New arrivals",
      icon: <Sparkles className="size-4" />,
      value: stats?.newArrivals,
    },
    {
      label: "Low stock",
      icon: <TriangleAlert className="size-4" />,
      value: stats?.lowStock,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Worldwide Collection"
        title="Dashboard"
        description="Catalogue health, stock signals and publishing status at a glance."
        actions={<Button href="/admin/products/new">Add product</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} padding="md" className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-graphite">
              <span className="eyebrow text-muted">{metric.label}</span>
              {metric.icon}
            </div>
            <p className="font-display text-4xl text-ink">
              {metric.value ?? "—"}
            </p>
            <p className="text-xs text-muted">
              {configured
                ? "Aggregated from Supabase Postgres"
                : "Add Supabase credentials to go live"}
            </p>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <h2 className="display-3">Recent activity</h2>
          <Button href="/admin/products" variant="outline" size="sm">
            Manage products
          </Button>
        </div>

        {recent && recent.length > 0 ? (
          <ul className="border border-line bg-chalk">
            {recent.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 transition-colors last:border-b-0 hover:bg-bone/60"
                >
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-ink">
                      {product.name}
                    </span>
                    <span className="text-xs text-muted">
                      {formatPrice(product.price)} · stock {product.stock}
                    </span>
                  </span>
                  <Badge variant={statusVariant[product.status]}>
                    {product.status}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            variant="compact"
            title={
              configured
                ? "No catalogue activity yet"
                : "Supabase is not configured"
            }
            description={
              configured
                ? "Product creates, price changes and stock updates appear here as soon as you add your first garment."
                : "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then run supabase/schema.sql."
            }
            action={{
              label: "Add your first product",
              href: "/admin/products/new",
            }}
          />
        )}
      </section>
    </div>
  );
}
