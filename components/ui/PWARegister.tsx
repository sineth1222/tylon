"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    // ── Service Worker register ──
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered");

          // Periodic background sync (supported browsers)
          if ("periodicSync" in reg) {
            (reg as any).periodicSync
              .register("keep-alive", { minInterval: 12 * 60 * 60 * 1000 })
              .catch(() => startManualPing());
          } else {
            startManualPing();
          }
        })
        .catch(() => startManualPing());
    } else {
      startManualPing();
    }
  }, []);

  return null;
}

function startManualPing() {
  // Ping every 8 minutes while tab is open
  const ping = () => fetch("/api/ping").catch(() => {});

  ping(); // immediate ping on load

  const interval = setInterval(ping, 8 * 60 * 1000);

  window.addEventListener("beforeunload", () => clearInterval(interval));
}
