"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash2, X } from "lucide-react";

import { deleteProduct, saveProduct } from "@/lib/admin/actions";
import type { ProductWithRelations } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Checkbox, Field, TextField } from "@/components/ui/field";
import { Select, Textarea } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { Separator } from "@/components/ui/separator";

const sizeLabels = ["XS", "S", "M", "L", "XL", "XXL"];

type ColorRow = { id: string; name: string; hex: string };

export type ProductFormProps = {
  mode: "create" | "edit";
  productId?: string;
  product?: ProductWithRelations | null;
};

export function ProductForm({ mode, productId, product }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [sizes, setSizes] = React.useState<string[]>(
    product?.sizes.map((size) => size.label) ?? [],
  );
  const [colors, setColors] = React.useState<ColorRow[]>(
    product?.colors.map((color) => ({
      id: color.id,
      name: color.name,
      hex: color.hex,
    })) ?? [],
  );
  const [files, setFiles] = React.useState<File[]>([]);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [pending, startTransition] = React.useTransition();

  const handleFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    if (picked.length === 0) return;

    setFiles(picked);
    toast({
      title: `${picked.length} image${picked.length > 1 ? "s" : ""} selected`,
      description: "Uploaded to Supabase Storage when the product is saved.",
      variant: "success",
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    formData.delete("images");
    files.forEach((file) => formData.append("images", file));

    startTransition(async () => {
      const result = await saveProduct(productId ?? null, formData);

      if (result.ok) {
        toast({
          title: mode === "edit" ? "Product updated" : "Product created",
          description: "The storefront catalogue refreshed with your changes.",
          variant: "success",
        });
        router.push("/admin/products");
        router.refresh();
        return;
      }

      toast({
        title: "Could not save product",
        description: result.error,
        variant: "error",
      });
    });
  };

  const handleDelete = () => {
    if (!productId) return;

    startTransition(async () => {
      const result = await deleteProduct(productId);

      if (result.ok) {
        toast({
          title: "Product deleted",
          description: "The record and its images were removed.",
          variant: "success",
        });
        router.push("/admin/products");
        router.refresh();
        return;
      }

      toast({
        title: "Could not delete product",
        description: result.error,
        variant: "error",
      });
    });
  };

  const toggleSize = (size: string) =>
    setSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size],
    );

  const addColor = () =>
    setColors((current) => [
      ...current,
      { id: crypto.randomUUID(), name: "", hex: "#0b0b0c" },
    ]);

  const updateColor = (id: string, patch: Partial<ColorRow>) =>
    setColors((current) =>
      current.map((color) => (color.id === id ? { ...color, ...patch } : color)),
    );

  const removeColor = (id: string) =>
    setColors((current) => current.filter((color) => color.id !== id));

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card padding="lg" className="flex flex-col gap-6 lg:col-span-2">
          <h2 className="eyebrow text-graphite">Details</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Product name"
              name="name"
              placeholder="E.g. Structured Wool Coat"
              defaultValue={product?.name}
              required
            />
            <TextField
              label="Slug"
              name="slug"
              placeholder="structured-wool-coat"
              defaultValue={product?.slug}
              hint="Used in the product URL"
            />
          </div>

          <Field label="Description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              placeholder="Fabric, fit, care and styling notes"
              defaultValue={product?.description ?? ""}
            />
          </Field>

          <Field label="Category" htmlFor="category" className="sm:max-w-xs">
            <Select
              id="category"
              name="category"
              defaultValue={product?.category ?? "men"}
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
            </Select>
          </Field>
        </Card>

        <Card padding="lg" className="flex flex-col gap-6">
          <h2 className="eyebrow text-graphite">Publishing</h2>

          <Field label="Status" htmlFor="status">
            <Select
              id="status"
              name="status"
              defaultValue={product?.status ?? "active"}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>

          <Separator />

          <div className="flex flex-col gap-4">
            <Checkbox
              name="is_featured"
              defaultChecked={product?.is_featured}
              label={
                <span className="flex items-center gap-2">
                  Featured <Badge variant="gilt">Homepage</Badge>
                </span>
              }
            />
            <Checkbox
              name="is_new_arrival"
              defaultChecked={product?.is_new_arrival}
              label={
                <span className="flex items-center gap-2">
                  New arrival <Badge variant="outline">Badge</Badge>
                </span>
              }
            />
          </div>
        </Card>
      </div>

      <Card padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="eyebrow text-graphite">Pricing &amp; stock</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <TextField
            label="Price"
            name="price"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0.00"
            defaultValue={product ? String(product.price) : undefined}
            required
          />
          <TextField
            label="Compare at"
            name="compare_at_price"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="Optional"
            hint="Shown struck through"
            defaultValue={
              product?.compare_at_price != null
                ? String(product.compare_at_price)
                : undefined
            }
          />
          <TextField
            label="Total stock"
            name="stock"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            defaultValue={product ? String(product.stock) : undefined}
          />
          <div className="hidden lg:block" />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg" className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="eyebrow text-graphite">Sizes</h2>
            <span className="text-xs text-muted">{sizes.length} selected</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizeLabels.map((size) => (
              <Chip
                key={size}
                active={sizes.includes(size)}
                onClick={() => toggleSize(size)}
              >
                {size}
              </Chip>
            ))}
          </div>
          {sizes.map((size) => (
            <input key={size} type="hidden" name="size" value={size} />
          ))}
          <p className="text-xs leading-relaxed text-muted">
            Selected sizes are stored against the product record — stock levels
            follow the total above.
          </p>
        </Card>

        <Card padding="lg" className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="eyebrow text-graphite">Colours</h2>
            <Button size="sm" variant="outline" onClick={addColor} type="button">
              Add colour
            </Button>
          </div>

          {colors.length === 0 ? (
            <p className="text-xs leading-relaxed text-muted">
              No colours yet — optional. Add one when the garment comes in
              colourways.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {colors.map((color) => (
                <div key={color.id} className="flex items-end gap-3">
                  <TextField
                    label="Colour name"
                    name="color-name"
                    inputSize="sm"
                    placeholder="Onyx"
                    value={color.name}
                    onChange={(event) =>
                      updateColor(color.id, { name: event.target.value })
                    }
                    className="flex-1"
                  />
                  <Field label="Hex" htmlFor={`hex-${color.id}`} className="w-24">
                    <input
                      id={`hex-${color.id}`}
                      type="color"
                      name="color-hex"
                      value={color.hex}
                      onChange={(event) =>
                        updateColor(color.id, { hex: event.target.value })
                      }
                      className="h-11 w-full cursor-pointer border border-line bg-chalk p-1"
                    />
                  </Field>
                  <button
                    type="button"
                    aria-label="Remove colour"
                    onClick={() => removeColor(color.id)}
                    className="grid size-11 place-items-center border border-line text-graphite transition-colors hover:border-danger hover:text-danger"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card padding="lg" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="eyebrow text-graphite">Images</h2>
          <span className="text-xs text-muted">
            {files.length} selected
            {mode === "edit" && files.length === 0 && product?.images.length
              ? ` · ${product.images.length} current`
              : ""}
          </span>
        </div>

        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-line bg-bone/50 px-6 py-12 text-center transition-colors hover:border-graphite/60 focus-within:border-gilt focus-within:outline focus-within:outline-2 focus-within:outline-gilt">
          <ImagePlus className="size-6 text-graphite" aria-hidden="true" />
          <span className="eyebrow text-ink">Upload images</span>
          <span className="max-w-sm text-xs leading-relaxed text-muted">
            Files upload to Supabase Storage under the product folder — first
            image becomes the cover. Uploading replaces the current set.
          </span>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => handleFiles(event.target.files)}
          />
        </label>

        {files.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {files.map((file) => (
              <li
                key={file.name}
                className="inline-flex items-center gap-2 border border-line bg-chalk px-3 py-2 text-xs text-graphite"
              >
                {file.name}
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() =>
                    setFiles((current) =>
                      current.filter((item) => item.name !== file.name),
                    )
                  }
                  className="text-muted transition-colors hover:text-danger"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </Card>

      <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-xs leading-relaxed text-muted">
          Saving writes to Supabase Postgres and refreshes the storefront.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => router.back()} type="button">
            Cancel
          </Button>
          {mode === "edit" && productId ? (
            <Button
              variant="accent"
              type="button"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : null}
          <Button type="submit" loading={pending}>
            {mode === "edit" ? "Save changes" : "Create product"}
          </Button>
        </div>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete this product?"
        description="This removes the record, its images and its variants from Supabase."
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              type="button"
              onClick={() => setConfirmDelete(false)}
            >
              Keep product
            </Button>
            <Button
              variant="accent"
              type="button"
              loading={pending}
              onClick={handleDelete}
            >
              Delete permanently
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-muted">
          The product will disappear from the storefront immediately. This
          action cannot be undone.
        </p>
      </Modal>
    </form>
  );
}
