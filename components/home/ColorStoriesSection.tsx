"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const COLORS = [
  {
    id: "01",
    name: "BLACK",
    sub: "ABSOLUTE DARKNESS",
    hex: "#0D0D0B",
    bg: "#050503",
    bgAccent: "rgba(10,10,8,0.95)",
    chipColor: "rgba(74,92,58,0.5)",
    storyLine: "#2A2A26",
    img: "/images/tshirt.png",
    story:
      "Black is not a color — it is the absence of light. While the ordinary herd chases the spotlight and cheap fame, we build our empire in complete, unseen darkness. The one who wears this is a leader who executes a silent mission that no one can control.",
  },
  {
    id: "02",
    name: "CHARCOAL",
    sub: "ASHES AND IRON",
    hex: "#3C3C3A",
    bg: "#111110",
    bgAccent: "rgba(20,20,18,0.95)",
    chipColor: "rgba(72,72,70,0.6)",
    storyLine: "#4A4A46",
    img: "/images/tshirt1.png",
    story:
      "The color of our brutal reality — the heavy, grinding life among iron machines and rough concrete. But Charcoal is also the color of ashes. Burn down that old, weak, lazy version of yourself, and from those ashes, a new monster is born. Relentless rebirth.",
  },
  {
    id: "03",
    name: "ARMY GREEN",
    sub: "MILITANT DISCIPLINE",
    hex: "#4A5C3A",
    bg: "#0a1208",
    bgAccent: "rgba(12,20,8,0.95)",
    chipColor: "rgba(74,92,58,0.6)",
    storyLine: "#4A5C3A",
    img: "/images/tshirt2.png",
    story:
      "Our life is a battlefield. Army Green is the color of the frontline warrior. Instead of relying on fleeting motivation, this represents a journey driven by emotionless iron discipline. Wearing this isn't fashion — it is putting on tactical armor to execute the daily mission.",
  },
  {
    id: "04",
    name: "BLOOD RED",
    sub: "PAIN AND BLOODLINE",
    hex: "#6B2020",
    bg: "#0f0404",
    bgAccent: "rgba(18,5,5,0.95)",
    chipColor: "rgba(107,32,32,0.6)",
    storyLine: "#6B2020",
    img: "/images/tshirt3.png",
    story:
      "Not a bright, cheap red — this is the deep maroon of a profound wound. It represents the sweat, tears, and pain we endure on this journey. Pain is our compass. This is the color of the Apex Bloodline: the 1% who refused to make their comfort zone their coffin.",
  },
];

export default function ColorStoriesSection() {
  const [active, setActive] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / el.clientHeight);
      if (idx !== active) {
        setActive(idx);
        setTextKey((k) => k + 1);
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [active]);

  const scrollTo = (i: number) => {
    trackRef.current?.scrollTo({
      top: i * (trackRef.current?.clientHeight ?? 580),
      behavior: "smooth",
    });
  };

  const c = COLORS[active];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        height: "580px",
        background: c.bg,
        transition: "background 0.9s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {/* ── TYLON LOGO watermark background ── */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          className="relative"
          style={{
            width: "420px",
            height: "420px",
            opacity: 0.04,
            filter: "blur(0.5px)",
          }}
        >
          <Image
            src="/images/logo_tylon.png"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* ── Color tint vignette ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${c.hex}18 0%, transparent 65%)`,
          transition: "background 0.9s ease",
        }}
      />

      {/* ── Scanlines ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.022) 3px,rgba(0,0,0,0.022) 4px)",
        }}
      />

      {/* ── Moving scan line ── */}
      <div
        className="absolute left-0 right-0 h-px z-[3] pointer-events-none"
        style={{
          background: `${c.hex}30`,
          animation: "tylon-scan 7s linear infinite",
          transition: "background 0.9s ease",
        }}
      />

      {/* ── Scroll track ── */}
      <div
        ref={trackRef}
        className="absolute inset-0 z-[4] overflow-y-scroll"
        style={{ scrollSnapType: "y mandatory", scrollbarWidth: "none" }}
      >
        {COLORS.map((color, i) => (
          <div
            key={color.id}
            style={{ height: "580px", scrollSnapAlign: "start" }}
          >
            {/* ── DESKTOP layout: shirt left, text right ── */}
            <div className="hidden sm:flex items-center w-full h-full">
              {/* Shirt col */}
              <div
                className="shrink-0 flex items-center justify-center"
                style={{ width: "44%", height: "100%" }}
              >
                <div
                  style={{
                    filter: "drop-shadow(0 28px 52px rgba(0,0,0,0.85))",
                    animation:
                      active === i
                        ? "tylon-shirt-in 0.75s cubic-bezier(.34,1.3,.64,1) forwards"
                        : "none",
                    opacity: active === i ? undefined : 0,
                    transform:
                      active === i
                        ? undefined
                        : "translateX(-40px) rotate(-5deg)",
                  }}
                >
                  <Image
                    src={color.img}
                    alt={`TYLON ${color.name}`}
                    width={430}
                    height={470}
                    className="object-contain"
                    priority={i === 0}
                    style={{
                      // NO gray filter — render actual shirt color
                      filter: "drop-shadow(0 28px 52px rgba(30, 30, 30, 0.65))",
                    }}
                  />
                </div>
              </div>

              {/* Text col */}
              <div
                className="flex-1 flex flex-col justify-center gap-4"
                style={{ paddingRight: "56px", paddingLeft: "8px" }}
              >
                {active === i && (
                  <TextContent key={`d-${textKey}`} color={color} />
                )}
              </div>
            </div>

            {/* ── MOBILE layout: shirt TOP, text BOTTOM ── */}
            <div className="flex sm:hidden flex-col w-full h-full">
              {/* Shirt top half */}
              <div
                className="flex items-end justify-center pt-6 pb-2"
                style={{ flex: "0 0 52%" }}
              >
                <div
                  style={{
                    // ---- OYAGE ORIGINAL ANIMATION STYLES ----
                    animation:
                      active === i
                        ? "tylon-shirt-in 0.75s cubic-bezier(.34,1.3,.64,1) forwards"
                        : "none",
                    opacity: active === i ? undefined : 0,
                    transform:
                      active === i
                        ? undefined
                        : "translateX(-30px) rotate(-4deg)",
                  }}
                  /*style={{
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.85))",
                    animation:
                      active === i
                        ? "tylon-shirt-in 0.75s cubic-bezier(.34,1.3,.64,1) forwards"
                        : "none",
                    opacity: active === i ? undefined : 0,
                    transform:
                      active === i
                        ? undefined
                        : "translateX(-30px) rotate(-4deg)",
                  }}*/
                >
                  <Image
                    src={color.img}
                    alt={`TYLON ${color.name}`}
                    width={430}
                    height={470}
                    className="object-contain"
                    priority={i === 0}
                    style={{
                      filter: "drop-shadow(0 28px 52px rgba(30, 30, 30, 0.65))",
                    }}
                  />
                </div>
              </div>

              {/* Text bottom half */}
              <div
                className="flex flex-col justify-center gap-2.5 px-6 pb-4"
                style={{ flex: 1, overflow: "hidden" }}
              >
                {active === i && (
                  <TextContent key={`m-${textKey}`} color={color} mobile />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Dot nav ── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
        {COLORS.map((col, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={col.name}
            style={{
              width: "5px",
              height: active === i ? "18px" : "5px",
              background:
                active === i
                  ? "rgba(240,237,230,0.85)"
                  : "rgba(240,237,230,0.2)",
              border: "none",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div
        className="absolute bottom-0 left-0 h-0.5 z-10"
        style={{
          width: `${((active + 1) / COLORS.length) * 100}%`,
          background: c.hex,
          opacity: 0.6,
          transition: "width 0.5s ease, background 0.9s ease",
        }}
      />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes tylon-scan {
          from { top: -1px; }
          to   { top: 100%; }
        }
        @keyframes tylon-shirt-in {
          from { transform: translateX(-55px) rotate(-5deg); opacity: 0; }
          to   { transform: translateX(0) rotate(0deg); opacity: 1; }
        }
        @keyframes tylon-slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes tylon-fade-up {
          from { transform: translateY(14px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes tylon-fade-right {
          from { transform: translateX(-16px); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        .tylon-track::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

/* ── Reusable text block (desktop + mobile) ── */
function TextContent({
  color,
  mobile = false,
}: {
  color: (typeof COLORS)[0];
  mobile?: boolean;
}) {
  return (
    <>
      <p
        className="font-mono uppercase"
        style={{
          fontSize: "9px",
          letterSpacing: "0.4em",
          color: "rgba(240,237,230,0.32)",
          animation: "tylon-fade-up 0.5s 0.04s both",
        }}
      >
        — COLOUR {color.id}
      </p>

      <div className="overflow-hidden">
        <h3
          className="font-display font-bold uppercase leading-none"
          style={{
            fontSize: mobile ? "clamp(28px,8vw,40px)" : "clamp(32px,5vw,54px)",
            color: "#F0EDE666",
            letterSpacing: "0.04em",
            animation:
              "tylon-slide-up 0.65s cubic-bezier(.16,1,.3,1) 0.08s both",
          }}
        >
          {color.name}
        </h3>
      </div>

      <div
        className="inline-flex items-center gap-2 w-fit font-mono uppercase"
        style={{
          fontSize: "9px",
          letterSpacing: "0.25em",
          padding: "5px 12px",
          border: `1px solid ${color.chipColor}`,
          color: "rgba(240,237,230,0.42)",
          animation: "tylon-fade-right 0.5s 0.16s both",
        }}
      >
        ◆ {color.sub}
      </div>

      {!mobile && (
        <div
          className="relative pl-4"
          style={{
            maxWidth: "420px",
            animation: "tylon-fade-up 0.6s 0.26s both",
          }}
        >
          <div
            className="absolute left-0 top-1 bottom-1 w-0.5"
            style={{ background: color.storyLine }}
          />
          <p
            className="font-body text-sm italic leading-relaxed"
            style={{ color: "rgba(240,237,230,0.48)" }}
          >
            {color.story}
          </p>
        </div>
      )}

      {mobile && (
        <p
          className="font-body italic leading-relaxed"
          style={{
            fontSize: "12px",
            color: "rgba(240,237,230,0.45)",
            animation: "tylon-fade-up 0.6s 0.22s both",
            WebkitLineClamp: 4,
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {color.story}
        </p>
      )}

      <p
        className="font-mono"
        style={{
          fontSize: "9px",
          letterSpacing: "0.28em",
          color: "rgba(240,237,230,0.15)",
          animation: "tylon-fade-up 0.5s 0.35s both",
        }}
      >
        {color.name} / {color.hex}
      </p>
    </>
  );
}
