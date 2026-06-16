"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Loader2, Lock } from "lucide-react";
import { toggleSpeechLike } from "@/lib/actions/speeches";
import type { Speech } from "@/lib/actions/speeches";
import toast from "react-hot-toast";

interface SpeechesSectionProps {
  speeches: Speech[];
  userEmail: string | null;
}

export default function SpeechesSection({
  speeches,
  userEmail,
}: SpeechesSectionProps) {
  const [likeStates, setLikeStates] = useState<
    Record<string, { liked: boolean; count: number; loading: boolean }>
  >(
    Object.fromEntries(
      speeches.map((s) => [
        s.id,
        {
          liked: s.user_liked ?? false,
          count: s.like_count ?? 0,
          loading: false,
        },
      ]),
    ),
  );

  const handleLike = async (e: React.MouseEvent, speechId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userEmail) {
      window.dispatchEvent(new CustomEvent("open-auth-modal"));
      toast("SIGN IN TO LIKE", { icon: "🔒" });
      return;
    }

    setLikeStates((prev) => ({
      ...prev,
      [speechId]: { ...prev[speechId], loading: true },
    }));

    const result = await toggleSpeechLike(speechId, userEmail);

    setLikeStates((prev) => ({
      ...prev,
      [speechId]: {
        liked: result.liked,
        count: result.count,
        loading: false,
      },
    }));
  };

  if (speeches.length === 0) return null;

  return (
    <section id="speeches" className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="font-mono text-[10px] tracking-[0.4em] text-army uppercase mb-3">
            — THE MINDSET
          </p>
          <h2 className="font-display text-5xl md:text-6xl font-bold tracking-[0.05em] text-tylon-primary uppercase leading-none">
            MOTIVATIONAL
            <br />
            <span className="text-army-light">SPEECHES</span>
          </h2>
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          {!userEmail && (
            <div className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-tylon-muted/60 mb-1">
              <Lock size={10} />
              SIGN IN TO LIKE
            </div>
          )}
          <span className="font-mono text-[10px] text-tylon-muted tracking-widest">
            {speeches.length} SPEECH{speeches.length !== 1 ? "ES" : ""}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speeches.map((speech, idx) => {
          const ls = likeStates[speech.id] ?? {
            liked: false,
            count: 0,
            loading: false,
          };

          return (
            <Link
              key={speech.id}
              href={`/speeches/${speech.id}`}
              className="group block bg-tylon-card border border-tylon-border hover:border-army transition-all duration-300 overflow-hidden"
              style={{
                animationDelay: `${idx * 0.08}s`,
              }}
            >
              {/* Image */}
              {speech.image_url ? (
                <div className="relative h-96 overflow-hidden bg-tylon-secondary">
                  <Image
                    src={speech.image_url}
                    alt={speech.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    //className="product-image object-cover"
                    //sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tylon-bg/60 to-transparent" />
                  {/* Like badge over image */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-tylon-bg/80 backdrop-blur-sm border border-tylon-border px-2.5 py-1.5">
                    <Heart
                      size={11}
                      className={ls.liked ? "text-danger" : "text-tylon-muted"}
                      fill={ls.liked ? "currentColor" : "none"}
                    />
                    <span className="font-mono text-[10px] text-tylon-primary">
                      {ls.count}
                    </span>
                  </div>
                </div>
              ) : (
                // No image — decorative panel
                <div className="relative h-32 bg-tylon-secondary border-b border-tylon-border flex items-center justify-center overflow-hidden">
                  <span
                    className="font-display text-6xl font-bold text-tylon-border/60 select-none tracking-[0.1em]"
                    aria-hidden
                  >
                    {speech.title.charAt(0)}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-army/5 to-transparent" />
                  {/* Like badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-tylon-bg/80 border border-tylon-border px-2.5 py-1.5">
                    <Heart
                      size={11}
                      className={ls.liked ? "text-danger" : "text-tylon-muted"}
                      fill={ls.liked ? "currentColor" : "none"}
                    />
                    <span className="font-mono text-[10px] text-tylon-primary">
                      {ls.count}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-5">
                <p className="font-mono text-[9px] tracking-[0.35em] text-army uppercase mb-2">
                  — SPEECH
                </p>
                <h3 className="font-display text-xl font-bold tracking-[0.06em] text-tylon-primary uppercase group-hover:text-army-light transition-colors mb-3 leading-tight">
                  {speech.title}
                </h3>
                <p className="font-body text-sm text-tylon-muted italic leading-relaxed line-clamp-3 mb-5">
                  "{speech.excerpt}"
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-tylon-border pt-4">
                  {/* Like button */}
                  <button
                    onClick={(e) => handleLike(e, speech.id)}
                    disabled={ls.loading}
                    className={`flex items-center gap-2 px-3 py-2 border font-mono text-[9px] tracking-widest uppercase transition-all ${
                      ls.liked
                        ? "bg-danger/10 border-danger text-danger"
                        : "border-tylon-border text-tylon-muted hover:border-danger hover:text-danger"
                    }`}
                  >
                    {ls.loading ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <Heart
                        size={10}
                        fill={ls.liked ? "currentColor" : "none"}
                      />
                    )}
                    {ls.liked ? "LIKED" : "LIKE"}
                    <span>{ls.count}</span>
                  </button>

                  <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest text-tylon-muted group-hover:text-army-light transition-colors">
                    READ MORE
                    <ArrowRight
                      size={11}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
