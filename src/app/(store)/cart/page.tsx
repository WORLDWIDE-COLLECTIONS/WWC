import { Container } from "@/components/layout/container";
import { CartView } from "@/components/commerce/cart-view";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <Container className="flex flex-col gap-10 py-12 md:py-16">
      <PageHeader
        eyebrow="Your bag"
        title="Cart"
        description="Review pieces, sizes and quantities before checking out over WhatsApp."
      />
      <CartView />
    </Container>
  );
}
