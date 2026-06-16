"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils";
import { FilterState } from "@/types";

// ─── Fetch helpers ────────────────────────────────────────────────

export async function getProducts(filters?: Partial<FilterState>) {
  const supabase = await createAdminClient();

  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters?.gender && filters.gender !== "all") {
    if (
      filters.gender === "mens" ||
      filters.gender === "womens" ||
      filters.gender === "kids"
    ) {
      query = query.in("gender", [filters.gender, "unisex"]);
    } else {
      query = query.eq("gender", filters.gender);
    }
  }
  if (filters?.isNew) query = query.eq("is_new", true);

  if (filters?.priceRange && filters.priceRange !== "any") {
    if (filters.priceRange === "under10k") query = query.lt("price", 10000);
    if (filters.priceRange === "10k-20k")
      query = query.gte("price", 10000).lte("price", 20000);
    if (filters.priceRange === "over20k") query = query.gt("price", 20000);
  }

  switch (filters?.sortBy) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(normalise);
}

export async function getFeaturedProducts() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return (data || []).map(normalise);
}

export async function getNewArrivals() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_new", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return (data || []).map(normalise);
}

export async function getProductBySlug(slug: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  return normalise(data);
}

export async function getProductById(id: string) {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return normalise(data);
}

export async function getAllProductsAdmin() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalise);
}

// ─── Normalise DB row → Product type ─────────────────────────────
function normalise(row: any) {
  if (!row) return row;
  const variants =
    row.variants && Array.isArray(row.variants) && row.variants.length > 0
      ? row.variants
      : buildLegacyVariants(row);
  return { ...row, variants };
}

function buildLegacyVariants(row: any) {
  const colors: { name: string; hex: string }[] = row.colors || [];
  const sizes: string[] = row.sizes || [];
  const images: string[] = row.images || [];

  if (colors.length === 0) {
    return [
      {
        colorName: "Default",
        colorHex: "#1A1A1A",
        images,
        sizes: sizes.map((s) => ({ size: s, stock: row.stock_count ?? 10 })),
      },
    ];
  }
  return colors.map((c) => ({
    colorName: c.name,
    colorHex: c.hex,
    images,
    sizes: sizes.map((s) => ({
      size: s,
      stock: Math.floor((row.stock_count ?? 10) / colors.length),
    })),
  }));
}

// ─── Mutations ────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  const supabase = await createAdminClient();
  const parsed = parseProductFormData(formData);
  if ("error" in parsed) return parsed;
  const slug = generateSlug(parsed.name);
  const { data, error } = await supabase
    .from("products")
    .insert({ ...parsed, slug })
    .select()
    .single();
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  return { success: true, product: data };
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createAdminClient();
  const parsed = parseProductFormData(formData);
  if ("error" in parsed) return parsed;
  const { error } = await supabase.from("products").update(parsed).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  return { success: true };
}

// ── Archive (hide from store) ─────────────────────────────────────
export async function archiveProduct(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  return { success: true };
}

// ── Unarchive (restore to active) ────────────────────────────────
export async function unarchiveProduct(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ is_active: true })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  return { success: true };
}

// ── Hard delete (permanent) ───────────────────────────────────────
export async function deleteProduct(id: string) {
  const supabase = await createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/collections");
  return { success: true };
}

// ─── Form data parser ─────────────────────────────────────────────
function parseProductFormData(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const priceStr = formData.get("price") as string;
  const price = parseFloat(priceStr);

  if (!name) return { error: "Product name is required" };
  if (isNaN(price) || price <= 0) return { error: "Valid price is required" };

  const originalPriceStr = formData.get("original_price") as string;
  const original_price =
    originalPriceStr && !isNaN(parseFloat(originalPriceStr))
      ? parseFloat(originalPriceStr)
      : null;

  const variantsRaw = formData.get("variants") as string;
  const variants = variantsRaw ? JSON.parse(variantsRaw) : [];

  const sizesRaw = formData.get("sizes") as string;
  const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];

  const colorsRaw = formData.get("colors") as string;
  const colors = colorsRaw ? JSON.parse(colorsRaw) : [];

  const imagesRaw = formData.get("images") as string;
  const images = imagesRaw ? JSON.parse(imagesRaw) : [];

  const tagsRaw = formData.get("tags") as string;
  const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

  const is_new = formData.get("is_new") === "true";
  const is_featured = formData.get("is_featured") === "true";
  const is_active = formData.get("is_active") !== "false";

  const stock_count = parseInt(formData.get("stock_count") as string) || 0;

  return {
    name,
    description: (formData.get("description") as string) || null,
    price,
    original_price,
    category: formData.get("category") as string,
    gender: formData.get("gender") as string,
    variants,
    sizes,
    colors,
    images,
    tags,
    is_new,
    is_featured,
    is_active,
    stock_count,
    material: (formData.get("material") as string) || null,
    care_instructions: (formData.get("care_instructions") as string) || null,
  };
}
