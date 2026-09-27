import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/layout/container";

export default function AdminLoading() {
  return (
    <Container className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-56 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
      <ProductGridSkeleton count={4} />
    </Container>
  );
}
