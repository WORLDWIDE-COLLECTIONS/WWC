import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function StoreLoading() {
  return (
    <Container className="flex flex-col gap-8 py-12 md:py-16">
      <div className="flex flex-col gap-4 border-b border-line pb-8">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-12 w-64 max-w-full" />
        <div className="skeleton h-4 w-96 max-w-full" />
      </div>
      <ProductGridSkeleton />
    </Container>
  );
}
