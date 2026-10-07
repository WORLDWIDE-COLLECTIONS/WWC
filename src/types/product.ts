export type ProductCategory = "men" | "women" | "unisex";

export type ProductStatus = "active" | "draft" | "archived";

export type ProductGender = "men" | "women" | "unisex";

export type ProductColor = {
  id: string;
  product_id: string;
  name: string;
  hex: string;
  position: number;
};

export type ProductSize = {
  id: string;
  product_id: string;
  label: string;
  stock: number;
  position: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  position: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  gender: ProductGender;
  price: number;
  compare_at_price: number | null;
  stock: number;
  status: ProductStatus;
  is_featured: boolean;
  is_new_arrival: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductWithRelations = Product & {
  images: ProductImage[];
  sizes: ProductSize[];
  colors: ProductColor[];
};

export type CollectionFilters = {
  category?: ProductCategory;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "featured";
};

/** Values a customer can actually filter on, derived from the visible scope. */
export type CatalogueFacets = {
  sizes: string[];
  colors: { name: string; hex: string }[];
  price: { min: number; max: number } | null;
};
