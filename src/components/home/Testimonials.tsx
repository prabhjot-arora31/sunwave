import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
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
        <TestimonialsCarousel testimonials={testimonials} />

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
