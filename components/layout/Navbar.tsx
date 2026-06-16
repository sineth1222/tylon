"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  User,
  Heart,
  Home,
  Grid3X3,
  Crosshair,
  Menu,
  X,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: {
    id: string;
    full_name: string | null;
    email: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { wishlistIds } = useWishlist();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/collections", label: "THE COLLECTION" },
    { href: "/new-arrivals", label: "NEW DROPS", dot: true },
    { href: "/speeches", label: "SPEECHES" },
    { href: "/about", label: "THE MISSION" },
  ];

  const mobileNavItems = [
    { href: "/", label: "HOME", icon: Home, exact: true },
    { href: "/collections", label: "ARMOR", icon: Grid3X3 },
    { href: "/new-arrivals", label: "NEW", icon: Crosshair },
    {
      href: "/wishlist",
      label: "SAVED",
      icon: Heart,
      badge: wishlistIds.size > 0 ? wishlistIds.size : null,
    },
    {
      href: "/profile",
      label: user
        ? user.full_name?.split(" ")[0]?.toUpperCase() || "ACCOUNT"
        : "SIGN IN",
      icon: User,
    },
  ];

  return (
    <>
      {/* ── Desktop Navbar ── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block",
          isScrolled
            ? "bg-tylon-bg/95 backdrop-blur-sm border-b border-tylon-border"
            : "bg-transparent",
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="font-display text-2xl font-bold tracking-[0.2em] text-tylon-primary hover:text-army-light transition-colors"
          >
            TYLON
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-8">
            {navLinks.map(({ href, label, dot }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative font-mono text-[11px] tracking-[0.2em] transition-colors",
                  pathname.startsWith(href)
                    ? "text-army-light"
                    : "text-tylon-muted hover:text-tylon-primary",
                )}
              >
                {label}
                {dot && (
                  <span className="absolute -top-1 -right-2 w-1.5 h-1.5 rounded-full bg-army" />
                )}
              </Link>
            ))}
            {/* Women's coming soon /}
            <span className="font-mono text-[11px] tracking-[0.2em] text-tylon-muted/40 cursor-not-allowed">
              WOMEN'S <span className="text-[9px] text-army/60">SOON</span>
            </span>*/}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href="/profile"
                className="font-mono text-[11px] tracking-widest text-tylon-muted hover:text-tylon-primary transition-colors"
              >
                {user.full_name?.split(" ")[0]?.toUpperCase() || "ACCOUNT"}
              </Link>
            ) : (
              <button
                onClick={() =>
                  window.dispatchEvent(new CustomEvent("open-auth-modal"))
                }
                className="font-mono text-[11px] tracking-widest text-tylon-muted hover:text-tylon-primary transition-colors"
              >
                SIGN IN
              </button>
            )}
            <Link
              href="/wishlist"
              className="relative text-tylon-muted hover:text-tylon-primary transition-colors"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistIds.size > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-army text-tylon-primary rounded-full text-[8px] font-bold flex items-center justify-center font-mono">
                  {wishlistIds.size}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-army hover:bg-army-light transition-colors px-4 py-2 text-tylon-primary"
            >
              <ShoppingBag size={15} />
              <span className="font-mono text-[10px] tracking-widest">
                {totalItems > 0 ? `BAG (${totalItems})` : "BAG"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Top Bar ── */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300",
          isScrolled
            ? "bg-tylon-bg/95 backdrop-blur-sm border-b border-tylon-border"
            : "bg-transparent",
        )}
      >
        <div className="flex items-center justify-between px-5 h-14">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-[0.25em] text-tylon-primary"
          >
            TYLON
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={openCart} className="relative text-tylon-muted">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-army text-tylon-primary rounded-full text-[8px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-tylon-muted"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="bg-tylon-secondary border-b border-tylon-border px-5 py-6 space-y-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className="block font-display text-lg tracking-[0.15em] text-tylon-primary hover:text-army-light transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 font-display text-lg tracking-[0.15em] text-tylon-primary hover:text-army-light transition-colors"
            >
              WISHLIST
              <span className="relative inline-flex">
                <Heart size={18} strokeWidth={1.5} />
                {wishlistIds.size > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-army text-tylon-primary rounded-full text-[8px] font-bold flex items-center justify-center font-mono">
                    {wishlistIds.size}
                  </span>
                )}
              </span>
            </Link>
            {/*<div className="font-display text-lg tracking-[0.15em] text-tylon-muted/40">
              WOMEN'S{" "}
              <span className="text-[11px] text-army/60">— COMING SOON</span>
            </div>*/}
            <div className="border-t border-tylon-border pt-4">
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-mono text-xs tracking-widest text-tylon-muted"
                >
                  ACCOUNT — {user.full_name?.toUpperCase()}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.dispatchEvent(new CustomEvent("open-auth-modal"));
                  }}
                  className="font-mono text-xs tracking-widest text-army-light"
                >
                  → SIGN IN / JOIN
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── Mobile Bottom Navigation Bar ── /}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-tylon-secondary/95 backdrop-blur-sm border-t border-tylon-border safe-area-inset-bottom">
        <div className="flex items-center justify-around px-2 h-16">
          {mobileNavItems.map(({ href, label, icon: Icon, exact, badge }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);
            const isProfile = href === "/profile";

            return (
              <button
                key={href}
                onClick={() => {
                  if (isProfile && !user) {
                    window.dispatchEvent(new CustomEvent("open-auth-modal"));
                  } else {
                    window.location.href = href;
                  }
                }}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-3 py-1 transition-all duration-200",
                  active ? "text-army-light" : "text-tylon-muted",
                )}
              >
                <div className="relative">
                  <Icon size={19} strokeWidth={active ? 2 : 1.5} />
                  {badge && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-army text-tylon-primary rounded-full text-[8px] font-bold flex items-center justify-center">
                      {badge > 9 ? "9+" : badge}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[8px] tracking-widest font-mono leading-none",
                    active ? "text-army-light" : "text-tylon-muted",
                  )}
                >
                  {label}
                </span>
                {active && (
                  <span className="absolute -bottom-0.5 w-1 h-1 bg-army-light" />
                )}
              </button>
            );
          })}

          {/* Cart button /}
          <button
            onClick={openCart}
            className="relative flex flex-col items-center gap-1 px-3 py-1 transition-all duration-200 text-tylon-muted"
          >
            <div className="relative">
              <div className="w-9 h-9 bg-army flex items-center justify-center -mt-5 shadow-lg shadow-army/30">
                <ShoppingBag size={16} className="text-tylon-primary" />
              </div>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-tylon-primary text-tylon-bg rounded-full text-[8px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </div>
            <span className="text-[8px] tracking-widest font-mono text-tylon-muted leading-none">
              BAG
            </span>
          </button>
        </div>
        <div className="h-safe-area-inset-bottom" />
      </nav>*/}

      {/* Spacer for mobile bottom bar */}
      <div className="md:hidden h-16" />
    </>
  );
}
