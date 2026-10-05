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
  emptyAction?: { label: string; href: string };
  /** Filter / sort controls, or a search field on /search. */
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
};

export function CollectionShell({
  eyebrow,
  title,
  description,
  products,
  emptyTitle,
  emptyDescription,
  emptyAction,
  toolbar,
  footer,
}: CollectionShellProps) {
  return (
    <Container className="flex flex-col gap-8 py-12 md:py-16">
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      {toolbar}

      {products.length > 0 ? (
        <CollectionGrid products={products} />
      ) : (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      )}

      {footer}
    </Container>
  );
}
