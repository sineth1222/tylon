"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  LogOut,
  ChevronRight,
  Mic2,
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/speeches", label: "Speeches", icon: Mic2 },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-30"
      style={{
        background: "linear-gradient(180deg, #2A2118 0%, #3D342E 100%)",
      }}
    >
      {/* Brand */}
      <div className="p-6 border-b border-stone-700">
        <div className="font-display text-2xl font-bold italic text-cream-100">
          Siena
        </div>
        <p className="text-[9px] tracking-[0.3em] text-rose-400 uppercase mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "admin-nav-item",
                active ? "admin-nav-active" : "admin-nav-inactive",
              )}
            >
              <item.icon size={17} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={13} className="opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-stone-700 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-blush-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user.full_name?.[0]?.toUpperCase() || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-cream-200 truncate">
              {user.full_name || "Admin"}
            </p>
            <p className="text-[10px] text-stone-500 truncate">{user.email}</p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm text-stone-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
