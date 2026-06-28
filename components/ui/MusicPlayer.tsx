"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { weddingConfig } from "@/lib/weddingConfig";
//import { weddingConfig } from "@/lib/weddingConfig";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Try to start music once the guest scrolls past the hero section.
  // Browsers block unprompted autoplay, so this only fires after a
  // user gesture (scroll counts in most browsers once combined with
  // play() inside the resulting event — if it's still blocked, the
  // floating button lets guests start it with one tap instead).
  useEffect(() => {
    const handleScroll = () => {
      if (hasStarted) return;
      if (window.scrollY > window.innerHeight * 0.6) {
        setHasStarted(true);
        audioRef.current
          ?.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked — guest can tap the floating button.
            setIsPlaying(false);
          });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasStarted]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      setHasStarted(true);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={weddingConfig.musicSrc} loop preload="none" />

      <motion.button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-black/10  "
      >
        <AnimatePresence mode="wait" initial={false}>
          {isPlaying ? (
            <motion.span
              key="playing"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.25 }}
              className="relative flex items-center justify-center"
            >
              <Volume2 className="h-5 w-5 text-white/60" />
              <motion.span
                className="absolute -inset-1 rounded-full border border-blush-300"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </motion.span>
          ) : (
            <motion.span
              key="paused"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.25 }}
            >
              <VolumeX className="h-5 w-5 text-ink-400" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
