import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function BrandStory() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="relative overflow-hidden min-h-[480px] flex items-end bg-tylon-card border border-tylon-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/images/heroo1.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-tylon-bg/95 via-tylon-bg/60 to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-8 right-12 w-32 h-32 border border-army/20" />
        <div className="absolute top-16 right-20 w-16 h-16 border border-army/10" />
        <div className="absolute top-8 right-8 font-mono text-[10px] tracking-[0.3em] text-army/40">
          TYLON/2024
        </div>

        <div className="relative z-10 p-10 md:p-16 max-w-2xl">
          <p className="font-mono text-[9px] tracking-[0.4em] text-army uppercase mb-4">
            — THE MANIFESTO
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-tylon-primary/40 leading-tight mb-6 tracking-[0.03em]">
            CUSTOMERS DON'T
            <br />
            BUY CLOTHES.
            <br />
            <span className="text-army-light/40">THEY CLAIM THEIR ARMOR.</span>
          </h2>
          <p className="font-body text-tylon-muted text-sm leading-relaxed mb-8 max-w-md">
            Every TYLON piece carries a story. A philosophy. An identity. When
            you wear it, you declare something about who you are and what you
            stand for.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-3 border border-army text-tylon-primary px-8 py-3.5 font-display text-sm tracking-[0.15em] uppercase hover:bg-army transition-colors"
          >
            READ THE FULL MISSION
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
