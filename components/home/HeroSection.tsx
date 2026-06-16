"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_IMAGES = [
  "/images/heroo1.png",
  "/images/heroo2.png",
  "/images/heroo3.png",
  "/images/heroo4.png",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  const headline = "THIS IS NOT\nCLOTHING.\nTHIS IS YOUR\nARMOR.";
  const displayChars = headline.slice(0, charIdx);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!revealed) return;
    if (charIdx >= headline.length) return;
    const t = setTimeout(() => setCharIdx((i) => i + 1), 40);
    return () => clearTimeout(t);
  }, [revealed, charIdx, headline.length]);

  // Slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pb-20 pt-0 overflow-hidden scanlines">
      {/* Background images */}
      {HERO_IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`Hero ${i + 1}`}
          fill
          priority={i === 0}
          className="object-cover z-0 transition-opacity duration-1000"
          style={{ opacity: current === i ? 1 : 0 }}
          sizes="100vw"
        />
      ))}

      {/* Heavy dark overlay */}
      <div className="absolute inset-0 bg-tylon-bg/75 z-[1]" />

      {/* Army green gradient bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-tylon-bg to-transparent z-[2]" />

      {/* Vertical text — left */}
      <div
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 hidden md:flex flex-col items-center gap-2"
        style={{ animation: "fadeUp 1s 1.5s both" }}
      >
        <span className="font-mono text-[8px] tracking-[0.4em] text-tylon-muted uppercase rotate-90 whitespace-nowrap">
          EST. 2024
        </span>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto mt-20">
        {/* Tagline eyebrow */}
        <div
          className="inline-flex items-center gap-3 mb-8"
          style={{ animation: "fadeUp 0.8s 0.2s both" }}
        >
          <span className="w-8 h-px bg-army" />
          <span className="font-mono text-[10px] tracking-[0.4em] text-army uppercase">
            WEAR YOUR MISSION
          </span>
          <span className="w-8 h-px bg-army" />
        </div>

        {/* Main headline — typewriter */}
        <h1 className="font-display text-[clamp(2.3rem,5vw,5rem)] font-bold leading-[0.92] tracking-[0.04em] text-tylon-primary/20 mb-6 whitespace-pre-line">
          {displayChars}
          <span
            className="inline-block w-1 h-[0.85em] bg-army ml-1 align-bottom animate-pulse"
            style={{ opacity: charIdx >= headline.length ? 0 : 1 }}
          />
        </h1>

        {/* Subtext /}
        <p
          className="font-body text-tylon-muted text-sm md:text-base max-w-sm mx-auto leading-relaxed mb-10 tracking-wide"
          style={{ animation: "fadeUp 0.9s 1.8s both" }}
        >
          7 designs. Each one a mission. Each one a story. Not fashion —
          philosophy.
        </p>*/}

        {/* CTA */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fadeUp 0.9s 2s both" }}
        >
          <Link
            href="/collections"
            className="group flex items-center gap-3 border border-army text-tylon-primary/20 px-10 py-4 font-display text-sm tracking-[0.2em] uppercase hover:bg-army transition-all duration-300"
          >
            ENTER THE COLLECTION
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          {/*<Link
            href="/about"
            className="font-mono text-[10px] tracking-[0.25em] text-tylon-muted uppercase underline underline-offset-4 hover:text-tylon-primary transition-colors"
          >
            READ THE MANIFESTO
          </Link>*/}
        </div>

        {/* Stats strip /}
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
        </div>*/}
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-14 md:bottom-10 flex flex-col justify-center items-center gap-2 z-10"
        style={{ animation: "fadeUp 0.9s 2.5s both" }}
      >
        <span className="font-mono text-[8px] tracking-[0.4em] text-tylon-muted uppercase">
          SCROLL
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-army to-transparent" />
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-44 md:bottom-44 right-6 flex flex-col items-center gap-2 z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1 transition-all duration-300 ${current === i ? "h-6 bg-army" : "h-2 bg-tylon-border"}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
