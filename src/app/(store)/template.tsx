import { PageTransition } from "@/components/ui/motion";

export default function StoreTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageTransition>{children}</PageTransition>;
}
