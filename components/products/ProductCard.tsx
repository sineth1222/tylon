"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useState } from "react";
import { useWishlist } from "@/lib/wishlist-context";

export default function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const primaryImage =
    product.variants?.[0]?.images?.[0] || product.images?.[0] || null;

  return (
    <Link href={`/products/${product.slug}`} className="block group">
      <div className="product-card bg-tylon-card border border-tylon-border overflow-hidden hover:border-army transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-tylon-secondary">
          {primaryImage && !imgError ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="product-image object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-tylon-secondary">
              <span className="font-display text-tylon-muted text-2xl tracking-[0.2em]">
                TYLON
              </span>
            </div>
          )}

          {/* Category label */}
          <div className="absolute top-3 left-3 bg-tylon-bg/80 border border-tylon-border px-2.5 py-1 backdrop-blur-sm">
            <span className="font-mono text-[8px] tracking-[0.25em] text-tylon-primary uppercase">
              {product.category}
            </span>
          </div>

          {/* NEW ribbon */}
          {product.is_new && (
            <div className="absolute top-0 right-0">
              <div className="new-ribbon" />
            </div>
          )}

          {/* SALE */}
          {product.original_price &&
            product.original_price > product.price &&
            !product.is_new && (
              <div className="absolute top-3 right-3 bg-danger text-tylon-primary text-[9px] font-mono font-bold px-2.5 py-1 tracking-widest">
                SALE
              </div>
            )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-tylon-bg/0 group-hover:bg-tylon-bg/30 transition-all duration-300 flex items-center justify-center">
            <span className="font-mono text-[10px] tracking-[0.25em] text-tylon-primary uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-tylon-primary/50 px-4 py-2 backdrop-blur-sm">
              VIEW PIECE
            </span>
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle(product.id);
            }}
            className={cn(
              "absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center transition-all",
              wishlisted
                ? "bg-army text-tylon-primary"
                : "bg-tylon-bg/80 text-tylon-muted hover:bg-army hover:text-tylon-primary border border-tylon-border",
            )}
          >
            <Heart size={13} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-tylon-border">
          <h3 className="font-display text-sm tracking-[0.08em] text-tylon-primary/60 mb-1 group-hover:text-army-light/60 transition-colors leading-tight line-clamp-2 uppercase">
            {product.name}
          </h3>

          {/* Colour swatches */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1 mb-2">
              {product.variants.slice(0, 4).map((v) => (
                <div
                  key={v.colorName}
                  className="w-3 h-3 border border-tylon-border"
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="font-mono text-[8px] text-tylon-muted">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-tylon-primary/60 tracking-wider">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="font-mono text-[10px] text-tylon-muted line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
