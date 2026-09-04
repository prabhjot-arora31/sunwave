import Link from "next/link";
import { unstable_cache } from "next/cache";
import { Star, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials as fallbackTestimonials } from "@/data/content";
import { prisma } from "@/lib/prisma";

const MIN_DISPLAY_COUNT = 4;

type DisplayTestimonial = {
  key: string;
  name: string;
  location: string;
  system: string;
  rating: number;
  quote: string;
};

// Prisma calls aren't covered by Next's fetch-based data cache, so the page's
// `revalidate` export alone doesn't guarantee this is cached - wrap it
// explicitly so the (remote, network-latency-bound) DB query only runs once
// per window instead of on every request.
const getApprovedReviews = unstable_cache(
  async () => {
    const approved = await prisma.review.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    return approved.map((r) => ({
      key: `review-${r.id}`,
      name: r.name,
      location: r.city ?? "",
      system: r.systemType ?? "",
      rating: r.rating,
      quote: r.comment,
    }));
  },
  ["homepage-approved-reviews"],
  { revalidate: 300, tags: ["reviews"] }
);

async function getDisplayTestimonials(): Promise<DisplayTestimonial[]> {
  try {
    const real = await getApprovedReviews();
    if (real.length >= MIN_DISPLAY_COUNT) return real;

    const seed: DisplayTestimonial[] = fallbackTestimonials
      .slice(0, MIN_DISPLAY_COUNT - real.length)
      .map((t) => ({ key: `seed-${t.name}`, ...t }));

    return [...real, ...seed];
  } catch {
    // Never let a DB hiccup take down the homepage - fall back to seed data.
    return fallbackTestimonials.map((t) => ({ key: `seed-${t.name}`, ...t }));
  }
}

export default async function Testimonials() {
  const testimonials = await getDisplayTestimonials();

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Customer Reviews"
          title="What Our Customers Say"
          description="Real feedback from homeowners and businesses who switched to solar with us."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.key}
              className="flex flex-col rounded-2xl border border-slate-100 bg-slate-50/60 p-6"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < t.rating ? "fill-sun-400 text-sun-400" : "fill-slate-200 text-slate-200"
                    }`}
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

        <div className="text-center mt-10">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800"
          >
            Share Your Experience <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
