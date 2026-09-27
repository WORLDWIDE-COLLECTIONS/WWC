import Link from "next/link";
import { Camera, MessageCircle, Music2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { footerNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  const whatsappHref = siteConfig.whatsapp
    ? `https://wa.me/${siteConfig.whatsapp}`
    : undefined;

  return (
    <footer className="mt-auto bg-ink text-paper">
      <Container className="py-14 md:py-20">
        <p className="display-2 border-b border-paper/15 pb-8 text-paper">
          Worldwide Collection
        </p>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <p className="eyebrow text-gilt-soft">The Label</p>
            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              {siteConfig.description}
            </p>
          </div>

          {footerNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <p className="eyebrow text-gilt-soft">{group.title}</p>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-paper/60 transition-colors hover:text-paper"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="flex flex-col gap-4">
            <p className="eyebrow text-gilt-soft">Connect</p>
            <div className="flex items-center gap-3">
              <a
                href={siteConfig.links.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="grid size-10 place-items-center border border-paper/20 text-paper/70 transition-colors hover:border-paper hover:text-paper"
              >
                <Camera className="size-4" />
              </a>
              <a
                href={siteConfig.links.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="grid size-10 place-items-center border border-paper/20 text-paper/70 transition-colors hover:border-paper hover:text-paper"
              >
                <Music2 className="size-4" />
              </a>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="grid size-10 place-items-center border border-paper/20 text-paper/70 transition-colors hover:border-paper hover:text-paper"
                >
                  <MessageCircle className="size-4" />
                </a>
              ) : null}
            </div>
            <p className="text-sm leading-relaxed text-paper/50">
              Orders and enquiries handled directly over WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper/15 pt-6 text-[0.7rem] uppercase tracking-[0.18em] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p>Shipping worldwide</p>
        </div>
      </Container>
    </footer>
  );
}
