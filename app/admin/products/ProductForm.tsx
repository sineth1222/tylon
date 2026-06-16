"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { Product, ProductVariant } from "@/types";
import VariantBuilder from "@/components/admin/VariantBuilder";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const CATEGORIES = [
  "outerwear",
  "dresses",
  "tailoring",
  "basics",
  "bottoms",
  "shirts",
  "tshirts",
  "trousers",
  "shorts",
  "pants",
  "skirts",
  "blouses",
  "frocks",
  "sarees",
  "lehenga",
  "kids_sets",
  "kids_tops",
  "kids_bottoms",
  "accessories",
  "caps",
  "sunglasses",
  "shoes",
  "slippers",
  "sandals",
  "bags",
  "belts",
  "watches",
  "jewellery",
  "scarves",
] as const;
const GENDERS = ["mens", "womens", "kids", "unisex"];

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Basic fields
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(
    product?.original_price?.toString() || "",
  );
  const [category, setCategory] = useState(product?.category || "basics");
  const [gender, setGender] = useState(product?.gender || "unisex");
  const [material, setMaterial] = useState(product?.material || "");
  const [care, setCare] = useState(product?.care_instructions || "");
  const [isNew, setIsNew] = useState(product?.is_new ?? false);
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [tagInput, setTagInput] = useState("");

  // Variants (colour + images + sizes/stock)
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants && product.variants.length > 0 ? product.variants : [],
  );

  const [errors, setErrors] = useState<string[]>([]);

  const validate = (): boolean => {
    const errs: string[] = [];
    if (!name.trim()) errs.push("Product name is required");
    if (!price || isNaN(parseFloat(price)))
      errs.push("Valid price is required");
    if (variants.length === 0) errs.push("Add at least one colour variant");
    variants.forEach((v, i) => {
      if (v.images.length === 0)
        errs.push(`Variant "${v.colorName}" needs at least one image`);
      if (v.sizes.length === 0)
        errs.push(`Variant "${v.colorName}" needs at least one size`);
    });
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Derive flat arrays from variants for backward compat / search
    const allSizes = [
      ...new Set(variants.flatMap((v) => v.sizes.map((s) => s.size))),
    ];
    const allColors = variants.map((v) => ({
      name: v.colorName,
      hex: v.colorHex,
    }));
    const primaryImages = variants.flatMap((v) => v.images.slice(0, 1));
    const totalStock = variants.reduce(
      (t, v) => t + v.sizes.reduce((ts, s) => ts + s.stock, 0),
      0,
    );

    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("description", description);
    fd.set("price", price);
    fd.set("original_price", originalPrice || "");
    fd.set("category", category);
    fd.set("gender", gender);
    fd.set("material", material);
    fd.set("care_instructions", care);
    fd.set("is_new", String(isNew));
    fd.set("is_featured", String(isFeatured));
    fd.set("is_active", String(isActive));
    fd.set("stock_count", String(totalStock));
    fd.set("tags", JSON.stringify(tags));
    fd.set("variants", JSON.stringify(variants));
    fd.set("sizes", JSON.stringify(allSizes));
    fd.set("colors", JSON.stringify(allColors));
    fd.set("images", JSON.stringify(primaryImages));

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, fd)
        : await createProduct(fd);

      if ("error" in result) {
        const msg = result.error || "An error occurred";
        toast.error(msg);
        setErrors([msg]);
      } else {
        toast.success(product ? "Product updated!" : "Product created!");
        router.push("/admin/products");
        router.refresh();
      }
    });
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1">
          <div className="flex items-center gap-2 text-red-700 font-semibold text-sm mb-2">
            <AlertCircle size={16} />
            Please fix the following:
          </div>
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-600 pl-6">
              • {e}
            </p>
          ))}
        </div>
      )}

      {/* ── Basic Information ── */}
      <section className="bg-cream-50 border border-cream-200 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500">
          Basic Information
        </h2>

        <div>
          <label className="block text-xs text-stone-500 mb-1">
            Product Name *
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Essential Cotton Tee"
            required
            className="input-zora"
          />
        </div>

        <div>
          <label className="block text-xs text-stone-500 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product — materials, fit, feel…"
            rows={4}
            className="input-zora resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Price (Rs.) *
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="4500"
              required
              className="input-zora"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Original Price (optional)
            </label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="6000 (shows crossed out)"
              className="input-zora"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as (typeof CATEGORIES)[number])
              }
              className="input-zora"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="capitalize">
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Gender *
            </label>
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value as "mens" | "womens" | "kids" | "unisex")
              }
              className="input-zora"
            >
              {GENDERS.map((g) => (
                <option key={g} value={g} className="capitalize">
                  {g === "mens"
                    ? "Men's"
                    : g === "womens"
                      ? "Women's"
                      : g === "kids"
                        ? "Kids"
                        : "Unisex"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Material
            </label>
            <input
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. 100% Pima Cotton"
              className="input-zora"
            />
          </div>
          <div>
            <label className="block text-xs text-stone-500 mb-1">
              Care Instructions
            </label>
            <input
              value={care}
              onChange={(e) => setCare(e.target.value)}
              placeholder="e.g. Machine wash cold"
              className="input-zora"
            />
          </div>
        </div>
      </section>

      {/* ── Colour Variants + Images + Sizes ── */}
      <section className="bg-cream-50 border border-cream-200 rounded-2xl p-6 space-y-4">
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500">
            Colour Variants, Images & Sizes
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Each colour gets its own set of images. Stock is managed per size
            per colour.
          </p>
        </div>

        <VariantBuilder
          variants={variants}
          onChange={setVariants}
          gender={gender}
          category={category}
        />
      </section>

      {/* ── Tags ── */}
      <section className="bg-cream-50 border border-cream-200 rounded-2xl p-6 space-y-3">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500">
          Tags
        </h2>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag and press Enter"
            className="input-zora flex-1 text-sm"
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addTag())
            }
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-stone-700 text-cream-100 rounded-xl text-xs font-medium hover:bg-stone-600 transition-colors"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 bg-cream-200 text-stone-600 rounded-full px-3 py-1 text-xs font-medium"
              >
                {t}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                  className="text-stone-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Visibility ── */}
      <section className="bg-cream-50 border border-cream-200 rounded-2xl p-6">
        <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-stone-500 mb-4">
          Visibility
        </h2>
        <div className="flex flex-wrap gap-6">
          {(
            [
              {
                key: "isNew",
                label: "New Arrival",
                value: isNew,
                set: setIsNew,
              },
              {
                key: "isFeatured",
                label: "Featured on Homepage",
                value: isFeatured,
                set: setIsFeatured,
              },
              {
                key: "isActive",
                label: "Active (visible in store)",
                value: isActive,
                set: setIsActive,
              },
            ] as const
          ).map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                onClick={() => item.set(!item.value)}
                className={cn(
                  "w-11 h-6 rounded-full transition-all relative cursor-pointer",
                  item.value ? "bg-stone-700" : "bg-cream-300",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
                    item.value ? "left-[22px]" : "left-0.5",
                  )}
                />
              </div>
              <span className="text-sm text-stone-700 group-hover:text-charcoal-900">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-stone-700 text-cream-100 py-4 rounded-xl text-sm font-semibold tracking-[0.15em] uppercase hover:bg-stone-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending
            ? product
              ? "Updating…"
              : "Creating…"
            : product
              ? "Update Product"
              : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-6 py-4 border border-cream-300 rounded-xl text-sm text-stone-500 hover:border-stone-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
