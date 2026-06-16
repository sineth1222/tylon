import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { getUser } from "@/lib/actions/auth";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "The Mission — TYLON",
  description:
    "We don't sell clothes. We sell armor. Founded in Sri Lanka. Built for those who move with purpose.",
};

export default async function AboutPage() {
  const user = await getUser().catch(() => null);

  const manifesto = [
    {
      code: "01",
      title: "THIS IS NOT CLOTHING.",
      body: "The world is full of brands that sell you fabric. We sell you something different. TYLON exists at the intersection of identity and intention — where what you wear becomes a declaration of who you are and what you stand for.",
    },
    {
      code: "02",
      title: "THE SHIRT IS THE VESSEL.",
      body: "Every TYLON piece carries a story — a philosophy, a mindset, a weapon for the wearer's identity. When you put it on, you're not getting dressed. You're arming yourself. The cut is clean. The fabric is premium. But the real product is the story embedded in every thread.",
    },
    {
      code: "03",
      title: "DARK. INTENTIONAL. POWERFUL.",
      body: "Our aesthetic is military discipline meets raw authenticity. No pastels. No noise. Just clean, commanding design that speaks before you open your mouth. When you walk into a room wearing TYLON, the room notices.",
    },
    {
      code: "04",
      title: "ENTER A DIFFERENT EMPIRE.",
      body: "TYLON is not for everyone. It's for the ones who move with purpose. Who don't follow trends — they set the standard. If you've made it this far, you already know which side you're on.",
    },
  ];

  const stats = [
    { value: "2024", label: "FOUNDED" },
    { value: "7", label: "DESIGNS" },
    { value: "25", label: "DISTRICTS" },
    { value: "LK", label: "MADE IN SRI LANKA" },
  ];

  const values = [
    {
      icon: "◆",
      title: "DISCIPLINE OVER MOTIVATION",
      body: "Motivation fades. Discipline is permanent. Every piece we create is built on that principle — designed for the ones who show up every day regardless.",
    },
    {
      icon: "▲",
      title: "STORY IN EVERY THREAD",
      body: "We don't print graphics. We embed philosophies. Each color, each design, each cut is chosen with intention — the story is the product.",
    },
    {
      icon: "◈",
      title: "BUILT FOR THE 1%",
      body: "Not 1% of wealth. 1% of mindset. The ones who refuse comfort as a destination. TYLON is armor for those who know the war is internal.",
    },
  ];

  return (
    <>
      <Navbar user={user} />
      <AuthModal />
      <main className="pt-0 md:pt-0">
        {/* ── HERO ── /}
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-tylon-border">
          {/* Background gradient /}
          <div className="absolute inset-0 bg-gradient-to-b from-tylon-bg via-tylon-bg to-tylon-secondary" />
          <div className="absolute inset-0 bg-gradient-to-br from-army/8 via-transparent to-danger/4" />

          {/* Scanlines /}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 3px,#000 3px,#000 4px)",
            }}
          />

          {/* Watermark TYLON letters /}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span
              className="font-display font-bold text-tylon-border/[0.06] select-none"
              style={{
                fontSize: "clamp(120px,22vw,280px)",
                letterSpacing: "0.15em",
                lineHeight: 1,
              }}
            >
              TYLON
            </span>
          </div>

          {/* Logo /}
          <div className="relative z-10 mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 relative mx-auto mb-6">
              <Image
                src="/images/logo_tylon.png"
                alt="TYLON"
                fill
                className="object-contain"
                priority
              />
            </div>
            <p className="font-mono text-[9px] tracking-[0.5em] text-army uppercase">
              — THE MISSION
            </p>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h1
              className="font-display font-bold tracking-[0.04em] text-tylon-primary leading-[0.88] uppercase mb-8"
              style={{ fontSize: "clamp(2.8rem,9vw,7.5rem)" }}
            >
              WE DON'T
              <br />
              SELL CLOTHES.
              <br />
              <span className="text-army-light">WE SELL ARMOR.</span>
            </h1>
            <p className="font-body text-tylon-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
              Founded in Sri Lanka. Built for those who move with purpose. Every
              piece is a declaration — not a purchase.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/collections"
                className="border border-army text-tylon-primary px-8 py-3.5 font-display text-sm tracking-[0.2em] uppercase hover:bg-army transition-all duration-300"
              >
                ENTER THE COLLECTION
              </Link>
              <a
                href="#manifesto"
                className="font-mono text-[10px] tracking-[0.25em] text-tylon-muted uppercase underline underline-offset-4 hover:text-tylon-primary transition-colors"
              >
                READ THE MANIFESTO
              </a>
            </div>
          </div>

          {/* Scroll indicator /}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="font-mono text-[8px] tracking-[0.4em] text-tylon-muted uppercase">
              SCROLL
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-army to-transparent" />
          </div>
        </section>*/}

        <section className="relative min-h-[60vh] md:min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-tylon-border">
          {/* Background image */}
          <Image
            src="/images/about_hero.png"
            alt="TYLON background"
            fill
            className="object-cover object-center z-0"
            priority
          />

          {/* Dark overlay layers */}
          <div className="absolute inset-0 z-[1] bg-tylon-bg/75" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-b from-tylon-bg/40 via-transparent to-tylon-bg/80" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-br from-army/6 via-transparent to-transparent" />

          {/* Scanlines */}
          <div
            className="absolute inset-0 z-[2] pointer-events-none opacity-[0.025]"
            style={{
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 3px,#000 3px,#000 4px)",
            }}
          />

          {/* Watermark */}
          <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none overflow-hidden">
            <span
              className="font-display font-bold select-none"
              style={{
                fontSize: "clamp(100px,20vw,240px)",
                letterSpacing: "0.15em",
                lineHeight: 1,
                color: "rgba(240,237,230,0.03)",
              }}
            >
              TYLON
            </span>
          </div>

          {/* Logo */}
          <div className="relative z-10 mb-6">
            {/*<div className="w-14 h-14 md:w-16 md:h-16 relative mx-auto mb-4">
              <Image
                src="/images/logo_tylon.png"
                alt="TYLON"
                fill
                className="object-contain"
                priority
              />
            </div>*/}
            <p className="font-mono text-[9px] tracking-[0.5em] text-army uppercase">
              — THE MISSION
            </p>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h1
              className="font-display font-bold text-5xl md:text-6xl tracking-[0.05em] text-tylon-primary leading-[0.9] uppercase mb-6"
              //style={{ fontSize: "clamp(2rem,6vw,4.5rem)" }}
            >
              WE DON'T
              <br />
              SELL CLOTHES.
              <br />
              <span className="text-army-light">WE SELL ARMOR.</span>
            </h1>
            <p className="font-body text-tylon-muted text-sm md:text-base max-w-md mx-auto leading-relaxed mb-8">
              Founded in Sri Lanka. Built for those who move with purpose. Every
              piece is a declaration — not a purchase.
            </p>

            {/*<div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/collections"
                className="border border-army text-tylon-primary px-7 py-3 font-display text-xs tracking-[0.2em] uppercase hover:bg-army transition-all duration-300"
              >
                ENTER THE COLLECTION
              </Link>
              <a
                href="#manifesto"
                className="font-mono text-[10px] tracking-[0.25em] text-tylon-muted uppercase underline underline-offset-4 hover:text-tylon-primary transition-colors"
              >
                READ THE MANIFESTO
              </a>
            </div>*/}
            <div
              className="flex items-center justify-center gap-10 mt-14"
              style={{ animation: "fadeUp 0.9s 2.2s both" }}
            >
              {[
                { val: "7", label: "DESIGNS" },
                { val: "COD", label: "CASH ON DELIVERY" },
                { val: "LK", label: "ISLAND-WIDE" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="font-display text-xl font-bold text-tylon-primary tracking-widest">
                    {val}
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.3em] text-tylon-muted uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator /}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="font-mono text-[8px] tracking-[0.4em] text-tylon-muted uppercase">
              SCROLL
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-army to-transparent" />
          </div>*/}
          {/* Stats strip */}
        </section>

        {/* ── STATS STRIP ── /}
        <section className="border-b border-tylon-border bg-tylon-secondary">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-tylon-border">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center gap-1.5 py-10 px-6 text-center group"
                >
                  <span className="font-display text-4xl md:text-5xl font-bold text-tylon-primary tracking-wider group-hover:text-army-light transition-colors duration-500">
                    {value}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.35em] text-tylon-muted uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>*/}

        {/* ── BRAND IDENTITY — Logo Feature ── */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            {/* Logo display */}
            <div className="relative flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(74,92,58,0.12) 0%, transparent 70%)",
                }}
              />
              <div className="relative border border-tylon-border bg-tylon-card p-0 md:p-0 flex items-center justify-center w-full aspect-square max-w-sm">
                <div className="relative w-full h-full">
                  <Image
                    src="/images/heroo3.png"
                    alt="TYLON Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-army" />
                <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-army" />
                <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-army" />
                <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-army" />
              </div>
            </div>

            {/* Brand copy */}
            <div className="space-y-6">
              <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase">
                — THE BRAND
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.04em] text-tylon-primary uppercase leading-tight">
                AN EMPIRE
                <br />
                <span className="text-army-light">BUILT IN THE</span>
                <br />
                DARK
              </h2>
              <p className="font-body text-tylon-muted leading-relaxed text-base">
                TYLON was born from a simple belief: the clothes you wear should
                mean something. Not as a status symbol — but as a statement of
                internal war. Of discipline. Of refusal to settle.
              </p>
              <p className="font-body text-tylon-muted leading-relaxed text-base">
                We are a Sri Lankan brand. We build in silence. We ship
                island-wide. And we believe that the right piece of clothing,
                worn with the right intention, can change the way you carry
                yourself through the world.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="w-12 h-px bg-army" />
                <span className="font-mono text-[9px] tracking-[0.4em] text-army uppercase">
                  TYLON / EST. 2024 / SRI LANKA
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MANIFESTO ── */}
        <section
          id="manifesto"
          className="bg-tylon-secondary border-y border-tylon-border"
        >
          <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <div className="flex items-center gap-6 mb-14">
              <div className="w-10 h-px bg-army" />
              <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase">
                THE MANIFESTO
              </p>
            </div>

            <div className="space-y-0">
              {manifesto.map(({ code, title, body }, i) => (
                <div
                  key={code}
                  className="group border-b border-tylon-border py-12 md:py-16 grid grid-cols-1 md:grid-cols-[100px_1fr] gap-6 md:gap-16 hover:bg-army/[0.02] transition-colors duration-500 px-2"
                >
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:pt-1">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-army">
                      {code}
                    </span>
                    <div className="w-px h-4 bg-tylon-border hidden md:block" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl md:text-4xl font-bold tracking-[0.04em] text-tylon-primary uppercase mb-5 group-hover:text-army-light transition-colors duration-500 leading-tight">
                      {title}
                    </h3>
                    <p className="font-body text-tylon-muted leading-relaxed text-base max-w-2xl">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BRAND VALUES ── */}
        <section className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="text-center mb-14">
            <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-4">
              — WHAT WE STAND FOR
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-[0.04em] text-tylon-primary uppercase">
              THE CODE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {values.map(({ icon, title, body }) => (
              <div
                key={title}
                className="group bg-tylon-card border border-tylon-border p-8 hover:border-army transition-all duration-300 relative overflow-hidden"
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-army/0 group-hover:border-army/50 transition-all duration-500" />

                <div className="text-army text-2xl mb-5 font-mono">{icon}</div>
                <h3 className="font-display text-xl font-bold tracking-[0.06em] text-tylon-primary uppercase mb-4 group-hover:text-army-light transition-colors duration-300">
                  {title}
                </h3>
                <p className="font-body text-tylon-muted text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TAGLINE DIVIDER ── */}
        <section className="border-y border-tylon-border overflow-hidden py-10 bg-tylon-secondary">
          <div
            className="whitespace-nowrap"
            style={{ animation: "tylon-marquee 5s linear infinite" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-6 mr-10 font-display text-2xl md:text-3xl font-bold tracking-[0.1em] uppercase text-tylon-border"
              >
                WEAR YOUR MISSION
                <span className="text-army text-base">◆</span>
                ENTER A DIFFERENT EMPIRE
                <span className="text-army text-base">◆</span>
              </span>
            ))}
          </div>
          <style>{`
            @keyframes tylon-marquee {
              from { transform: translateX(0); }
              to   { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-24 md:py-36 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-tylon-bg to-tylon-secondary" />
          <div className="absolute inset-0 bg-gradient-to-br from-army/6 via-transparent to-transparent" />

          {/* Corner borders */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-army/30" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-army/30" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-army/30" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-army/30" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-6">
              — CLAIM YOUR PIECE
            </p>
            <h2
              className="font-display font-bold tracking-[0.04em] text-tylon-primary uppercase mb-4 leading-[0.9]"
              style={{ fontSize: "clamp(2.5rem,7vw,6rem)" }}
            >
              ENTER THE
              <br />
              <span className="text-army-light">COLLECTION</span>
            </h2>
            <p className="font-body text-tylon-muted text-base max-w-md mx-auto mb-10 leading-relaxed">
              7 designs. Each one a mission. Each one a story. Not fashion —
              philosophy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/collections"
                className="bg-army text-tylon-primary px-10 py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army-light transition-all duration-300"
              >
                VIEW ALL PIECES
              </Link>
              <Link
                href="/new-arrivals"
                className="border border-tylon-border text-tylon-muted px-10 py-4 font-display text-sm tracking-[0.2em] uppercase hover:border-army hover:text-tylon-primary transition-all duration-300"
              >
                NEW DROPS
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/*import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getUser } from "@/lib/actions/auth";

export default async function AboutPage() {
  const user = await getUser().catch(() => null);

  const manifesto = [
    {
      code: "01",
      title: "THIS IS NOT CLOTHING.",
      body: "The world is full of brands that sell you fabric. We sell you something different. TYLON exists at the intersection of identity and intention — where what you wear becomes a declaration of who you are and what you stand for.",
    },
    {
      code: "02",
      title: "THE SHIRT IS THE VESSEL.",
      body: "Every TYLON piece carries a story — a philosophy, a mindset, a weapon for the wearer's identity. When you put it on, you're not getting dressed. You're arming yourself. The cut is clean. The fabric is premium. But the real product is the story embedded in every thread.",
    },
    {
      code: "03",
      title: "DARK. INTENTIONAL. POWERFUL.",
      body: "Our aesthetic is military discipline meets raw authenticity. No pastels. No noise. Just clean, commanding design that speaks before you open your mouth. When you walk into a room wearing TYLON, the room notices.",
    },
    {
      code: "04",
      title: "ENTER A DIFFERENT EMPIRE.",
      body: "TYLON is not for everyone. It's for the ones who move with purpose. Who don't follow trends — they set the standard. If you've made it this far, you already know which side you're on.",
    },
  ];

  return (
    <>
      <Navbar user={user} />
      <main>
        {/* Hero /}
        <section className="min-h-[60vh] flex items-end px-6 md:px-16 py-16 border-b border-tylon-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-army/5 to-transparent" />
          <div className="relative z-10 max-w-4xl">
            <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-6">— THE MISSION</p>
            <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold tracking-[0.04em] text-tylon-primary leading-[0.9] mb-8 uppercase">
              WE DON'T<br />SELL CLOTHES.<br />
              <span className="text-army-light">WE SELL ARMOR.</span>
            </h1>
            <p className="font-body text-tylon-muted text-lg max-w-xl leading-relaxed">
              Founded in Sri Lanka. Built for those who move with purpose.
            </p>
          </div>
        </section>

        {/* Manifesto /}
        <section id="manifesto" className="max-w-5xl mx-auto px-6 py-20 space-y-0">
          {manifesto.map(({ code, title, body }, i) => (
            <div
              key={code}
              className="border-b border-tylon-border py-12 md:py-16 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12"
            >
              <div className="flex md:flex-col items-start gap-4 md:gap-2">
                <span className="font-mono text-[10px] tracking-[0.3em] text-army">{code}</span>
              </div>
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold tracking-[0.05em] text-tylon-primary uppercase mb-4">
                  {title}
                </h3>
                <p className="font-body text-tylon-muted leading-relaxed text-base max-w-2xl">{body}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA /}
        <section className="bg-tylon-secondary border-y border-tylon-border py-20 px-6 text-center">
          <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-6">— CLAIM YOUR PIECE</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-[0.05em] text-tylon-primary uppercase mb-8">
            ENTER THE COLLECTION
          </h2>
          <a
            href="/collections"
            className="inline-flex items-center gap-3 border border-army text-tylon-primary px-10 py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army transition-all duration-300"
          >
            VIEW ALL PIECES →
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}*/
