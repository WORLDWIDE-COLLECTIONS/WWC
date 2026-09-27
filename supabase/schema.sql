-- WORLDWIDE COLLECTION — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) before wiring .env.local.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  category text not null default 'men' check (category in ('men', 'women')),
  price numeric(10, 2) not null default 0 check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  is_featured boolean not null default false,
  is_new_arrival boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  alt text,
  position integer not null default 0
);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null,
  stock integer not null default 0 check (stock >= 0),
  position integer not null default 0
);

create table if not exists public.product_colors (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  name text not null,
  hex text not null default '#0b0b0c',
  position integer not null default 0
);

create index if not exists products_status_created_idx
  on public.products (status, created_at desc);
create index if not exists products_category_idx
  on public.products (category, status);
create index if not exists product_images_product_idx
  on public.product_images (product_id, position);
create index if not exists product_sizes_product_idx
  on public.product_sizes (product_id, position);
create index if not exists product_colors_product_idx
  on public.product_colors (product_id, position);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- Storefront reads published products with the anon key; every write goes
-- through an authenticated admin session (or the server-only service key).
-- ---------------------------------------------------------------------------

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_sizes enable row level security;
alter table public.product_colors enable row level security;

drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products for select
  using (status = 'active' or auth.uid() is not null);

drop policy if exists "Product images are publicly readable" on public.product_images;
create policy "Product images are publicly readable"
  on public.product_images for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or auth.uid() is not null)
    )
  );

drop policy if exists "Product sizes are publicly readable" on public.product_sizes;
create policy "Product sizes are publicly readable"
  on public.product_sizes for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or auth.uid() is not null)
    )
  );

drop policy if exists "Product colors are publicly readable" on public.product_colors;
create policy "Product colors are publicly readable"
  on public.product_colors for select
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.status = 'active' or auth.uid() is not null)
    )
  );

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
  on public.products for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins manage product images" on public.product_images;
create policy "Admins manage product images"
  on public.product_images for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins manage product sizes" on public.product_sizes;
create policy "Admins manage product sizes"
  on public.product_sizes for all
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins manage product colors" on public.product_colors;
create policy "Admins manage product colors"
  on public.product_colors for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Storage: product imagery
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Product images are publicly readable" on storage.objects;
create policy "Product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Admins replace product images" on storage.objects;
create policy "Admins replace product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
