import * as React from "react";

import { CollectionGrid } from "@/components/commerce/collection-grid";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import type { ProductWithRelations } from "@/types/product";

export type CollectionShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: ProductWithRelations[];
  emptyTitle: string;
  emptyDescription: string;
  footer?: React.ReactNode;
};

export function CollectionShell({
  eyebrow,
  title,
  description,
  products,
  emptyTitle,
  emptyDescription,
  footer,
}: CollectionShellProps) {
  return (
    <Container className="flex flex-col gap-10 py-12 md:py-16">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      {products.length > 0 ? (
        <CollectionGrid products={products} />
      ) : (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}

      {footer}
    </Container>
  );
}
