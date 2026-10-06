import type { ProductWithRelations } from "@/types/product";

/**
 * TEMPORARY local catalogue used for visual verification while the app has
 * no Supabase credentials. Delete this file together with the
 * `WWC_MOCK_CATALOG` branch in `public.ts`.
 */

const now = "2026-09-01T00:00:00.000Z";

function image(id: string, n: number, position: number, alt: string) {
  return {
    id,
    product_id: id.replace(/-img-\d+$/, ""),
    url: `/mock/look-0${n}.jpg`,
    alt,
    position,
  };
}

const PRODUCTS: ProductWithRelations[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    slug: "oversized-logo-tee",
    name: "Oversized Logo Tee",
    description:
      "Boxy, heavyweight cotton tee with a screen-printed Worldwide logo across the back. Dropped shoulders, ribbed collar and a relaxed drape built for layering.",
    category: "men",
    price: 28500,
    compare_at_price: 35000,
    stock: 12,
    status: "active",
    is_featured: true,
    is_new_arrival: true,
    created_at: "2026-09-20T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p1-img-1", 1, 0, "Oversized Logo Tee front"),
      image("p1-img-2", 2, 1, "Oversized Logo Tee back"),
      image("p1-img-3", 3, 2, "Oversized Logo Tee detail"),
      image("p1-img-4", 4, 3, "Oversized Logo Tee styling"),
    ],
    sizes: [
      { id: "p1-s1", product_id: "11111111-1111-4111-8111-111111111111", label: "XS", stock: 4, position: 0 },
      { id: "p1-s2", product_id: "11111111-1111-4111-8111-111111111111", label: "S", stock: 6, position: 1 },
      { id: "p1-s3", product_id: "11111111-1111-4111-8111-111111111111", label: "M", stock: 0, position: 2 },
      { id: "p1-s4", product_id: "11111111-1111-4111-8111-111111111111", label: "L", stock: 8, position: 3 },
      { id: "p1-s5", product_id: "11111111-1111-4111-8111-111111111111", label: "XL", stock: 3, position: 4 },
    ],
    colors: [
      { id: "p1-c1", product_id: "11111111-1111-4111-8111-111111111111", name: "Black", hex: "#0a0a0a", position: 0 },
      { id: "p1-c2", product_id: "11111111-1111-4111-8111-111111111111", name: "Off White", hex: "#f4f1eb", position: 1 },
      { id: "p1-c3", product_id: "11111111-1111-4111-8111-111111111111", name: "Bronze", hex: "#85693f", position: 2 },
    ],
  },
  {
    id: "22222222-2222-4222-8222-222222222222",
    slug: "boxy-oxford-shirt",
    name: "Boxy Oxford Shirt",
    description:
      "Cut wide through the body with a soft point collar. Woven from washed cotton oxford that breaks in with every wear.",
    category: "men",
    price: 45000,
    compare_at_price: null,
    stock: 6,
    status: "active",
    is_featured: false,
    is_new_arrival: false,
    created_at: "2026-09-14T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p2-img-1", 2, 0, "Boxy Oxford Shirt front"),
      image("p2-img-2", 3, 1, "Boxy Oxford Shirt detail"),
      image("p2-img-3", 5, 2, "Boxy Oxford Shirt styling"),
    ],
    sizes: [
      { id: "p2-s1", product_id: "22222222-2222-4222-8222-222222222222", label: "S", stock: 2, position: 0 },
      { id: "p2-s2", product_id: "22222222-2222-4222-8222-222222222222", label: "M", stock: 3, position: 1 },
      { id: "p2-s3", product_id: "22222222-2222-4222-8222-222222222222", label: "L", stock: 1, position: 2 },
      { id: "p2-s4", product_id: "22222222-2222-4222-8222-222222222222", label: "XL", stock: 0, position: 3 },
    ],
    colors: [
      { id: "p2-c1", product_id: "22222222-2222-4222-8222-222222222222", name: "White", hex: "#f7f5f0", position: 0 },
      { id: "p2-c2", product_id: "22222222-2222-4222-8222-222222222222", name: "Navy", hex: "#1f2a44", position: 1 },
    ],
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    slug: "cargo-utility-pants",
    name: "Cargo Utility Pants",
    description:
      "Straight-leg cargo in ripstop cotton with bellowed pockets and an adjustable hem tab.",
    category: "men",
    price: 58000,
    compare_at_price: null,
    stock: 0,
    status: "active",
    is_featured: false,
    is_new_arrival: false,
    created_at: "2026-09-08T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p3-img-1", 6, 0, "Cargo Utility Pants front"),
      image("p3-img-2", 7, 1, "Cargo Utility Pants detail"),
    ],
    sizes: [
      { id: "p3-s1", product_id: "33333333-3333-4333-8333-333333333333", label: "30", stock: 0, position: 0 },
      { id: "p3-s2", product_id: "33333333-3333-4333-8333-333333333333", label: "32", stock: 0, position: 1 },
      { id: "p3-s3", product_id: "33333333-3333-4333-8333-333333333333", label: "34", stock: 0, position: 2 },
    ],
    colors: [
      { id: "p3-c1", product_id: "33333333-3333-4333-8333-333333333333", name: "Olive", hex: "#5c5c3a", position: 0 },
    ],
  },
  {
    id: "44444444-4444-4444-8444-444444444444",
    slug: "washed-denim-jacket",
    name: "Washed Denim Jacket",
    description:
      "Rigid 13oz denim washed to a lived-in grey. Chest pockets, tonal stitching and a boxy cropped body.",
    category: "men",
    price: 75000,
    compare_at_price: null,
    stock: 9,
    status: "active",
    is_featured: true,
    is_new_arrival: true,
    created_at: "2026-09-24T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p4-img-1", 6, 0, "Washed Denim Jacket front"),
      image("p4-img-2", 8, 1, "Washed Denim Jacket back"),
      image("p4-img-3", 2, 2, "Washed Denim Jacket detail"),
    ],
    sizes: [
      { id: "p4-s1", product_id: "44444444-4444-4444-8444-444444444444", label: "S", stock: 3, position: 0 },
      { id: "p4-s2", product_id: "44444444-4444-4444-8444-444444444444", label: "M", stock: 4, position: 1 },
      { id: "p4-s3", product_id: "44444444-4444-4444-8444-444444444444", label: "L", stock: 2, position: 2 },
    ],
    colors: [
      { id: "p4-c1", product_id: "44444444-4444-4444-8444-444444444444", name: "Indigo", hex: "#3b4a63", position: 0 },
      { id: "p4-c2", product_id: "44444444-4444-4444-8444-444444444444", name: "Washed Black", hex: "#2f2e2c", position: 1 },
    ],
  },
  {
    id: "55555555-5555-4555-8555-555555555555",
    slug: "relaxed-chino-shorts",
    name: "Relaxed Chino Shorts",
    description:
      "Knee-grazing chino shorts in brushed twill with a drawcord waist and side pockets.",
    category: "men",
    price: 36000,
    compare_at_price: 42000,
    stock: 14,
    status: "active",
    is_featured: false,
    is_new_arrival: false,
    created_at: "2026-09-18T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p5-img-1", 7, 0, "Relaxed Chino Shorts front"),
      image("p5-img-2", 1, 1, "Relaxed Chino Shorts styling"),
    ],
    sizes: [
      { id: "p5-s1", product_id: "55555555-5555-4555-8555-555555555555", label: "30", stock: 5, position: 0 },
      { id: "p5-s2", product_id: "55555555-5555-4555-8555-555555555555", label: "32", stock: 6, position: 1 },
      { id: "p5-s3", product_id: "55555555-5555-4555-8555-555555555555", label: "34", stock: 3, position: 2 },
    ],
    colors: [
      { id: "p5-c1", product_id: "55555555-5555-4555-8555-555555555555", name: "Stone", hex: "#b9ad9a", position: 0 },
      { id: "p5-c2", product_id: "55555555-5555-4555-8555-555555555555", name: "Black", hex: "#0a0a0a", position: 1 },
    ],
  },
  {
    id: "66666666-6666-4666-8666-666666666666",
    slug: "cropped-hoodie",
    name: "Cropped Hoodie",
    description:
      "Loopback cotton hoodie cut short at the waist with a double-layer hood and ribbed cuffs.",
    category: "women",
    price: 52000,
    compare_at_price: 65000,
    stock: 11,
    status: "active",
    is_featured: false,
    is_new_arrival: true,
    created_at: "2026-09-22T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p6-img-1", 4, 0, "Cropped Hoodie front"),
      image("p6-img-2", 8, 1, "Cropped Hoodie back"),
      image("p6-img-3", 5, 2, "Cropped Hoodie styling"),
    ],
    sizes: [
      { id: "p6-s1", product_id: "66666666-6666-4666-8666-666666666666", label: "XS", stock: 2, position: 0 },
      { id: "p6-s2", product_id: "66666666-6666-4666-8666-666666666666", label: "S", stock: 5, position: 1 },
      { id: "p6-s3", product_id: "66666666-6666-4666-8666-666666666666", label: "M", stock: 4, position: 2 },
      { id: "p6-s4", product_id: "66666666-6666-4666-8666-666666666666", label: "L", stock: 0, position: 3 },
    ],
    colors: [
      { id: "p6-c1", product_id: "66666666-6666-4666-8666-666666666666", name: "Charcoal", hex: "#33312e", position: 0 },
      { id: "p6-c2", product_id: "66666666-6666-4666-8666-666666666666", name: "Dust Rose", hex: "#c8a49a", position: 1 },
    ],
  },
  {
    id: "77777777-7777-4777-8777-777777777777",
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    description:
      "Sunray pleats that swing with every step, finished with a flat elastic waistband and a midi hem.",
    category: "women",
    price: 47500,
    compare_at_price: null,
    stock: 4,
    status: "active",
    is_featured: true,
    is_new_arrival: false,
    created_at: "2026-09-12T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p7-img-1", 5, 0, "Pleated Midi Skirt front"),
      image("p7-img-2", 6, 1, "Pleated Midi Skirt movement"),
    ],
    sizes: [
      { id: "p7-s1", product_id: "77777777-7777-4777-8777-777777777777", label: "6", stock: 1, position: 0 },
      { id: "p7-s2", product_id: "77777777-7777-4777-8777-777777777777", label: "8", stock: 2, position: 1 },
      { id: "p7-s3", product_id: "77777777-7777-4777-8777-777777777777", label: "10", stock: 1, position: 2 },
    ],
    colors: [
      { id: "p7-c1", product_id: "77777777-7777-4777-8777-777777777777", name: "Sand", hex: "#d6cbb6", position: 0 },
      { id: "p7-c2", product_id: "77777777-7777-4777-8777-777777777777", name: "Black", hex: "#0a0a0a", position: 1 },
    ],
  },
  {
    id: "88888888-8888-4888-8888-888888888888",
    slug: "ribbed-tank-top",
    name: "Ribbed Tank Top",
    description:
      "Fine-gauge ribbed tank with a square neckline and a close, second-skin fit.",
    category: "women",
    price: 18000,
    compare_at_price: null,
    stock: 20,
    status: "active",
    is_featured: false,
    is_new_arrival: false,
    created_at: "2026-09-05T10:00:00.000Z",
    updated_at: now,
    images: [
      image("p8-img-1", 3, 0, "Ribbed Tank Top front"),
      image("p8-img-2", 7, 1, "Ribbed Tank Top detail"),
    ],
    sizes: [
      { id: "p8-s1", product_id: "88888888-8888-4888-8888-888888888888", label: "XS", stock: 6, position: 0 },
      { id: "p8-s2", product_id: "88888888-8888-4888-8888-888888888888", label: "S", stock: 8, position: 1 },
      { id: "p8-s3", product_id: "88888888-8888-4888-8888-888888888888", label: "M", stock: 6, position: 2 },
    ],
    colors: [
      { id: "p8-c1", product_id: "88888888-8888-4888-8888-888888888888", name: "White", hex: "#f7f5f0", position: 0 },
      { id: "p8-c2", product_id: "88888888-8888-4888-8888-888888888888", name: "Black", hex: "#0a0a0a", position: 1 },
    ],
  },
];

type AnyRow = Record<string, unknown>;

function createBuilder(table: string) {
  const filters: ((row: AnyRow) => boolean)[] = [];
  const orders: { column: string; ascending: boolean }[] = [];
  let limit: number | null = null;

  const rows = (): AnyRow[] => {
    const source =
      table === "products" ? (PRODUCTS as unknown as AnyRow[]) : [];
    let result = source.filter((row) => filters.every((filter) => filter(row)));

    for (const order of [...orders].reverse()) {
      result = [...result].sort((a, b) => {
        const left = a[order.column];
        const right = b[order.column];
        const cmp =
          typeof left === "boolean" && typeof right === "boolean"
            ? Number(left) - Number(right)
            : typeof left === "number" && typeof right === "number"
              ? left - right
              : String(left).localeCompare(String(right));
        return order.ascending ? cmp : -cmp;
      });
    }

    return limit === null ? result : result.slice(0, limit);
  };

  const api: AnyRow = {
    select: () => api,
    eq: (column: string, value: unknown) => {
      filters.push((row) => String(row[column]) === String(value));
      return api;
    },
    neq: (column: string, value: unknown) => {
      filters.push((row) => String(row[column]) !== String(value));
      return api;
    },
    or: () => api,
    order: (column: string, options?: { ascending?: boolean }) => {
      orders.push({ column, ascending: options?.ascending !== false });
      return api;
    },
    limit: (value: number) => {
      limit = value;
      return api;
    },
    returns: () => Promise.resolve({ data: rows(), error: null }),
    maybeSingle: () =>
      Promise.resolve({ data: rows()[0] ?? null, error: null }),
  };

  return api;
}

const mockClient = {
  from: (table: string) => createBuilder(table),
};

export function getMockCatalogClient() {
  return mockClient;
}
