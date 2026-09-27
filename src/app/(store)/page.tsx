import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { Separator } from "@/components/ui/separator";
import { CollectionGrid } from "@/components/commerce/collection-grid";
import { campaignImages, galleryImages } from "@/config/campaign";
import { siteConfig, storeNav } from "@/config/site";
import { getProducts } from "@/lib/catalog";
import { isSupabaseConfigured } from "@/lib/supabase/env";

const pillars = [
  {
    title: "Men",
    href: "/men",
    index: "01",
    copy: "Tailored essentials, outerwear and denim built for the daily rotation.",
    image: campaignImages.categoryMen,
  },
  {
    title: "Women",
    href: "/women",
    index: "02",
    copy: "Sculpted silhouettes, fluid layers and statement knitwear.",
    image: campaignImages.categoryWomen,
  },
];

const values = [
  "Premium fabrics",
  "Limited drops",
  "Worldwide shipping",
  "WhatsApp checkout",
];

const marqueeWords = [
  "Worldwide Collection",
  "Season 01",
  "Men's & Women's",
  "Shipping globally",
];

// Catalogue snapshots refresh automatically even before an admin write
// triggers a full revalidation.
export const revalidate = 60;

export default async function HomePage() {
  const newArrivals = await getProducts({ newArrivals: true, limit: 4 });
  const configured = isSupabaseConfigured();

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-paper">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={campaignImages.hero}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_35%] opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/92 to-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 size-[36rem] rounded-full bg-gilt-soft/20 blur-[140px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-56 -left-32 size-[30rem] rounded-full bg-gilt-soft/10 blur-[130px]"
        />

        <Container className="relative py-20 md:py-32">
          <Stagger className="flex flex-col gap-8 md:gap-10">
            <StaggerItem>
              <p className="eyebrow text-gilt-soft">Season 01 — Worldwide</p>
            </StaggerItem>

            <StaggerItem>
              <h1 className="display-1 max-w-5xl">
                Clothing without{" "}
                <em className="italic text-gilt-soft">borders.</em>
              </h1>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <p className="max-w-md text-sm leading-relaxed text-paper/60 md:text-base">
                  {siteConfig.description} Editorial cuts, premium fabrics and a
                  catalogue that drops worldwide.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button href="/men" variant="accent" size="lg">
                    Shop Men
                  </Button>
                  <Button
                    href="/women"
                    size="lg"
                    className="border-paper/30 bg-transparent text-paper hover:border-paper hover:bg-paper/10 active:scale-[0.98]"
                  >
                    Shop Women
                  </Button>
                </div>
              </div>
            </StaggerItem>
          </Stagger>
        </Container>

        <div className="relative border-t border-paper/15">
          <Container className="flex flex-wrap items-center gap-x-10 gap-y-3 py-4">
            {values.map((item) => (
              <span
                key={item}
                className="eyebrow flex items-center gap-3 text-paper/55"
              >
                <span className="text-gilt-soft">✦</span>
                {item}
              </span>
            ))}
          </Container>
        </div>
      </section>

      <section className="container-page py-section">
        <div className="grid gap-px bg-line md:grid-cols-2">
          {pillars.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="group relative flex flex-col overflow-hidden bg-paper transition-colors duration-500 hover:bg-bone"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-bone">
                <Image
                  src={pillar.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 ease-editorial group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between gap-10 p-8 md:p-12">
                <div className="flex items-start justify-between">
                  <span className="eyebrow text-muted">{pillar.index}</span>
                  <ArrowUpRight
                    className="size-5 text-graphite transition-transform duration-500 ease-editorial group-hover:-translate-y-1 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h2 className="display-2 transition-colors duration-500 group-hover:text-gilt">
                    {pillar.title}
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-muted">
                    {pillar.copy}
                  </p>
                  <span className="eyebrow inline-flex items-center gap-2 text-ink">
                    Explore
                    <ArrowRight className="size-3.5" strokeWidth={1.5} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-hidden="true" className="overflow-hidden border-y border-line bg-bone py-6">
        <div className="flex w-max animate-marquee items-center will-change-transform">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map(
            (word, index) => (
              <span
                key={`${word}-${index}`}
                className="flex items-center gap-10 whitespace-nowrap pr-10 font-display text-3xl text-ink/70 md:text-5xl"
              >
                {word}
                <span className="text-gilt">✦</span>
              </span>
            ),
          )}
        </div>
      </section>

      <section className="border-b border-line bg-bone/60">
        <Container className="flex flex-col gap-8 py-section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-gilt">Just landed</p>
              <h2 className="display-2">New Arrivals</h2>
            </div>
            <Button href="/new-arrivals" variant="outline">
              View all
            </Button>
          </div>
          {newArrivals.length > 0 ? (
            <CollectionGrid products={newArrivals} />
          ) : (
            <EmptyState
              variant="compact"
              title={
                configured
                  ? "No drops published yet"
                  : "The live catalogue plugs in here"
              }
              description={
                configured
                  ? "Flag a product as a new arrival in the admin dashboard and it shows up here automatically."
                  : "Product grids read directly from Supabase — no hardcoded inventory. This section fills the moment the catalogue service is wired up."
              }
              action={{ label: "Browse the store", href: "/men" }}
            />
          )}
        </Container>
      </section>

      <section className="container-page py-section">
        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <Reveal className="md:col-span-7">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-bone">
              <Image
                src={campaignImages.featuredMain}
                alt="Model wearing the Season 01 campaign look"
                fill
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="flex flex-col justify-between gap-10 md:col-span-5">
            <Reveal variant="fade" className="flex flex-col gap-6">
              <p className="eyebrow text-gilt">The campaign</p>
              <h2 className="display-2">Made to move between cities.</h2>
              <p className="max-w-md text-sm leading-relaxed text-muted md:text-base">
                Season 01 is built around the pieces you actually reach for —
                heavy cotton, clean tailoring and layers that hold their shape
                from the studio to the street.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="/new-arrivals" variant="accent">
                  Shop the drop
                </Button>
                <Button href="/about" variant="outline">
                  Our story
                </Button>
              </div>
            </Reveal>

            <Reveal>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-bone">
                <Image
                  src={campaignImages.featuredInset}
                  alt="Detail shot from the Season 01 campaign"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink text-paper">
        <Image
          src={campaignImages.promo}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35"
        />

        <Container className="relative flex flex-col items-start gap-6 py-section md:py-28">
          <Reveal variant="fade" className="flex flex-col items-start gap-6">
            <p className="eyebrow text-gilt-soft">Worldwide shipping</p>
            <h2 className="display-2 max-w-3xl">One label. Every timezone.</h2>
            <p className="max-w-lg text-sm leading-relaxed text-paper/70 md:text-base">
              Orders and enquiries are handled directly over WhatsApp — pick
              your pieces, send the cart, and we take it from there.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button href="/men" variant="accent" size="lg">
                Shop Men
              </Button>
              <Button
                href="/women"
                size="lg"
                className="border-paper/30 bg-transparent text-paper hover:border-paper hover:bg-paper/10 active:scale-[0.98]"
              >
                Shop Women
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-b border-line bg-bone/60">
        <Container className="flex flex-col gap-8 py-section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <p className="eyebrow text-gilt">Editorial</p>
              <h2 className="display-2">Off the record</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              Studio days, fittings and the moments between the drops.
            </p>
          </div>

          <Stagger className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
            {galleryImages.map((image) => (
              <StaggerItem key={image.id}>
                <div className="group relative aspect-square overflow-hidden bg-paper">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="container-page py-section">
        <div className="flex flex-col gap-8">
          <Reveal variant="fade" className="flex flex-col gap-6">
            <p className="eyebrow text-gilt">The label</p>
            <p className="display-3 max-w-4xl">
              We build a wardrobe that travels — considered pieces, global
              attitude, zero compromise on finish.
            </p>
          </Reveal>
          <Separator />
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {storeNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-graphite hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
