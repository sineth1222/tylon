export type ProductCategory =
  // Men's
  | "shirts"
  | "tshirts"
  | "trousers"
  | "shorts"
  | "pants"
  // Women's
  | "dresses"
  | "skirts"
  | "blouses"
  | "frocks"
  | "sarees"
  | "lehenga"
  // Shared
  | "outerwear"
  | "basics"
  | "tailoring"
  | "bottoms"
  // Kids
  | "kids_sets"
  | "kids_tops"
  | "kids_bottoms"
  // Accessories
  | "accessories"
  | "caps"
  | "sunglasses"
  | "shoes"
  | "slippers"
  | "sandals"
  | "bags"
  | "belts"
  | "watches"
  | "jewellery"
  | "scarves";
export type ProductGender = "mens" | "womens" | "kids" | "unisex";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentMethod = "cod" | "online";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type UserRole = "customer" | "admin";

// ─── Variant system ───────────────────────────────────────────────
// Each colour has its own images + per-size stock
export interface SizeStock {
  size: string; // "S" | "M" | "L" | "XL" | "36" | "2Y" …
  stock: number; // 0 = out of stock → button disabled on PDP
}

export interface ProductVariant {
  colorName: string; // "Navy Blue"
  colorHex: string; // "#1B2A4A"
  images: string[]; // ImageKit URLs, first is primary
  sizes: SizeStock[]; // sizes + stock for this colour
}

// ─── Product ──────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: ProductCategory;
  gender: ProductGender;
  variants: ProductVariant[];
  // flat arrays kept for search / filter (auto-derived from variants on save)
  sizes: string[];
  colors: { name: string; hex: string }[];
  images: string[];
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  stock_count: number;
  material: string | null;
  care_instructions: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ─── Cart ─────────────────────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  colorName: string;
  colorHex: string;
  image: string;
}

// ─── Orders ───────────────────────────────────────────────────────
export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  district: string;
  postal_code?: string;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  status_history: OrderStatusHistory[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface FilterState {
  category: ProductCategory | "all";
  gender: ProductGender | "all";
  priceRange: "any" | "under10k" | "10k-20k" | "over20k";
  isNew: boolean;
  sortBy: "newest" | "price_asc" | "price_desc" | "name";
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
  revenueByDay: { date: string; revenue: number }[];
}

export interface ImageKitResult {
  url: string;
  fileId: string;
  name: string;
  thumbnailUrl: string;
}
