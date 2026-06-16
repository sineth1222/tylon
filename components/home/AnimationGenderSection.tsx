"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function AnimationGenderSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Men's */}
        <Link
          href="/collections?gender=mens"
          className="group relative overflow-hidden bg-tylon-card border border-tylon-border min-h-[320px] flex items-end"
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-45 transition-opacity duration-700"
            style={{ backgroundImage: "url('/images/heroo2.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tylon-bg via-tylon-bg/20 to-transparent" />
          <div
            className={`relative z-10 p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <p className="font-mono text-[9px] tracking-[0.4em] text-army uppercase mb-2">
              — COLLECTION 01
            </p>
            <h3 className="font-display text-5xl font-bold tracking-[0.05em] text-tylon-primary/40 mb-4">
              MEN'S
            </h3>
            <span className="font-mono text-[10px] tracking-[0.2em] text-tylon-muted group-hover:text-army-light transition-colors">
              ENTER COLLECTION →
            </span>
          </div>
        </Link>

        {/* Women's coming soon */}
        <div className="group relative overflow-hidden bg-tylon-card border border-tylon-border min-h-[320px] flex items-end cursor-not-allowed">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: "url('/images/hero1.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tylon-bg via-tylon-bg/30 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border border-army/30 px-6 py-3">
              <span className="font-mono text-[11px] tracking-[0.4em] text-army/60 uppercase">
                DEPLOYING SOON
              </span>
            </div>
          </div>
          <div
            className={`relative z-10 p-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "0.25s" }}
          >
            <p className="font-mono text-[9px] tracking-[0.4em] text-army/50 uppercase mb-2">
              — COLLECTION 02
            </p>
            <h3 className="font-display text-5xl font-bold tracking-[0.05em] text-tylon-primary/40 mb-4">
              WOMEN'S
            </h3>
            <span className="font-mono text-[10px] tracking-[0.2em] text-tylon-muted/40">
              COMING SOON
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
