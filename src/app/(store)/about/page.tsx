import type { Metadata } from "next";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { PageHeader } from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";
import { campaignImages } from "@/config/campaign";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "WORLDWIDE COLLECTION is a modern fashion label crafting elevated everyday clothing for men and women.",
};

const principles = [
  {
    index: "01",
    title: "Fabric first",
    copy: "Every piece starts with the cloth — weight, drape and how it wears after the fortieth wash, not the first.",
  },
  {
    index: "02",
    title: "Limited by design",
    copy: "Drops are cut in controlled runs. When a run is finished it stays finished, so the wardrobe keeps its edge.",
  },
  {
    index: "03",
    title: "Borderless fit",
    copy: "Sizing is graded across regions and tested on real bodies, so a piece fits the same in Lagos, London or Lahore.",
  },
];

const milestones = [
  { label: "Founded", value: "2023" },
  { label: "Home base", value: "Remote / worldwide" },
  { label: "Categories", value: "Men's & women's" },
  { label: "Fulfilment", value: "Ships globally" },
];

export default function AboutPage() {
  return (
    <Container className="flex flex-col gap-12 py-12 md:py-16">
      <PageHeader
        eyebrow="The label"
        title="About us"
        description={siteConfig.description}
      />

      <section className="grid gap-10 md:grid-cols-12 md:gap-14">
        <Reveal className="md:col-span-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-bone">
            <Image
              src={campaignImages.featuredMain}
              alt="Model wearing a WORLDWIDE COLLECTION look"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal
          variant="fade"
          className="flex flex-col justify-center gap-6 md:col-span-6"
        >
          <p className="eyebrow text-gilt">Why we started</p>
          <p className="display-3">
            Clothing that crosses borders without losing its shape.
          </p>
          <div className="flex flex-col gap-4 text-sm leading-relaxed text-muted md:text-base">
            <p>
              {siteConfig.name} began as a reaction to disposable fashion —
              pieces that looked right on the rail and fell apart by the third
              season. We wanted the opposite: a small, deliberate catalogue of
              elevated everyday clothing that earns its place in a rotation.
            </p>
            <p>
              Everything is designed remotely and reviewed in person before it
              ships. No mass runs, no filler SKUs — just the garments we would
              wear ourselves, sent anywhere in the world.
            </p>
          </div>
        </Reveal>
      </section>

      <Separator />

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow text-gilt">How we work</p>
          <h2 className="display-2">Three rules, no exceptions</h2>
        </div>

        <Stagger className="grid gap-px bg-line md:grid-cols-3">
          {principles.map((principle) => (
            <StaggerItem key={principle.index}>
              <div className="flex h-full flex-col gap-4 bg-paper p-8">
                <span className="eyebrow text-muted">{principle.index}</span>
                <h3 className="font-display text-2xl text-ink">
                  {principle.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {principle.copy}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="border border-line bg-bone/70">
        <dl className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.label}
              className="flex flex-col gap-2 bg-bone/70 p-6 md:p-8"
            >
              <dt className="eyebrow text-gilt">{milestone.label}</dt>
              <dd className="font-display text-xl text-ink md:text-2xl">
                {milestone.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </Container>
  );
}
