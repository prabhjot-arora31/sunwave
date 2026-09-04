"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";

const REVIEWS_PATH = "/reviews";

export default function ShareReviewsCard() {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}${REVIEWS_PATH}` : REVIEWS_PATH;

  function handleCopy() {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard access can be denied (permissions, non-secure context);
        // the URL is still visible and selectable in the field below.
      });
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col sm:flex-row items-center gap-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/api/admin/qr-code"
        alt="QR code linking to the reviews page"
        className="h-28 w-28 rounded-lg border border-slate-100 shrink-0"
      />
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Share This Page With Customers</h2>
        <p className="text-xs text-slate-500 mb-3">
          Send this link (WhatsApp, email) or print the QR code for handover paperwork, so customers
          can leave a review right after their installation.
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <code className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 max-w-full truncate">
            {shareUrl}
          </code>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-leaf-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy Link"}
          </button>
          <a
            href="/api/admin/qr-code"
            download="sunwave-reviews-qr.png"
            className="inline-flex items-center gap-1.5 rounded-full bg-sun-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sun-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Download QR
          </a>
        </div>
      </div>
    </div>
  );
}
