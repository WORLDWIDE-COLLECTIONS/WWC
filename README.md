# WORLDWIDE COLLECTION

Production e-commerce storefront + admin console for the clothing label **Worldwide Collection**.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Supabase — Auth, Postgres, Storage
- Framer Motion, Lucide React
- Vercel-ready

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase values
npm run dev
```

### Database

Run `supabase/schema.sql` in the Supabase SQL editor. It creates the product
tables, row-level security policies and the public `product-images` storage
bucket.

| Piece                | Where                                                        |
| -------------------- | ------------------------------------------------------------ |
| Catalogue queries    | `src/lib/catalog.ts` (public reads, active products only)    |
| Admin reads          | `src/lib/admin/queries.ts` (session-scoped)                  |
| Admin writes         | `src/lib/admin/actions.ts` (server actions)                  |
| Session guard        | `src/proxy.ts` — `/admin/*` redirects to `/admin/login`      |
| Cart + WhatsApp cart | `src/lib/cart.ts`, `src/components/commerce/cart-view.tsx`   |

Create a user in Supabase Auth → Users, then sign in at `/admin/login`.
Without credentials the app still runs: every page falls back to an
empty/configure state instead of crashing.


## Scripts

| Command           | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Dev server (Turbopack)           |
| `npm run build`   | Production build                 |
| `npm run start`   | Serve the production build       |
| `npm run lint`    | ESLint                           |

## Architecture

```
src/
  app/
    (store)/    customer-facing routes: /, /men, /women, /new-arrivals, /search, /product/[id], /cart,
                /about, /contact, /shipping
    (admin)/    admin console: /admin, /admin/products, /admin/products/new, /admin/products/[id]/edit
    (auth)/     /admin/login (own layout, no console chrome)
    layout.tsx  root layout: fonts, metadata, tokens
  components/
    ui/         design system primitives (button, input, badge, modal, drawer, states…)
    layout/     announcement bar, header, mobile nav, footer, container
    commerce/   product card, grid, price, collection shell
    admin/      admin-only composition (sidebar, product form, login form)
  config/       site, navigation and campaign imagery config
  lib/
    supabase/   browser + server clients (@supabase/ssr)
    utils.ts    cn(), price formatting
  types/        database-facing types (products, images, sizes, colours)
```

## Storefront content

Hero, category, campaign and gallery imagery is wired through
`src/config/campaign.ts` (placeholder stock art — swap for the brand shoot).
Editorial copy for `/about`, `/contact` and `/shipping` lives in the page files
themselves; the shipping/returns timings are defaults to confirm with the label.

## Environment

See `.env.example`. Supabase credentials are required before data/auth features are enabled.
