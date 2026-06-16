import { Truck, Banknote, ShieldCheck, RotateCcw } from "lucide-react";

const ITEMS = [
  {
    Icon: Banknote,
    label: "CASH ON DELIVERY",
    sub: "No advance payment needed",
    accent: "#4A5C3A",
  },
  {
    Icon: Truck,
    label: "ISLAND-WIDE DELIVERY",
    sub: "All 25 districts · 2–3 days",
    accent: "#6B8050",
  },
  {
    Icon: ShieldCheck,
    label: "AUTHENTIC QUALITY",
    sub: "Premium heavyweight fabric",
    accent: "#8A7340",
  },
  {
    Icon: RotateCcw,
    label: "FREE RETURNS",
    sub: "14-day hassle-free policy",
    accent: "#4A5C3A",
  },
];

export default function ShippingBanner() {
  return (
    <section className="relative border-y border-tylon-border overflow-hidden my-10">
      {/* Subtle green gradient bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0D0D0B 0%, #0f1a0c 50%, #0D0D0B 100%)",
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-army to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-tylon-border">
          {ITEMS.map(({ Icon, label, sub, accent }, i) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-3 px-6 py-2 group"
            >
              {/* Icon box */}
              <div
                className="w-11 h-11 flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                style={{
                  borderColor: `${accent}50`,
                  background: `${accent}12`,
                }}
              >
                <Icon size={18} style={{ color: accent }} strokeWidth={1.5} />
              </div>

              {/* Label */}
              <span
                className="font-mono text-[10px] tracking-[0.22em] uppercase leading-tight"
                style={{ color: "#F0EDE6" }}
              >
                {label}
              </span>

              {/* Sub */}
              <span className="font-body text-[11px] text-tylon-muted leading-relaxed">
                {sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-army to-transparent" />
    </section>
  );
}
