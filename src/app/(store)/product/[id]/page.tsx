import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { CollectionGrid } from "@/components/commerce/collection-grid";
import { ProductDetail } from "@/components/commerce/product-detail";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal } from "@/components/ui/motion";
import { getProduct, getRelatedProducts } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { siteConfig } from "@/config/site";

async function resolveProduct(idOrSlug: string) {
  if (!isSupabaseConfigured()) return null;
  return getProduct(idOrSlug);
}

export async function generateMetadata(
  props: PageProps<"/product/[id]">,
) {
  const { id } = await props.params;
  const product = await resolveProduct(id);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images[0]?.url ? [product.images[0].url] : [],
      siteName: siteConfig.name,
    },
  };
}

export default async function ProductPage(
  props: PageProps<"/product/[id]">,
) {
  const { id } = await props.params;
  const product = await resolveProduct(id);

  if (!product) {
    return (
      <Container className="flex flex-col gap-8 py-10 md:py-14">
        <Link
          href="/new-arrivals"
          className="eyebrow inline-flex w-fit items-center gap-2 text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <EmptyState
          title={
            isSupabaseConfigured() ? "Product not found" : "Catalogue not connected"
          }
          description={
            isSupabaseConfigured()
              ? "This piece may have been archived or removed from the storefront."
              : "Add your Supabase credentials to .env.local and run supabase/schema.sql to load live products."
          }
          action={{ label: "Browse new arrivals", href: "/new-arrivals" }}
        />
      </Container>
    );
  }

  const related = await getRelatedProducts(product, 4);

  return (
    <Container className="flex flex-col gap-10 py-10 md:gap-14 md:py-14">
      <Link
        href="/new-arrivals"
        className="eyebrow inline-flex w-fit items-center gap-2 text-graphite transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Back
      </Link>

      <Reveal variant="fade">
        <ProductDetail product={product} />
      </Reveal>

      {related.length > 0 ? (
        <Reveal
          variant="fade"
          className="flex flex-col gap-6 border-t border-line pt-10 md:pt-14"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="eyebrow text-gilt">You may also like</p>
              <h2 className="display-3">Complete the look</h2>
            </div>

            <Link
              href={`/${product.category}`}
              className="eyebrow group inline-flex items-center gap-2 text-graphite transition-colors hover:text-ink"
            >
              View all {product.category === "men" ? "men" : "women"}
              <ArrowUpRight
                className="size-3.5 transition-transform duration-300 ease-editorial group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          <CollectionGrid products={related} />
        </Reveal>
      ) : null}
    </Container>
  );
}
