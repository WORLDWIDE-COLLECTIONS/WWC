"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { ProductCategory, ProductStatus } from "@/types/product";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/server";
import { createAuthClient } from "@/lib/supabase/auth";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ActionResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export type AuthState = { error: string | null };

export type ProductInput = {
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  status: ProductStatus;
  price: number;
  compare_at_price: number | null;
  stock: number;
  is_featured: boolean;
  is_new_arrival: boolean;
};

type ParsedProduct = ProductInput & {
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: File[];
};

const STATUSES: ProductStatus[] = ["draft", "active", "archived"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fail(error: string): ActionResult {
  return { ok: false, error };
}

/** Verifies the cookie session and returns a client that can write. */
async function getWriter(): Promise<
  { ok: true; supabase: SupabaseClient } | { ok: false; error: string }
> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Supabase is not configured — add credentials to .env.local first.",
    };
  }

  const sessionClient = await createAuthClient();
  if (!sessionClient) return { ok: false, error: "Supabase is not configured." };

  const {
    data: { user },
  } = await sessionClient.auth.getUser();

  if (!user) {
    return { ok: false, error: "Your session expired — sign in again." };
  }

  const supabase = createAdminClient() ?? sessionClient;
  return { ok: true, supabase };
}

function parseProductForm(formData: FormData): { ok: true; value: ParsedProduct } | { ok: false; error: string } {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, error: "Product name is required." };

  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || name);
  if (!slug) return { ok: false, error: "Enter a valid slug." };

  const price = Number(formData.get("price") ?? 0);
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Price must be zero or more." };
  }

  const compareRaw = String(formData.get("compare_at_price") ?? "").trim();
  const compare_at_price = compareRaw === "" ? null : Number(compareRaw);
  if (compare_at_price !== null && (!Number.isFinite(compare_at_price) || compare_at_price < 0)) {
    return { ok: false, error: "Compare-at price must be zero or more." };
  }

  const stockRaw = Number(formData.get("stock") ?? 0);
  const stock = Number.isFinite(stockRaw) ? Math.max(0, Math.trunc(stockRaw)) : 0;

  const statusRaw = String(formData.get("status") ?? "draft") as ProductStatus;
  const categoryRaw = String(formData.get("category") ?? "men");

  const colorNames = formData.getAll("color-name").map((value) => String(value).trim());
  const colorHexes = formData.getAll("color-hex").map((value) => String(value).trim());
  const colors = colorNames
    .map((colorName, index) => ({
      name: colorName,
      hex: colorHexes[index] || "#0b0b0c",
    }))
    .filter((color) => color.name.length > 0);

  const images = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  return {
    ok: true,
    value: {
      name,
      slug,
      description: String(formData.get("description") ?? "").trim() || null,
      category: categoryRaw === "women" ? "women" : "men",
      status: STATUSES.includes(statusRaw) ? statusRaw : "draft",
      price,
      compare_at_price,
      stock,
      is_featured: formData.get("is_featured") === "on",
      is_new_arrival: formData.get("is_new_arrival") === "on",
      sizes: formData.getAll("size").map((value) => String(value)).filter(Boolean),
      colors,
      images,
    },
  };
}

function revalidateCatalogue() {
  revalidatePath("/", "layout");
}

export async function saveProduct(
  productId: string | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = parseProductForm(formData);
  if (!parsed.ok) return fail(parsed.error);
  const value = parsed.value;

  const writer = await getWriter();
  if (!writer.ok) return fail(writer.error);
  const { supabase } = writer;

  const row = {
    name: value.name,
    slug: value.slug,
    description: value.description,
    category: value.category,
    status: value.status,
    price: value.price,
    compare_at_price: value.compare_at_price,
    stock: value.stock,
    is_featured: value.is_featured,
    is_new_arrival: value.is_new_arrival,
  };

  let id = productId;

  if (productId) {
    const { data, error } = await supabase
      .from("products")
      .update(row)
      .eq("id", productId)
      .select("id")
      .single();

    if (error || !data) return fail(error?.message ?? "Product could not be updated.");
    id = data.id as string;
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(row)
      .select("id")
      .single();

    if (error || !data) return fail(error?.message ?? "Product could not be created.");
    id = data.id as string;
  }

  const productIdFinal = id;

  const variants = await syncVariants(supabase, productIdFinal, value);
  if (variants) return fail(variants);

  const images = await syncImages(supabase, productIdFinal, value.images);
  if (images) return fail(images);

  revalidateCatalogue();
  return { ok: true, id: productIdFinal };
}

async function syncVariants(
  supabase: SupabaseClient,
  productId: string,
  value: ParsedProduct,
): Promise<string | null> {
  const [sizesResult, colorsResult] = await Promise.all([
    supabase.from("product_sizes").delete().eq("product_id", productId),
    supabase.from("product_colors").delete().eq("product_id", productId),
  ]);
  if (sizesResult.error) return sizesResult.error.message;
  if (colorsResult.error) return colorsResult.error.message;

  if (value.sizes.length > 0) {
    const { error } = await supabase.from("product_sizes").insert(
      value.sizes.map((label, index) => ({
        product_id: productId,
        label,
        stock: value.stock,
        position: index,
      })),
    );
    if (error) return error.message;
  }

  if (value.colors.length > 0) {
    const { error } = await supabase.from("product_colors").insert(
      value.colors.map((color, index) => ({
        product_id: productId,
        name: color.name,
        hex: color.hex,
        position: index,
      })),
    );
    if (error) return error.message;
  }

  return null;
}

async function syncImages(
  supabase: SupabaseClient,
  productId: string,
  files: File[],
): Promise<string | null> {
  if (files.length === 0) return null;

  const { data: existing } = await supabase
    .from("product_images")
    .select("id, url")
    .eq("product_id", productId);

  if (existing && existing.length > 0) {
    await supabase.from("product_images").delete().eq("product_id", productId);

    const bucket = supabase.storage.from("product-images");
    await Promise.all(
      existing.map((image) => {
        const path = String(image.url).split("/object/public/product-images/")[1];
        return path ? bucket.remove([path]) : Promise.resolve(null);
      }),
    );
  }

  const bucket = supabase.storage.from("product-images");
  const rows: { product_id: string; url: string; alt: string | null; position: number }[] = [];

  for (const [index, file] of files.entries()) {
    const safeName = file.name.replace(/[^\w.-]+/g, "-").toLowerCase();
    const path = `${productId}/${Date.now()}-${index}-${safeName}`;

    const { error } = await bucket.upload(path, file, {
      upsert: true,
      contentType: file.type || "application/octet-stream",
    });
    if (error) return error.message;

    const {
      data: { publicUrl },
    } = bucket.getPublicUrl(path);

    rows.push({
      product_id: productId,
      url: publicUrl,
      alt: file.name.replace(/\.[^.]+$/, ""),
      position: index,
    });
  }

  const { error } = await supabase.from("product_images").insert(rows);
  return error ? error.message : null;
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  const writer = await getWriter();
  if (!writer.ok) return fail(writer.error);
  const { supabase } = writer;

  const { data: images } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", productId);

  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) return fail(error.message);

  if (images && images.length > 0) {
    const bucket = supabase.storage.from("product-images");
    const paths = images
      .map((image) => String(image.url).split("/object/public/product-images/")[1])
      .filter((path): path is string => Boolean(path));
    if (paths.length > 0) await bucket.remove(paths);
  }

  revalidateCatalogue();
  return { ok: true, id: productId };
}

export async function signIn(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createAuthClient();
  if (!supabase) {
    return {
      error: "Supabase is not configured — add credentials to .env.local first.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Invalid email or password." };
  }

  revalidatePath("/", "layout");

  const next = String(formData.get("next") ?? "");
  const target =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/admin/login")
      ? next
      : "/admin";

  redirect(target);
}

export async function signOut(): Promise<void> {
  const supabase = await createAuthClient();
  if (supabase) await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/admin/login");
}
