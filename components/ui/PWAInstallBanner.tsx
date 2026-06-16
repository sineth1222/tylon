"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

const E = [0.16, 1, 0.3, 1] as const;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * PWAInstallBanner
 * Shows a subtle install prompt when browser fires beforeinstallprompt.
 * Dismissible — remembers choice in localStorage.
 * Place inside app/layout.tsx or any client page.
 */
export default function PWAInstallBanner() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already dismissed?
    if (localStorage.getItem("pwa-dismissed") === "true") return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      // Small delay so page loads first
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
      setPrompt(null);
    }
  }

  function handleDismiss() {
    setVisible(false);
    localStorage.setItem("pwa-dismissed", "true");
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.45, ease: E }}
          className="fixed top-10 md:top-auto md:bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-80 md:max-h-20 z-[80]
                     bg-[#1A1A18] border border-[#2a2a28] shadow-2xl flex items-center gap-4 p-4"
        >
          {/* icon */}
          <div className="w-10 h-10 bg-[#4A5C3A]/10 border border-[#4A5C3A]/30 flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icons/icon-72x72.png"
              alt="Tylon"
              className="w-7 h-7 object-contain"
            />
          </div>

          {/* text */}
          <div className="flex-1 min-w-0">
            <p className="font-dm text-xs font-medium text-white leading-tight">
              Add to Home Screen
            </p>
            <p className="font-dm text-[10px] text-white/40 mt-0.5">
              Tylon Clothing App
            </p>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              onClick={handleInstall}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 bg-[#4A5C3A] text-[#F0EDE6] font-dm text-[10px]
                         tracking-wider uppercase px-3 py-2 cursor-pointer"
            >
              <Download size={11} /> Install
            </motion.button>
            <button
              onClick={handleDismiss}
              className="text-white/30 hover:text-white/70 transition-colors cursor-pointer p-1"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
