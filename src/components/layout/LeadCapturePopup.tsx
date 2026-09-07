"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import LeadForm from "@/components/forms/LeadForm";

const STORAGE_KEY = "sunwave_popup_dismissed_until";
const SUPPRESS_DAYS = 7;
const TIME_DELAY_MS = 28_000;

function suppressFor(days: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + days * 24 * 60 * 60 * 1000));
  } catch {
    // localStorage may be unavailable (private mode, blocked) - fine to just
    // skip remembering the dismissal for this visitor.
  }
}

export default function LeadCapturePopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const suppressedPath = pathname?.startsWith("/admin") || pathname === "/contact";

  useEffect(() => {
    if (suppressedPath) return;

    try {
      const until = localStorage.getItem(STORAGE_KEY);
      if (until && Date.now() < Number(until)) return;
    } catch {
      // If localStorage throws on read, fall through and just show it -
      // worst case a visitor sees it more often than intended.
    }

    let shown = false;
    function show() {
      if (shown) return;
      shown = true;
      setOpen(true);
      document.removeEventListener("mouseout", handleMouseOut);
      clearTimeout(timer);
    }

    // mouseout (not mouseleave) + relatedTarget === null is the reliable
    // cross-browser way to detect the cursor actually leaving the document
    // toward the browser chrome (tab bar/address bar) rather than just
    // moving between elements within the page.
    function handleMouseOut(e: MouseEvent) {
      if (!e.relatedTarget && e.clientY <= 0) show();
    }

    document.addEventListener("mouseout", handleMouseOut);
    const timer = setTimeout(show, TIME_DELAY_MS);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function dismiss() {
    setOpen(false);
    suppressFor(SUPPRESS_DAYS);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <span className="inline-block text-xs font-semibold tracking-wide text-sun-600 uppercase mb-2">
          Free Consultation
        </span>
        <h3 id="lead-popup-title" className="text-xl font-bold text-sky-950 mb-1">
          Get a Free Solar Consultation
        </h3>
        <p className="text-sm text-slate-500 mb-5">
          Just your name, number and address - we&apos;ll call you within 24 hours.
        </p>

        <LeadForm source="exit-popup" variant="quick" onSuccess={() => suppressFor(30)} />
      </div>
    </div>
  );
}
