"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { weddingConfig } from "@/lib/weddingConfig";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startOnInteraction = () => {
      if (started) return;
      const audio = audioRef.current;
      if (!audio) return;

      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setStarted(true);
        })
        .catch(() => setIsPlaying(false));
    };

    // ඕනෑම interaction එකෙන් — click, touch, key
    window.addEventListener("click", startOnInteraction, { once: true });
    window.addEventListener("touchstart", startOnInteraction, { once: true });
    window.addEventListener("keydown", startOnInteraction, { once: true });

    return () => {
      window.removeEventListener("click", startOnInteraction);
      window.removeEventListener("touchstart", startOnInteraction);
      window.removeEventListener("keydown", startOnInteraction);
    };
  }, [started]);

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
    }
  };

  return (
    <>
      <audio ref={audioRef} src={weddingConfig.musicSrc} loop preload="auto" />

      <motion.button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-tylon-card border border-tylon-border backdrop-blur"
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
              <VolumeX className="h-5 w-5 text-white/60" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
