"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

type DisplayTestimonial = {
  key: string;
  name: string;
  location: string;
  system: string;
  rating: number;
  quote: string;
};

const AUTO_ADVANCE_MS = 7000;

// 1 card per page on mobile, 2 on tablet, 4 on desktop - matches the visual
// grid breakpoints used elsewhere on the site (sm:grid-cols-2 lg:grid-cols-4).
function usePerPage() {
  const [perPage, setPerPage] = useState(1);

  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqSm = window.matchMedia("(min-width: 640px)");
    function update() {
      setPerPage(mqLg.matches ? 4 : mqSm.matches ? 2 : 1);
    }
    update();
    mqLg.addEventListener("change", update);
    mqSm.addEventListener("change", update);
    return () => {
      mqLg.removeEventListener("change", update);
      mqSm.removeEventListener("change", update);
    };
  }, []);

  return perPage;
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: DisplayTestimonial[] }) {
  const perPage = usePerPage();
  const pageCount = Math.max(1, Math.ceil(testimonials.length / perPage));
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Keep the current page in range if perPage changes (e.g. resizing across
  // a breakpoint changes how many pages there are).
  useEffect(() => {
    setPage((p) => Math.min(p, pageCount - 1));
  }, [pageCount]);

  const next = useCallback(() => setPage((p) => (p + 1) % pageCount), [pageCount]);
  const prev = () => setPage((p) => (p - 1 + pageCount) % pageCount);

  useEffect(() => {
    if (paused || pageCount <= 1) return;
    const timer = setInterval(next, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [paused, next, pageCount]);

  if (testimonials.length === 0) return null;

  const start = page * perPage;
  const current = testimonials.slice(start, start + perPage);

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div key={page} className="animate-fade-slide-in grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {current.map((t) => (
          <div
            key={t.key}
            className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/60 p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < t.rating ? "fill-sun-400 text-sun-400" : "fill-slate-200 text-slate-200"}`}
                />
              ))}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-auto pt-4 border-t border-slate-200">
              <p className="text-sm font-bold text-sky-950">{t.name}</p>
              {t.location && <p className="text-xs text-slate-500">{t.location}</p>}
              {t.system && <p className="text-xs font-medium text-sun-700 mt-1">{t.system}</p>}
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous testimonials"
            className="hidden lg:flex absolute -left-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:scale-110 transition-all items-center justify-center"
          >
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          </button>
          <button
            onClick={next}
            aria-label="Next testimonials"
            className="hidden lg:flex absolute -right-14 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:scale-110 transition-all items-center justify-center"
          >
            <ChevronRight className="h-4 w-4 text-slate-600" />
          </button>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              aria-label="Previous testimonials"
              className="lg:hidden p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={`Go to page ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === page ? "w-6 bg-sun-600" : "w-2 bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="Next testimonials"
              className="lg:hidden p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
