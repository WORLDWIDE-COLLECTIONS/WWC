import { Compass } from "lucide-react";

import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <Container className="flex flex-1 items-center justify-center py-24">
      <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
        <p className="display-1 text-flare">404</p>
        <EmptyState
          icon={<Compass className="size-7" />}
          title="Page not found"
          description="The piece you are looking for may have sold out or moved to a new address."
          action={{ label: "Back to the store", href: "/" }}
        />
      </div>
    </Container>
  );
}
