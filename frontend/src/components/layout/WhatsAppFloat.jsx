"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { siteConfig } from "@/data/siteConfig";

const MESSAGE =
  "Welcome to Hari Om Real Estate! We can assist you via WhatsApp too.";

export function WhatsAppFloat() {
  const [displayText, setDisplayText] = useState("");
  const [shown, setShown] = useState(false);
  const [hidden, setHidden] = useState(false);

  const isTyping = displayText.length < MESSAGE.length;

  // Show on every page load (mount) → hold 5s → fade out → unmount
  useEffect(() => {
    const showTimer = setTimeout(() => setShown(true), 800);
    const hideTimer = setTimeout(() => setShown(false), 5800); // 800 + 5000
    const cleanupTimer = setTimeout(() => setHidden(true), 6200); // 5800 + 400ms fade

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!shown || hidden) return;
    if (displayText.length >= MESSAGE.length) return;

    const t = setTimeout(() => {
      setDisplayText(MESSAGE.slice(0, displayText.length + 1));
    }, 35);
    return () => clearTimeout(t);
  }, [shown, displayText, hidden]);

  const handleDismiss = () => {
    setShown(false);
    setTimeout(() => setHidden(true), 400);
  };

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappDefaultMessage
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end sm:items-center gap-3">
      {/* Welcome bubble — slides in from the icon (right → left), fades after 5s.
          Wraps to 2 lines on small screens, single line on sm+. */}
      {!hidden && (
        <div
          className={`flex items-center gap-2 bg-white border border-slate-200 shadow-md rounded-2xl sm:rounded-full pl-4 pr-1.5 py-2 sm:py-1.5 w-[min(calc(100vw-5.5rem),22rem)] sm:w-auto max-w-[calc(100vw-5.5rem)] transition-all duration-300 ease-out ${
            shown
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-6 pointer-events-none"
          }`}
          aria-hidden={!shown}
        >
          <span className="sr-only">{MESSAGE}</span>

          <span
            aria-hidden="true"
            className="flex-1 text-xs sm:text-sm text-slate-800 text-left leading-snug line-clamp-2 sm:line-clamp-none sm:whitespace-nowrap"
          >
            {displayText}
            {isTyping && shown && (
              <span
                className="inline-block w-[1.5px] h-3.5 bg-slate-700 ml-0.5 align-middle"
                style={{ animation: "wa-cursor 900ms steps(1) infinite" }}
              />
            )}
          </span>

          <button
            type="button"
            onClick={handleDismiss}
            className="shrink-0 self-start sm:self-auto p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* WhatsApp FAB */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Hari Om Real Estate on WhatsApp"
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5a] text-white flex items-center justify-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
        style={{ animation: "wa-soft-glow 3s ease-in-out infinite" }}
      >
        <FaWhatsapp className="w-7 h-7" />
      </a>

      <style>{`
        @keyframes wa-soft-glow {
          0%, 100% { box-shadow: 0 4px 14px rgba(37, 211, 102, 0.22); }
          50% { box-shadow: 0 4px 22px rgba(37, 211, 102, 0.38); }
        }
        @keyframes wa-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default WhatsAppFloat;