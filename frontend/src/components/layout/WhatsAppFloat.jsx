"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

export function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Show tooltip after a brief 1.2s delay
    const showTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 1200);

    // Automatically fade it away after 5 seconds
    const hideTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 6200);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappDefaultMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end flex-col gap-2 pointer-events-none">
      {/* Tooltip Bubble */}
      {showTooltip && !hasDismissed && (
        <div className="pointer-events-auto bg-surface text-text rounded-2xl shadow-xl border border-border p-3 max-w-[220px] text-xs relative animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            type="button"
            onClick={() => setHasDismissed(true)}
            className="absolute top-1.5 right-1.5 p-1 text-muted hover:text-text rounded-full hover:bg-bg cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="font-semibold text-primary mb-0.5">Welcome to Hari Om!</div>
          <div className="text-muted leading-tight">
            How can we assist your property search today?
          </div>
          {/* Tooltip Arrow */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-surface border-b border-r border-border rotate-45" />
        </div>
      )}

      {/* WhatsApp Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Hari Om Real Estate on WhatsApp"
        className="pointer-events-auto w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 animate-soft-pulse group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
      >
        <MessageCircle className="w-7 h-7 fill-white/20 transition-transform group-hover:rotate-6" />
      </a>
    </div>
  );
}

export default WhatsAppFloat;

