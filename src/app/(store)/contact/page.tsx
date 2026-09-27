import type { Metadata } from "next";
import { Camera, Mail, MessageCircle, Music2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Reveal } from "@/components/ui/motion";
import { Separator } from "@/components/ui/separator";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with WORLDWIDE COLLECTION — WhatsApp, email and social channels for orders, sizing and press.",
};

const whatsappHref = siteConfig.whatsapp
  ? `https://wa.me/${siteConfig.whatsapp}`
  : null;

const emailHref = siteConfig.email ? `mailto:${siteConfig.email}` : null;

const channels = [
  {
    title: "WhatsApp",
    icon: MessageCircle,
    copy: "The fastest route. Send your cart, ask about sizing or check on an order — handled by a person, not a bot.",
    action: "Open WhatsApp",
    href: whatsappHref,
    placeholder: "Set NEXT_PUBLIC_WHATSAPP_NUMBER in .env.local",
  },
  {
    title: "Email",
    icon: Mail,
    copy: "For press, wholesale, collaborations and anything that needs a paper trail.",
    action: "Send an email",
    href: emailHref,
    placeholder: "Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local",
  },
  {
    title: "Instagram",
    icon: Camera,
    copy: "Drop previews, campaign outtakes and restock alerts.",
    action: "Follow on Instagram",
    href: siteConfig.links.instagram,
    placeholder: null,
  },
  {
    title: "TikTok",
    icon: Music2,
    copy: "Fit checks, fabric close-ups and everything that does not make the lookbook.",
    action: "Follow on TikTok",
    href: siteConfig.links.tiktok,
    placeholder: null,
  },
];

const prompts = [
  "Your order reference, if you already have one.",
  "The product name and size you are asking about.",
  "Your city and country, so we can quote shipping accurately.",
];

export default function ContactPage() {
  const pending = channels.filter((channel) => !channel.href);

  return (
    <Container className="flex flex-col gap-12 py-12 md:py-16">
      <PageHeader
        eyebrow="Get in touch"
        title="Contact"
        description="Orders, sizing, restocks and press — pick the channel that suits you and we will come back to you."
      />

      <section className="grid gap-px bg-line md:grid-cols-2">
        {channels.map((channel) => {
          const Icon = channel.icon;

          return (
            <div
              key={channel.title}
              className="flex flex-col gap-4 bg-paper p-8 md:p-10"
            >
              <span className="flex size-11 items-center justify-center border border-line text-gilt">
                <Icon className="size-5" strokeWidth={1.5} />
              </span>

              <div className="flex flex-col gap-2">
                <h2 className="font-display text-2xl text-ink">
                  {channel.title}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-muted">
                  {channel.copy}
                </p>
              </div>

              <div className="mt-auto pt-2">
                {channel.href ? (
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center border border-ink/25 px-6 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/[0.04]"
                  >
                    {channel.action}
                  </a>
                ) : (
                  <p className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                    {channel.placeholder}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {pending.length > 0 ? (
        <p className="-mt-4 text-xs leading-relaxed text-muted">
          {pending.length} direct{" "}
          {pending.length === 1 ? "channel is" : "channels are"} not configured
          yet — social links work out of the box.
        </p>
      ) : null}

      <Separator />

      <section className="grid gap-10 md:grid-cols-12 md:gap-14">
        <Reveal variant="fade" className="flex flex-col gap-5 md:col-span-5">
          <p className="eyebrow text-gilt">Before you write</p>
          <h2 className="display-3">
            Include these and we can answer in one reply.
          </h2>
        </Reveal>

        <ul className="flex flex-col gap-px bg-line md:col-span-7">
          {prompts.map((prompt, index) => (
            <li
              key={prompt}
              className="flex items-baseline gap-5 bg-paper p-6 md:p-7"
            >
              <span className="eyebrow text-gilt">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm leading-relaxed text-graphite md:text-base">
                {prompt}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Button href="/shipping" variant="outline">
          Shipping &amp; returns
        </Button>
        <Button href="/new-arrivals" variant="ghost">
          Browse the drop
        </Button>
      </div>
    </Container>
  );
}
