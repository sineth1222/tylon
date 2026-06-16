"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  CheckCircle2,
  AlertCircle,
  Ruler,
  X,
} from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import ProductCard from "@/components/products/ProductCard";
import toast from "react-hot-toast";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
  user: any;
}

const SIZE_GUIDE = {
  headers: ["SIZE", "BODY LENGTH", "CHEST WIDTH", "SLEEVE LENGTH"],
  rows_cm: [
    {
      size: "S",
      bodyLength: "54.29",
      chestWidth: "57.79",
      sleeveLength: "81.92",
    },
    {
      size: "M",
      bodyLength: "55.88",
      chestWidth: "60.33",
      sleeveLength: "83.19",
    },
    {
      size: "L",
      bodyLength: "57.47",
      chestWidth: "64.14",
      sleeveLength: "84.77",
    },
    {
      size: "XL",
      bodyLength: "59.05",
      chestWidth: "67.95",
      sleeveLength: "86.36",
    },
  ],
  rows_in: [
    { size: "S", bodyLength: "21⅜", chestWidth: "22¾", sleeveLength: "32¼" },
    { size: "M", bodyLength: "22", chestWidth: "23¾", sleeveLength: "32¾" },
    { size: "L", bodyLength: "22⅝", chestWidth: "25¼", sleeveLength: "33⅜" },
    { size: "XL", bodyLength: "23¼", chestWidth: "26¾", sleeveLength: "34" },
  ],
  measurements: [
    {
      label: "BODY LENGTH",
      desc: "Straight down from high point shoulder to bottom edge",
      color: "#4A5C3A",
    },
    {
      label: "CHEST WIDTH",
      desc: "1 inch down from bottom of armhole, measured straight across",
      color: "#6B8050",
    },
    {
      label: "SLEEVE LENGTH",
      desc: "3-point measurement from center back to shoulder point to sleeve edge",
      color: "#8A7340",
    },
  ],
};

export default function ProductDetailClient({
  product,
  relatedProducts,
  user,
}: ProductDetailClientProps) {
  const { addItem } = useCart();

  const variants: ProductVariant[] = useMemo(() => {
    if (product.variants && product.variants.length > 0)
      return product.variants;
    return product.colors.map((c) => ({
      colorName: c.name,
      colorHex: c.hex,
      images: product.images,
      sizes: product.sizes.map((s) => ({ size: s, stock: 10 })),
    }));
  }, [product]);

  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState<"cm" | "in">("cm");

  const activeVariant = variants[activeVariantIdx];
  const images = activeVariant?.images?.length
    ? activeVariant.images
    : product.images;

  const switchVariant = (idx: number) => {
    setActiveVariantIdx(idx);
    setActiveImageIdx(0);
    setSelectedSize(null);
  };

  const stockForSize = (size: string): number =>
    activeVariant?.sizes.find((s) => s.size === size)?.stock ?? 0;

  const selectedSizeStock = selectedSize ? stockForSize(selectedSize) : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("SELECT A SIZE FIRST");
      return;
    }
    if (selectedSizeStock === 0) {
      toast.error("OUT OF STOCK");
      return;
    }
    addItem(product, quantity, selectedSize, {
      name: activeVariant.colorName,
      hex: activeVariant.colorHex,
    });
    setAddedToCart(true);
    toast.success(`${product.name} — ADDED`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : null;

  const activeRows =
    sizeUnit === "cm" ? SIZE_GUIDE.rows_cm : SIZE_GUIDE.rows_in;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-mono text-[10px] text-tylon-muted mb-6 overflow-x-auto whitespace-nowrap py-1 tracking-widest">
        <Link href="/" className="hover:text-tylon-primary transition-colors">
          HOME
        </Link>
        <span className="text-tylon-border">/</span>
        <Link
          href="/collections"
          className="hover:text-tylon-primary transition-colors"
        >
          COLLECTION
        </Link>
        <span className="text-tylon-border">/</span>
        <Link
          href={`/collections?category=${product.category}`}
          className="hover:text-tylon-primary capitalize transition-colors"
        >
          {product.category.toUpperCase()}
        </Link>
        <span className="text-tylon-border">/</span>
        <span className="text-tylon-primary truncate max-w-[150px]">
          {product.name.toUpperCase()}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 mb-20">
        {/* ── Image Gallery ── */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden bg-tylon-secondary border border-tylon-border">
            {images[activeImageIdx] ? (
              <Image
                src={images[activeImageIdx]}
                alt={`${product.name} — ${activeVariant?.colorName}`}
                fill
                className="object-cover transition-opacity duration-300"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-display text-tylon-muted text-4xl tracking-[0.2em]">
                  TYLON
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_new && (
                <div className="bg-army text-tylon-primary font-mono text-[9px] font-bold tracking-[0.25em] uppercase px-3 py-1.5">
                  NEW DROP
                </div>
              )}
              {discount && (
                <div className="bg-danger text-tylon-primary font-mono text-[9px] font-bold tracking-wide px-3 py-1.5">
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIdx((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-tylon-bg/80 border border-tylon-border flex items-center justify-center hover:bg-tylon-card transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft size={16} className="text-tylon-primary" />
                </button>
                <button
                  onClick={() =>
                    setActiveImageIdx((i) => Math.min(images.length - 1, i + 1))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-tylon-bg/80 border border-tylon-border flex items-center justify-center hover:bg-tylon-card transition-colors backdrop-blur-sm"
                >
                  <ChevronRight size={16} className="text-tylon-primary" />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={cn(
                      "transition-all duration-300",
                      i === activeImageIdx
                        ? "bg-army w-4 h-1"
                        : "bg-tylon-muted/40 w-1 h-1",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden border transition-all",
                    i === activeImageIdx
                      ? "border-army"
                      : "border-tylon-border hover:border-tylon-muted",
                  )}
                >
                  <Image
                    src={img}
                    alt={`View ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="space-y-6 lg:pt-2">
          {/* Name & price */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] text-army uppercase mb-3">
              — {product.category.toUpperCase()}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-[0.05em] text-tylon-primary mb-4 uppercase">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="font-display text-3xl font-bold text-tylon-primary tracking-wider">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="font-mono text-sm text-tylon-muted line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {discount && (
                <span className="font-mono text-[10px] tracking-widest text-danger bg-danger/10 border border-danger/20 px-3 py-1">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-tylon-muted leading-relaxed text-sm border-l-2 border-army pl-4">
              {product.description}
            </p>
          )}

          {/* Colour Selector */}
          {variants.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-tylon-muted">
                  COLOUR
                </p>
                <span className="font-mono text-[10px] tracking-widest text-tylon-primary">
                  {activeVariant?.colorName?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {variants.map((v, i) => (
                  <button
                    key={v.colorName}
                    onClick={() => switchVariant(i)}
                    title={v.colorName}
                    className={cn(
                      "w-8 h-8 border-2 transition-all hover:scale-110",
                      activeVariantIdx === i
                        ? "border-army scale-110 shadow-lg shadow-army/30"
                        : "border-tylon-border hover:border-tylon-muted",
                    )}
                    style={{ backgroundColor: v.colorHex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {activeVariant && activeVariant.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-tylon-muted">
                  SIZE
                </p>
                <div className="flex items-center gap-3">
                  {!selectedSize && (
                    <span className="font-mono text-[10px] text-tylon-muted/60">
                      SELECT SIZE
                    </span>
                  )}
                  {selectedSizeStock !== null &&
                    selectedSizeStock > 0 &&
                    selectedSizeStock <= 5 && (
                      <span className="font-mono text-[9px] tracking-widest text-gold bg-gold/10 border border-gold/20 px-2 py-0.5">
                        ONLY {selectedSizeStock} LEFT
                      </span>
                    )}
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-army hover:text-army-light transition-colors"
                  >
                    <Ruler size={12} />
                    SIZE GUIDE
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeVariant.sizes.map(({ size, stock }) => {
                  const outOfStock = stock === 0;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      className={cn(
                        "relative px-5 py-3 font-mono text-[11px] tracking-[0.2em] border-2 transition-all min-w-[52px] text-center",
                        isSelected
                          ? "bg-army text-tylon-primary border-army"
                          : outOfStock
                            ? "bg-tylon-card text-tylon-muted/30 border-tylon-border cursor-not-allowed line-through"
                            : "bg-tylon-card text-tylon-muted border-tylon-border hover:border-army hover:text-tylon-primary",
                      )}
                    >
                      {size}
                      {outOfStock && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="w-full h-px bg-tylon-muted/20 absolute rotate-[135deg]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedSize && (
                <div className="mt-2 flex items-center gap-1.5">
                  {selectedSizeStock! > 0 ? (
                    <>
                      <CheckCircle2 size={12} className="text-army" />
                      <span className="font-mono text-[10px] text-army tracking-widest">
                        IN STOCK
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} className="text-danger" />
                      <span className="font-mono text-[10px] text-danger tracking-widest">
                        OUT OF STOCK
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-0 border border-tylon-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-tylon-muted hover:bg-tylon-card hover:text-tylon-primary transition-colors border-r border-tylon-border"
              >
                <Minus size={12} />
              </button>
              <span className="font-mono text-sm font-bold w-10 text-center text-tylon-primary">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(selectedSizeStock || 99, q + 1))
                }
                className="w-10 h-10 flex items-center justify-center text-tylon-muted hover:bg-tylon-card hover:text-tylon-primary transition-colors border-l border-tylon-border"
              >
                <Plus size={12} />
              </button>
            </div>
            <span className="font-mono text-[10px] text-tylon-muted tracking-widest">
              {selectedSizeStock !== null
                ? selectedSizeStock > 0
                  ? `${selectedSizeStock} AVAILABLE`
                  : "OUT OF STOCK"
                : "SELECT SIZE"}
            </span>
          </div>

          {/* Add to Cart + Wishlist + Share */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize || selectedSizeStock === 0}
              className={cn(
                "flex-1 flex items-center justify-center gap-2.5 py-4 font-display text-sm tracking-[0.2em] uppercase transition-all",
                addedToCart
                  ? "bg-army-light text-tylon-primary"
                  : "bg-army text-tylon-primary hover:bg-army-light disabled:opacity-30 disabled:cursor-not-allowed",
              )}
            >
              {addedToCart ? (
                <>
                  <CheckCircle2 size={15} />
                  ADDED TO BAG
                </>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  ADD TO BAG
                </>
              )}
            </button>

            {user && (
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={cn(
                  "w-14 h-14 flex items-center justify-center border-2 transition-all",
                  wishlisted
                    ? "bg-danger/20 border-danger text-danger"
                    : "border-tylon-border text-tylon-muted hover:border-army",
                )}
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            )}

            <button
              onClick={() => {
                navigator.share?.({
                  title: product.name,
                  url: window.location.href,
                }) ||
                  navigator.clipboard
                    .writeText(window.location.href)
                    .then(() => toast.success("LINK COPIED"));
              }}
              className="w-14 h-14 flex items-center justify-center border-2 border-tylon-border text-tylon-muted hover:border-army transition-all"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Product detail rows */}
          <div className="bg-tylon-card border border-tylon-border divide-y divide-tylon-border">
            {[
              { label: "MATERIAL", value: product.material },
              { label: "CARE", value: product.care_instructions },
              { label: "DELIVERY", value: "2-3 working days", green: true },
              { label: "RETURN", value: "14-day easy returns" },
            ]
              .filter((r) => r.value)
              .map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="font-mono text-[9px] tracking-[0.25em] text-tylon-muted uppercase">
                    {row.label}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] text-right max-w-[60%] tracking-wide",
                      row.green ? "text-army-light" : "text-tylon-primary",
                    )}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ── THE STORY — Cinematic Section ── */}
      {product.description && (
        <section className="story-panel py-16 md:py-24 px-6 md:px-16 mb-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
            }}
          />
          <div className="max-w-4xl mx-auto relative z-10">
            <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-6">
              — THE STORY
            </p>
            <blockquote className="font-display text-3xl md:text-5xl font-bold text-tylon-primary leading-tight tracking-[0.03em] italic mb-8">
              "{product.name.toUpperCase()}"
            </blockquote>
            <p className="font-body text-tylon-muted text-base md:text-lg leading-relaxed max-w-2xl">
              {product.description}
            </p>
            <div className="mt-10 flex items-center gap-4">
              <span className="w-16 h-px bg-army" />
              <span className="font-mono text-[9px] tracking-[0.4em] text-army uppercase">
                TYLON / WEAR YOUR MISSION
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-mono text-[9px] tracking-[0.4em] text-army uppercase mb-2">
                — MORE ARMOR
              </p>
              <h2 className="font-display text-3xl font-bold tracking-[0.05em] text-tylon-primary uppercase">
                You May Also Claim
              </h2>
            </div>
            <Link
              href={`/collections?category=${product.category}`}
              className="font-mono text-[10px] tracking-widest text-tylon-muted hover:text-tylon-primary uppercase hidden sm:block"
            >
              SEE ALL →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Size Guide Modal ── */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div className="size-modal-backdrop absolute inset-0" />
          <div
            className="relative z-10 bg-tylon-secondary border border-tylon-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-tylon-border">
              <div>
                <p className="font-mono text-[9px] tracking-[0.4em] text-army uppercase mb-1">
                  — MEASUREMENTS
                </p>
                <h3 className="font-display text-xl font-bold tracking-[0.1em] text-tylon-primary uppercase">
                  HOW TO MEASURE
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {/* CM / IN Toggle */}
                <div className="flex items-center gap-1">
                  {(["cm", "in"] as const).map((u) => (
                    <button
                      key={u}
                      onClick={() => setSizeUnit(u)}
                      className={cn(
                        "px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase border transition-all",
                        sizeUnit === u
                          ? "bg-army text-tylon-primary border-army"
                          : "bg-transparent text-tylon-muted border-tylon-border hover:border-army hover:text-tylon-primary",
                      )}
                    >
                      {u.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="w-9 h-9 border border-tylon-border flex items-center justify-center text-tylon-muted hover:border-army hover:text-tylon-primary transition-all"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* T-Shirt SVG Diagram */}
              <div className="bg-tylon-card border border-tylon-border p-5">
                <img
                  src="/images/sizeguid.png"
                  alt="Size measurement guide"
                  className="w-full max-w-[300px] mx-auto block"
                />
                {/*<svg
                  viewBox="0 0 340 230"
                  className="w-full max-w-[300px] mx-auto block"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <marker
                      id="a1"
                      markerWidth="7"
                      markerHeight="7"
                      refX="3.5"
                      refY="3.5"
                      orient="auto"
                    >
                      <path
                        d="M1,1 L6,3.5 L1,6"
                        fill="none"
                        stroke="#4A5C3A"
                        strokeWidth="1.2"
                      />
                    </marker>
                    <marker
                      id="a1r"
                      markerWidth="7"
                      markerHeight="7"
                      refX="3.5"
                      refY="3.5"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M1,1 L6,3.5 L1,6"
                        fill="none"
                        stroke="#4A5C3A"
                        strokeWidth="1.2"
                      />
                    </marker>
                    <marker
                      id="a2"
                      markerWidth="7"
                      markerHeight="7"
                      refX="3.5"
                      refY="3.5"
                      orient="auto"
                    >
                      <path
                        d="M1,1 L6,3.5 L1,6"
                        fill="none"
                        stroke="#6B8050"
                        strokeWidth="1.2"
                      />
                    </marker>
                    <marker
                      id="a2r"
                      markerWidth="7"
                      markerHeight="7"
                      refX="3.5"
                      refY="3.5"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M1,1 L6,3.5 L1,6"
                        fill="none"
                        stroke="#6B8050"
                        strokeWidth="1.2"
                      />
                    </marker>
                    <marker
                      id="a3"
                      markerWidth="7"
                      markerHeight="7"
                      refX="3.5"
                      refY="3.5"
                      orient="auto"
                    >
                      <path
                        d="M1,1 L6,3.5 L1,6"
                        fill="none"
                        stroke="#8A7340"
                        strokeWidth="1.2"
                      />
                    </marker>
                    <marker
                      id="a3r"
                      markerWidth="7"
                      markerHeight="7"
                      refX="3.5"
                      refY="3.5"
                      orient="auto-start-reverse"
                    >
                      <path
                        d="M1,1 L6,3.5 L1,6"
                        fill="none"
                        stroke="#8A7340"
                        strokeWidth="1.2"
                      />
                    </marker>
                  </defs>

                  {/* Shirt body /}
                  <path
                    d="M118 28 C110 16 98 10 88 14 L30 44 L18 38 L14 48 L12 108 L58 103
                       L58 210 L282 210 L282 103 L328 108 L326 48 L324 38 L310 44
                       L252 14 C242 10 230 16 222 28
                       C216 40 206 48 170 50 C134 48 124 40 118 28Z"
                    fill="#1e1e1c"
                    stroke="#3A3A36"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  {/* Collar band /}
                  <path
                    d="M118 28 C122 40 134 48 170 50 C206 48 218 40 222 28
                       C214 14 196 8 170 9 C144 8 126 14 118 28Z"
                    fill="#2a2a27"
                    stroke="#3A3A36"
                    strokeWidth="1.2"
                  />
                  {/* Collar inner /}
                  <path
                    d="M126 31 C134 19 150 13 170 13 C190 13 206 19 214 31"
                    stroke="#1a1a17"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Chest seam line /}
                  <line
                    x1="58"
                    y1="103"
                    x2="282"
                    y2="103"
                    stroke="#3A3A36"
                    strokeWidth=".8"
                    opacity=".4"
                  />
                  {/* Center stitch /}
                  <line
                    x1="170"
                    y1="54"
                    x2="170"
                    y2="203"
                    stroke="#2a2a27"
                    strokeWidth=".6"
                    strokeDasharray="4 7"
                    opacity=".35"
                  />
                  {/* Bottom hem /}
                  <line
                    x1="58"
                    y1="207"
                    x2="282"
                    y2="207"
                    stroke="#3A3A36"
                    strokeWidth="1.5"
                    opacity=".5"
                  />
                  {/* Sleeve hems /}
                  <line
                    x1="12"
                    y1="108"
                    x2="18"
                    y2="38"
                    stroke="#3A3A36"
                    strokeWidth="1.2"
                    opacity=".4"
                  />
                  <line
                    x1="328"
                    y1="108"
                    x2="322"
                    y2="38"
                    stroke="#3A3A36"
                    strokeWidth="1.2"
                    opacity=".4"
                  />
                  {/* Shoulder highlight /}
                  <path
                    d="M122 34 Q88 70 60 100"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* TYLON brand /}
                  <text
                    x="170"
                    y="165"
                    textAnchor="middle"
                    fontFamily="Arial Black,sans-serif"
                    fontSize="10"
                    fill="#4A5C3A"
                    letterSpacing="7"
                    fontWeight="900"
                    opacity=".45"
                  >
                    TYLON
                  </text>

                  {/* BODY LENGTH arrow — left side /}
                  <line
                    x1="36"
                    y1="54"
                    x2="36"
                    y2="205"
                    stroke="#4A5C3A"
                    strokeWidth="1"
                    markerStart="url(#a1r)"
                    markerEnd="url(#a1)"
                  />
                  <line
                    x1="36"
                    y1="54"
                    x2="56"
                    y2="54"
                    stroke="#4A5C3A"
                    strokeWidth=".7"
                    strokeDasharray="2 3"
                    opacity=".6"
                  />
                  <line
                    x1="36"
                    y1="205"
                    x2="56"
                    y2="205"
                    stroke="#4A5C3A"
                    strokeWidth=".7"
                    strokeDasharray="2 3"
                    opacity=".6"
                  />
                  <text
                    x="32"
                    y="130"
                    textAnchor="middle"
                    fontFamily="Space Mono,monospace"
                    fontSize="7.5"
                    fill="#4A5C3A"
                    transform="rotate(-90 32 130)"
                  >
                    BODY LENGTH
                  </text>

                  {/* CHEST arrow — horizontal /}
                  <line
                    x1="62"
                    y1="128"
                    x2="278"
                    y2="128"
                    stroke="#6B8050"
                    strokeWidth="1"
                    markerStart="url(#a2r)"
                    markerEnd="url(#a2)"
                  />
                  <text
                    x="170"
                    y="122"
                    textAnchor="middle"
                    fontFamily="Space Mono,monospace"
                    fontSize="7.5"
                    fill="#6B8050"
                  >
                    CHEST
                  </text>

                  {/* SLEEVE LENGTH arrow — right sleeve /}
                  <line
                    x1="222"
                    y1="26"
                    x2="310"
                    y2="43"
                    stroke="#8A7340"
                    strokeWidth="1"
                    markerStart="url(#a3r)"
                    markerEnd="url(#a3)"
                  />
                  <text
                    x="283"
                    y="20"
                    textAnchor="middle"
                    fontFamily="Space Mono,monospace"
                    fontSize="7"
                    fill="#8A7340"
                  >
                    SLEEVE
                  </text>
                  <text
                    x="283"
                    y="30"
                    textAnchor="middle"
                    fontFamily="Space Mono,monospace"
                    fontSize="7"
                    fill="#8A7340"
                  >
                    LENGTH
                  </text>
                </svg>*/}

                {/* Measurement descriptions */}
                <div className="space-y-3 mt-5">
                  {SIZE_GUIDE.measurements.map(({ label, desc, color }) => (
                    <div
                      key={label}
                      className="border-l-2 pl-3"
                      style={{ borderColor: color }}
                    >
                      <p
                        className="font-mono text-[9px] tracking-[0.2em] uppercase mb-0.5"
                        style={{ color }}
                      >
                        {label}
                      </p>
                      <p className="font-body text-[11px] text-tylon-muted leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size table */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-tylon-primary bg-army px-3 py-1">
                    {sizeUnit.toUpperCase()}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-tylon-muted uppercase">
                    ALL MEASUREMENTS IN{" "}
                    {sizeUnit === "cm" ? "CENTIMETERS" : "INCHES"}
                  </span>
                </div>
                <table className="w-full border border-tylon-border">
                  <thead>
                    <tr className="border-b border-tylon-border bg-tylon-card">
                      {SIZE_GUIDE.headers.map((h) => (
                        <th
                          key={h}
                          className="px-3 py-3 font-mono text-[9px] tracking-[0.2em] text-army text-left font-normal"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRows.map((row, i) => (
                      <tr
                        key={row.size}
                        onClick={() => {
                          setSelectedSize(row.size);
                          setShowSizeGuide(false);
                        }}
                        className={cn(
                          "border-b border-tylon-border transition-colors cursor-pointer hover:bg-army/10",
                          selectedSize === row.size
                            ? "bg-army/10"
                            : i % 2 === 0
                              ? "bg-tylon-bg"
                              : "bg-tylon-card",
                        )}
                      >
                        <td
                          className={cn(
                            "px-3 py-3 font-mono text-sm font-bold tracking-widest",
                            selectedSize === row.size
                              ? "text-army-light"
                              : "text-tylon-primary",
                          )}
                        >
                          {row.size}
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-tylon-muted">
                          {row.bodyLength}
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-tylon-muted">
                          {row.chestWidth}
                        </td>
                        <td className="px-3 py-3 font-mono text-[11px] text-tylon-muted">
                          {row.sleeveLength}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick select */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.3em] text-tylon-muted uppercase mb-3">
                  QUICK SELECT
                </p>
                <div className="flex gap-2">
                  {activeRows.map(({ size }) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowSizeGuide(false);
                      }}
                      className={cn(
                        "flex-1 py-3 font-mono text-sm tracking-[0.2em] border-2 transition-all",
                        selectedSize === size
                          ? "bg-army text-tylon-primary border-army"
                          : "border-tylon-border text-tylon-muted hover:border-army hover:text-tylon-primary",
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
