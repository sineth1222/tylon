import Link from "next/link";
import { Instagram, Facebook, ShieldCheck, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-tylon-secondary border-t border-tylon-border mt-24">
      {/* Marquee /}
      <div className="bg-army py-2.5 overflow-hidden">
        <div className="marquee-container">
          <div className="inline-block animate-marquee whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} className="inline-flex items-center gap-6 mr-12 text-tylon-primary text-[10px] font-mono tracking-[0.25em] uppercase">
                WEAR YOUR MISSION <span className="text-tylon-primary/40">✦</span>
                ISLAND-WIDE DELIVERY <span className="text-tylon-primary/40">✦</span>
                CASH ON DELIVERY <span className="text-tylon-primary/40">✦</span>
                ENTER A DIFFERENT EMPIRE <span className="text-tylon-primary/40">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>*/}

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-display text-4xl font-bold tracking-[0.2em] text-tylon-primary/40 mb-2">
              TYLON
            </div>
            <p className="font-mono text-[9px] tracking-[0.35em] text-army uppercase mb-5">
              WEAR YOUR MISSION
            </p>
            <p className="text-tylon-muted text-sm leading-relaxed mb-6">
              This is not a clothing brand. It is a movement. Every T-shirt
              carries a story — a philosophy, an identity, a weapon for the
              wearer's mindset.
            </p>
            <div className="flex items-center gap-3">
              {[
                { href: "https://instagram.com", Icon: Instagram, label: "IG" },
                { href: "https://facebook.com", Icon: Facebook, label: "FB" },
                {
                  href: "https://wa.me/94771234567",
                  Icon: MessageCircle,
                  label: "WA",
                },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-tylon-border flex items-center justify-center text-tylon-muted hover:border-army hover:text-army-light transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* The Arsenal */}
          <div>
            <h4 className="font-mono text-[9px] font-semibold tracking-[0.3em] uppercase text-army mb-5">
              THE ARSENAL
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/collections", label: "All Pieces" },
                { href: "/new-arrivals", label: "New Drops" },
                { href: "/collections?gender=mens", label: "Men's Collection" },
                /*{ href: "/collections", label: "Women's — Coming Soon" },*/
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] tracking-widest text-tylon-muted hover:text-tylon-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* The Mission */}
          <div>
            <h4 className="font-mono text-[9px] font-semibold tracking-[0.3em] uppercase text-army mb-5">
              THE MISSION
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "Our Story" },
                { href: "/about#manifesto", label: "The Manifesto" },
                { href: "/privacy", label: "Terms & Privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-[11px] tracking-widest text-tylon-muted hover:text-tylon-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Deploy */}
          <div>
            <h4 className="font-mono text-[9px] font-semibold tracking-[0.3em] uppercase text-army mb-5">
              DEPLOY
            </h4>
            <ul className="space-y-4 text-tylon-muted">
              <li className="font-mono text-[11px] tracking-wide leading-relaxed">
                Colombo, Sri Lanka
              </li>
              <li>
                <a
                  href="mailto:contact@tylon.lk"
                  className="font-mono text-[11px] tracking-wide hover:text-tylon-primary transition-colors"
                >
                  contact@tylon.lk
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/94771234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] tracking-wide hover:text-army-light transition-colors"
                >
                  +94 77 123 4567
                </a>
              </li>
              <li>
                <p className="font-mono text-[10px] tracking-wide text-tylon-muted/50">
                  COD · Island-wide Delivery
                  <br />
                  2-3 working days
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-tylon-border mt-12 mb-4 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-tylon-muted tracking-widest text-center">
            © 2026 TYLON. ALL RIGHTS RESERVED. CRAFTED IN SRI LANKA.
          </p>
          <div className="flex items-center gap-5">
            {["PRIVACY", "TERMS"].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase()}`}
                className="font-mono text-[10px] text-tylon-muted hover:text-tylon-primary tracking-widest transition-colors"
              >
                {label}
              </Link>
            ))}
            {/*<Link
              href="/admin/login"
              className="flex items-center gap-1.5 font-mono text-[10px] text-tylon-muted/40 hover:text-tylon-muted tracking-widest transition-colors"
            >
              <ShieldCheck size={10} /> ADMIN
            </Link>*/}
          </div>
        </div>
      </div>
    </footer>
  );
}
