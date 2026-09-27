import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "How WORLDWIDE COLLECTION ships, tracks and handles returns — worldwide dispatch, tracked delivery and 14-day returns.",
};

const policies = [
  {
    index: "01",
    title: "Dispatch",
    summary: "Where orders leave from and when they move.",
    items: [
      "Orders are picked and packed Monday to Friday, excluding public holidays.",
      "In-stock pieces usually leave the studio within 2–3 business days of confirmation.",
      "You receive a confirmation message as soon as the order is accepted — orders can only be amended before dispatch.",
    ],
  },
  {
    index: "02",
    title: "Delivery",
    summary: "Tracked shipping, worldwide.",
    items: [
      "Every order ships with tracking, to the address confirmed on WhatsApp.",
      "Typical transit is 5–9 business days for international destinations and 2–4 for domestic.",
      "Timings are estimates and start from dispatch, not from the moment the order is placed.",
    ],
  },
  {
    index: "03",
    title: "Duties & taxes",
    summary: "What you pay on arrival.",
    items: [
      "Prices shown in the store include our side of the cost only.",
      "Import duties, VAT and brokerage charged by your country are the buyer's responsibility and are collected by the carrier on delivery.",
      "Refusing a parcel does not cancel these charges — they are billed to the order regardless.",
    ],
  },
  {
    index: "04",
    title: "Returns",
    summary: "Changed your mind, or something is wrong.",
    items: [
      "Unworn pieces with tags attached can be returned within 14 days of delivery.",
      "Return postage is paid by the buyer unless the item arrived faulty or incorrect, in which case we cover it.",
      "Sale items and pieces altered on request are final unless faulty.",
    ],
  },
  {
    index: "05",
    title: "Exchanges",
    summary: "Sizing is the usual reason.",
    items: [
      "The fastest exchange is a return plus a new order — that way your size is reserved while the first parcel is in transit.",
      "Message us before sending anything back so we can confirm the size is still available.",
    ],
  },
  {
    index: "06",
    title: "Lost parcels",
    summary: "If tracking stops moving.",
    items: [
      "If tracking has not updated for 7 business days past the estimated delivery window, contact us with your order reference.",
      "We will open an investigation with the carrier and, where the parcel is confirmed lost, replace or refund the order.",
    ],
  },
];

export default function ShippingPage() {
  return (
    <Container className="flex flex-col gap-12 py-12 md:py-16">
      <PageHeader
        eyebrow="The practical part"
        title="Shipping & returns"
        description="Everything that happens between you adding a piece to the cart and it landing on your doorstep."
      />

      <Stagger className="grid gap-px bg-line md:grid-cols-2">
        {policies.map((policy) => (
          <StaggerItem key={policy.index}>
            <article className="flex h-full flex-col gap-4 bg-paper p-8 md:p-10">
              <div className="flex items-baseline justify-between gap-4">
                <span className="eyebrow text-gilt">{policy.index}</span>
                <span className="eyebrow text-muted">Shipping</span>
              </div>
              <h2 className="font-display text-2xl text-ink md:text-3xl">
                {policy.title}
              </h2>
              <p className="text-sm font-medium leading-relaxed text-graphite">
                {policy.summary}
              </p>
              <ul className="flex flex-col gap-3 border-t border-line pt-4">
                {policy.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span aria-hidden="true" className="text-gilt">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <Separator />

      <Reveal
        variant="fade"
        className="flex flex-col items-start gap-6 border border-line bg-bone/70 p-8 md:p-12"
      >
        <p className="eyebrow text-gilt">Still unsure</p>
        <h2 className="display-3 max-w-2xl">
          Ask before you order — we would rather answer a size question early.
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button href="/contact" variant="accent">
            Contact us
          </Button>
          <Button href="/about" variant="outline">
            About the label
          </Button>
        </div>
      </Reveal>
    </Container>
  );
}
