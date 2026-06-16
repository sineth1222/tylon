"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";
import { cn, CATEGORY_LABELS, GENDER_LABELS } from "@/lib/utils";

const PRICE_RANGES = [
  { value: "any", label: "ANY PRICE" },
  { value: "under10k", label: "UNDER RS. 1,000" },
  { value: "10k-20k", label: "RS. 1,000 – 2,000" },
  { value: "over20k", label: "OVER RS. 2,000" },
];
const SORT_OPTIONS = [
  { value: "newest", label: "NEWEST" },
  { value: "price_asc", label: "PRICE: LOW → HIGH" },
  { value: "price_desc", label: "PRICE: HIGH → LOW" },
  { value: "name", label: "NAME A–Z" },
];

const CATEGORY_GROUPS = [
  {
    group: "Men's",
    items: [
      { value: "shirts", label: "Shirts" },
      { value: "tshirts", label: "T-Shirts" },
      { value: "trousers", label: "Trousers" },
      { value: "shorts", label: "Shorts" },
      { value: "pants", label: "Pants" },
    ],
  },
  {
    group: "Women's",
    items: [
      { value: "dresses", label: "Dresses" },
      { value: "skirts", label: "Skirts" },
      { value: "blouses", label: "Blouses" },
      { value: "frocks", label: "Frocks" },
      { value: "sarees", label: "Sarees" },
      { value: "lehenga", label: "Lehenga" },
    ],
  },
  {
    group: "Unisex",
    items: [
      { value: "outerwear", label: "Outerwear" },
      { value: "basics", label: "Basics" },
      { value: "tailoring", label: "Tailoring" },
      { value: "bottoms", label: "Bottoms" },
    ],
  },
  {
    group: "Kids",
    items: [
      { value: "kids_sets", label: "Kids Sets" },
      { value: "kids_tops", label: "Kids Tops" },
      { value: "kids_bottoms", label: "Kids Bottoms" },
    ],
  },
  {
    group: "Accessories",
    items: [
      { value: "caps", label: "Caps & Hats" },
      { value: "sunglasses", label: "Sunglasses" },
      { value: "shoes", label: "Shoes" },
      { value: "slippers", label: "Slippers" },
      { value: "sandals", label: "Sandals" },
      { value: "bags", label: "Bags" },
      { value: "belts", label: "Belts" },
      { value: "watches", label: "Watches" },
      { value: "jewellery", label: "Jewellery" },
      { value: "scarves", label: "Scarves & Shawls" },
    ],
  },
];

interface Props {
  products: Product[];
  initialCategory?: string;
  initialGender?: string;
}

export default function CollectionsClient({
  products,
  initialCategory = "all",
  initialGender = "all",
}: Props) {
  const [category, setCategory] = useState(initialCategory);
  const [gender, setGender] = useState(initialGender);
  const [priceRange, setPriceRange] = useState("any");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<
    string | false
  >(false);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== "all")
      result = result.filter((p) => p.category === category);
    if (gender !== "all") result = result.filter((p) => p.gender === gender);
    if (priceRange === "under10k")
      result = result.filter((p) => p.price < 1000);
    else if (priceRange === "10k-20k")
      result = result.filter((p) => p.price >= 1000 && p.price <= 2000);
    else if (priceRange === "over20k")
      result = result.filter((p) => p.price > 2000);
    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "name")
      result.sort((a, b) => a.name.localeCompare(b.name));
    else
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    return result;
  }, [products, category, gender, priceRange, sortBy]);

  const activeFilters = [
    category !== "all",
    gender !== "all",
    priceRange !== "any",
    sortBy !== "newest",
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      {/* Page header */}
      <div className="py-12 md:py-16 border-b border-tylon-border mb-8">
        <p className="font-mono text-[10px] tracking-[0.4em] text-army uppercase mb-3">
          — THE ARSENAL
        </p>
        <div className="flex items-end justify-between">
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-[0.05em] text-tylon-primary uppercase">
            ALL PIECES
          </h1>
          <span className="font-mono text-[11px] text-tylon-muted tracking-widest hidden sm:block">
            {filtered.length} PIECES
          </span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-all",
              showFilters
                ? "bg-army border-army text-tylon-primary"
                : "border-tylon-border text-tylon-muted hover:border-army hover:text-tylon-primary",
            )}
          >
            <SlidersHorizontal size={13} />
            FILTERS
            {activeFilters > 0 && (
              <span className="w-4 h-4 bg-tylon-primary text-tylon-bg rounded-full text-[8px] font-bold flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
          {activeFilters > 0 && (
            <button
              onClick={() => {
                setCategory("all");
                setGender("all");
                setPriceRange("any");
                setSortBy("newest");
              }}
              className="font-mono text-[10px] tracking-widest text-danger hover:text-danger/70 transition-colors flex items-center gap-1"
            >
              <X size={11} /> CLEAR
            </button>
          )}
        </div>
        <span className="font-mono text-[10px] text-tylon-muted tracking-widest sm:hidden">
          {filtered.length} PIECES
        </span>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-tylon-card border border-tylon-border p-6 mb-8 space-y-6">
          {/*<div>
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-3">
              GENDER
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "ALL" },
                ...Object.entries(GENDER_LABELS).map(([value, label]) => ({
                  value,
                  label,
                })),
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setGender(value)}
                  className={cn(
                    "filter-btn",
                    gender === value
                      ? "filter-btn-active"
                      : "filter-btn-inactive",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>*/}
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-3">
              PRICE
            </p>
            <div className="flex flex-wrap gap-2">
              {PRICE_RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setPriceRange(r.value)}
                  className={cn(
                    "filter-btn",
                    priceRange === r.value
                      ? "filter-btn-active"
                      : "filter-btn-inactive",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-army mb-3">
              SORT
            </p>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSortBy(s.value)}
                  className={cn(
                    "filter-btn",
                    sortBy === s.value
                      ? "filter-btn-active"
                      : "filter-btn-inactive",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category tabs /}
      <div className="relative mb-8">
        <div className="bg-tylon-card border border-tylon-border p-3 flex flex-wrap gap-2 items-center">
          <button
            onClick={() => { setCategory("all"); setShowCategoryDropdown(false); }}
            className={cn("filter-btn", category === "all" ? "filter-btn-active" : "filter-btn-inactive")}
          >
            ALL
          </button>
          {CATEGORY_GROUPS.map((g) => {
            const groupActive = g.items.some((i) => i.value === category);
            const activeLabel = g.items.find((i) => i.value === category)?.label;
            return (
              <div key={g.group} className="relative">
                <button
                  onClick={() => setShowCategoryDropdown(showCategoryDropdown === g.group ? false : g.group)}
                  className={cn("filter-btn flex items-center gap-1.5", groupActive ? "filter-btn-active" : "filter-btn-inactive")}
                >
                  {groupActive ? activeLabel?.toUpperCase() : g.group.toUpperCase()}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={cn("transition-transform", showCategoryDropdown === g.group ? "rotate-180" : "")}>
                    <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                {showCategoryDropdown === g.group && (
                  <div className="absolute top-full left-0 mt-1 bg-tylon-secondary border border-tylon-border shadow-xl p-2 z-20 min-w-[160px] animate-scale-in">
                    {g.items.map((item) => (
                      <button
                        key={item.value}
                        onClick={() => { setCategory(item.value); setShowCategoryDropdown(false); }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 font-mono text-[10px] tracking-[0.15em] transition-all flex items-center gap-2",
                          category === item.value ? "bg-army text-tylon-primary" : "text-tylon-muted hover:bg-tylon-card hover:text-tylon-primary"
                        )}
                      >
                        {category === item.value && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                        {item.label.toUpperCase()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {showCategoryDropdown && (
          <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDropdown(false)} />
        )}
      </div>*/}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-6xl font-bold text-tylon-muted/20 tracking-[0.2em] mb-4">
            EMPTY
          </p>
          <p className="font-mono text-[11px] text-tylon-muted tracking-widest">
            NO PIECES MATCH YOUR FILTERS
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
