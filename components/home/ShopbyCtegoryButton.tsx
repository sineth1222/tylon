"use client";

import Link from "next/link";
import { ArrowRight, User, UserRound, Baby, Watch } from "lucide-react";

const categories = [
  {
    href: "/collections?gender=mens",
    label: "Men's",
    icon: <User size={22} strokeWidth={1.5} className="md:size-10" />,
    iconBg: "#E6F1FB",
    iconColor: "#185FA5",
  },
  {
    href: "/collections?gender=womens",
    label: "Women's",
    icon: <UserRound size={22} strokeWidth={1.5} className="md:size-10" />,
    iconBg: "#FBEAF0",
    iconColor: "#993556",
  },
  {
    href: "/collections?gender=kids",
    label: "Kid's",
    icon: <Baby size={22} strokeWidth={1.5} className="md:size-10" />,
    iconBg: "#EAF3DE",
    iconColor: "#3B6D11",
  },
  {
    href: "/collections?category=accessories",
    label: "Accessories",
    icon: <Watch size={22} strokeWidth={1.5} className="md:size-10" />,
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
  },
];

export default function ShopByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* ── CATEGORY GRID ── */}
      <div className="grid grid-cols-4 md:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl hover:bg-charcoal-50 transition-colors "
          >
            {/* Icon circle */}
            <div
              className="w-11 h-11 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: cat.iconBg, color: cat.iconColor }}
            >
              {cat.icon}
            </div>

            {/* Label */}
            <span className="font-display text-[13px] md:text-[18px] font-medium text-charcoal-700 leading-none">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>

      {/* ── MOBILE "VIEW ALL" ── */}
      <div className="mt-6 flex sm:hidden justify-center">
        <Link
          href="/collections"
          className="font-display flex items-center gap-2 text-[10px] tracking-[0.2em] text-charcoal-400 uppercase hover:text-charcoal-700 transition-colors group"
        >
          View all collections by zora
          <ArrowRight
            size={12}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>
    </section>
  );
}
