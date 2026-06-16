"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowLeft, Loader2 } from "lucide-react";
import { toggleSpeechLike } from "@/lib/actions/speeches";
import type { Speech } from "@/lib/actions/speeches";
import toast from "react-hot-toast";

export default function SpeechDetailClient({
  speech,
  userEmail,
}: {
  speech: Speech;
  userEmail: string | null;
}) {
  const [liked, setLiked] = useState(speech.user_liked ?? false);
  const [likeCount, setLikeCount] = useState(speech.like_count ?? 0);
  const [liking, setLiking] = useState(false);

  const handleLike = async () => {
    if (!userEmail) {
      window.dispatchEvent(new CustomEvent("open-auth-modal"));
      toast("SIGN IN TO LIKE THIS SPEECH", { icon: "🔒" });
      return;
    }
    setLiking(true);
    const result = await toggleSpeechLike(speech.id, userEmail);
    setLiked(result.liked);
    setLikeCount(result.count);
    setLiking(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* Back */}
      <Link
        href="/speeches"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-tylon-muted hover:text-tylon-primary uppercase transition-colors mt-8 mb-10"
      >
        <ArrowLeft size={12} /> BACK TO SPEECHES
      </Link>

      {/* Hero image */}
      {speech.image_url && (
        <div className="relative w-full h-96 md:h-[700px] overflow-hidden border border-tylon-border mb-10">
          <Image
            src={speech.image_url}
            alt={speech.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-tylon-bg/80 to-transparent" />
        </div>
      )}

      {/* Label */}
      <p className="font-mono text-[10px] tracking-[0.5em] text-army uppercase mb-4">
        — MOTIVATIONAL SPEECH
      </p>

      {/* Title */}
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-[0.05em] text-tylon-primary uppercase mb-6 leading-tight">
        {speech.title}
      </h1>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <span className="w-12 h-px bg-army" />
        <span className="font-mono text-[9px] tracking-[0.4em] text-army uppercase">
          TYLON / WEAR YOUR MISSION
        </span>
      </div>

      {/* Body */}
      <div className="story-panel px-8 py-10 mb-10">
        <blockquote className="font-display text-2xl md:text-3xl italic font-bold text-tylon-primary leading-tight mb-6 tracking-[0.02em]">
          "{speech.excerpt}"
        </blockquote>
        <div className="w-full h-px bg-tylon-border mb-8" />
        <div className="space-y-5">
          {speech.body
            .split("\n")
            .filter(Boolean)
            .map((para, i) => (
              <p
                key={i}
                className="font-body text-tylon-muted text-base leading-relaxed"
              >
                {para}
              </p>
            ))}
        </div>
      </div>

      {/* Like button */}
      <div className="flex items-center gap-6 border-t border-tylon-border pt-8">
        <button
          onClick={handleLike}
          disabled={liking}
          className={`flex items-center gap-3 px-6 py-3 border-2 font-mono text-[11px] tracking-widest uppercase transition-all ${
            liked
              ? "bg-danger/10 border-danger text-danger"
              : "border-tylon-border text-tylon-muted hover:border-danger hover:text-danger"
          }`}
        >
          {liking ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
          )}
          {liked ? "LIKED" : "LIKE THIS SPEECH"}
          <span className="font-display text-sm font-bold">{likeCount}</span>
        </button>

        {!userEmail && (
          <p className="font-mono text-[10px] text-tylon-muted tracking-wide">
            Sign in to like and save speeches
          </p>
        )}
      </div>
    </div>
  );
}
