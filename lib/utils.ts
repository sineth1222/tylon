import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*export function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}*/
export function formatPrice(amount: number | null | undefined): string {
  if (amount == null || isNaN(Number(amount))) return "Rs. 0";
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-gold/10 text-gold border border-gold/20",
    confirmed: "bg-army/10 text-army-light border border-army/20",
    processing: "bg-army/10 text-army-light border border-army/30",
    shipped: "bg-army/20 text-army-light border border-army/40",
    delivered: "bg-army/20 text-army-light border border-army",
    cancelled: "bg-danger/10 text-danger border border-danger/20",
  };
  return (
    colors[status] ||
    "bg-tylon-card text-tylon-muted border border-tylon-border"
  );
}

export function getOrderStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
}

export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "bg-gold/10 text-gold border border-gold/20",
    paid: "bg-army/20 text-army-light border border-army/30",
    failed: "bg-danger/10 text-danger border border-danger/20",
    refunded: "bg-gray-100 text-gray-800",
  };
  return (
    colors[status] ||
    "bg-tylon-card text-tylon-muted border border-tylon-border"
  );
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export const SRI_LANKA_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: "All",
  // Men's
  shirts: "Shirts",
  tshirts: "T-Shirts",
  trousers: "Trousers",
  shorts: "Shorts",
  // Women's
  dresses: "Dresses",
  skirts: "Skirts",
  blouses: "Blouses",
  frocks: "Frocks",
  sarees: "Sarees",
  lehenga: "Lehenga",
  // Shared
  outerwear: "Outerwear",
  pants: "Pants",
  basics: "Basics",
  tailoring: "Tailoring",
  bottoms: "Bottoms",
  // Kids
  kids_sets: "Kids Sets",
  kids_tops: "Kids Tops",
  kids_bottoms: "Kids Bottoms",
  // Accessories
  accessories: "Accessories",
  caps: "Caps & Hats",
  sunglasses: "Sunglasses",
  shoes: "Shoes",
  slippers: "Slippers",
  sandals: "Sandals",
  bags: "Bags",
  belts: "Belts",
  watches: "Watches",
  jewellery: "Jewellery",
  scarves: "Scarves & Shawls",
};

export const GENDER_LABELS: Record<string, string> = {
  all: "All",
  mens: "Men's",
  womens: "Women's",
  kids: "Kids",
  unisex: "Unisex",
};
