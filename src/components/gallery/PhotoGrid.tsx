"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryDisplayItem } from "@/lib/gallery";

export default function PhotoGrid({ photos }: { photos: GalleryDisplayItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  function close() {
    setActiveIndex(null);
  }

  function showPrev(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
  }

  function showNext(e: React.MouseEvent) {
    e.stopPropagation();
    setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-4/3 overflow-hidden rounded-xl bg-slate-100 border border-slate-200"
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={showPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={showNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl aspect-4/3"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={active.src} alt={active.caption} fill sizes="90vw" className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}
