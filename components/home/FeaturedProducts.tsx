import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/products/ProductCard";

export default function FeaturedProducts({
  products,
}: {
  products: Product[];
}) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-[10px] tracking-[0.35em] text-army uppercase mb-3">
            — THE ARSENAL
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-[0.05em] text-tylon-primary/40">
            FEATURED
            <br />
            PIECES
          </h2>
        </div>
        <Link
          href="/collections"
          className="hidden sm:flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-tylon-muted hover:text-army-light transition-colors border-b border-transparent hover:border-army pb-0.5"
        >
          VIEW ALL →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {products.slice(0, 10).map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="text-center mt-10 sm:hidden">
        <Link
          href="/collections"
          className="inline-block bg-army text-tylon-primary px-10 py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-colors"
        >
          VIEW ALL PIECES
        </Link>
      </div>
    </section>
  );
}
