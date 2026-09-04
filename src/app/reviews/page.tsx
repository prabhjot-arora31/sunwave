import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import ReviewForm from "@/components/forms/ReviewForm";

export const metadata: Metadata = {
  title: "Share Your Experience",
  description:
    "Already installed solar with Sun Wave? Share your experience and help other homeowners make the switch.",
  alternates: { canonical: "/reviews" },
  robots: { index: false, follow: true },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Customer Reviews"
        title="Share Your Experience"
        description="Already gone solar with us? We'd love to hear how it went - your review helps other homeowners considering the switch."
      />
      <section className="py-20 bg-white">
        <Container className="max-w-2xl!">
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 sm:p-9">
            <ReviewForm />
          </div>
        </Container>
      </section>
    </>
  );
}
