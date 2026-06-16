"use client";

import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [tooltip, setTooltip] = useState(false);

  return (
    <div className="fixed bottom-8 md:bottom-8 right-5 z-40 flex flex-col items-end gap-2">
      {tooltip && (
        <div className="bg-tylon-secondary border border-tylon-border px-4 py-3 text-right shadow-xl animate-scale-in">
          <p className="font-display text-sm tracking-[0.1em] text-tylon-primary uppercase mb-0.5">
            Chat with Us
          </p>
          <p className="font-mono text-[10px] text-tylon-muted tracking-wide">
            Fast replies · COD orders
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {tooltip && (
          <button
            onClick={() => setTooltip(false)}
            className="w-7 h-7 bg-tylon-card border border-tylon-border flex items-center justify-center text-tylon-muted hover:text-tylon-primary"
          >
            <X size={12} />
          </button>
        )}
        <a
          href="https://wa.me/94771234567"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setTooltip(true)}
          className="whatsapp-btn w-13 h-13 bg-[#25D366] flex items-center justify-center shadow-lg hover:bg-[#20c05c] transition-colors"
          style={{ width: "52px", height: "52px" }}
          aria-label="WhatsApp"
        >
          <MessageCircle size={22} className="text-white" fill="white" />
        </a>
      </div>
    </div>
  );
}
