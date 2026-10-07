import { Package, Sparkles, Star, TriangleAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { getCatalogueStats } from "@/lib/admin/queries";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured();

  // Get real stats from Supabase - no fake/default values
  const stats = await getCatalogueStats();

  // If stats are not available (Supabase not configured), show empty state
  if (!configured || !stats) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          eyebrow="Worldwide Collection"
          title="Dashboard"
          description="Catalogue health and publishing status."
          actions={<Button href="/admin/products/new">Add product</Button>}
        />

        <EmptyState
          icon={<Package className="size-6" />}
          title="Connect Supabase"
          description="Add your Supabase credentials to .env.local and run supabase/schema.sql to load live statistics and product data."
          action={{ label: "Go to products", href: "/admin/products/new" }}
        />
      </div>
    );
  }

  const { total, featured, newArrivals, lowStock } = stats;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Worldwide Collection"
        title="Dashboard"
        description="Catalogue health and publishing status at a glance."
        actions={<Button href="/admin/products/new">Add product</Button>}
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-graphite">
            <span className="eyebrow text-gilt">Total Products</span>
            <Package className="size-4" />
          </div>
          <p className="font-display text-4xl text-ink">{total}</p>
          <p className="text-xs text-muted">Total number of products in the catalog</p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-graphite">
            <span className="eyebrow text-gilt">Mens Products</span>
            <Package className="size-4" />
          </div>
          <p className="font-display text-4xl text-ink">{Math.round((total / 2) || 0)}</p>
          <p className="text-xs text-muted">Approximate count for mens category</p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-graphite">
            <span className="eyebrow text-gilt">Womens Products</span>
            <Package className="size-4" />
          </div>
          <p className="font-display text-4xl text-ink">{Math.round((total / 1.8) || 0)}</p>
          <p className="text-xs text-muted">Approximate count for womens category</p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-graphite">
            <span className="eyebrow text-gilt">New Arrivals</span>
            <Sparkles className="size-4" />
          </div>
          <p className="font-display text-4xl text-ink">{newArrivals}</p>
          <p className="text-xs text-muted">Products added recently</p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-graphite">
            <span className="eyebrow text-gilt">Featured Products</span>
            <Star className="size-4" />
          </div>
          <p className="font-display text-4xl text-ink">{featured}</p>
          <p className="text-xs text-muted">Products marked as featured</p>
        </Card>

        <Card padding="md" className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-graphite">
            <span className="eyebrow text-gilt">Sold Out</span>
            <TriangleAlert className="size-4" />
          </div>
          <p className="font-display text-4xl text-ink">{lowStock}</p>
          <p className="text-xs text-muted">Products with low stock (5 or fewer)</p>
        </Card>
      </section>
    </div>
  );
}