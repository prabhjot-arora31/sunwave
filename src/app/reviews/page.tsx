import type { Metadata } from "next";
import { MessageSquareText, Star, Users } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ReviewForm from "@/components/forms/ReviewForm";
import { getSiteSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Share Your Experience",
  description:
    "Already installed solar with Sun Wave? Share your experience and help other homeowners make the switch.",
  alternates: { canonical: "/reviews" },
  robots: { index: false, follow: true },
};

export default async function ReviewsPage() {
  const settings = await getSiteSettings();
  const points = [
    { icon: Users, text: `Join ${settings.happyCustomers} customers who've already gone solar with us.` },
    { icon: Star, text: "Your rating and feedback are moderated before going live." },
    { icon: MessageSquareText, text: "Takes under two minutes - no account or sign-up needed." },
  ];

  return (
    <>
      <PageHero
        eyebrow="Customer Reviews"
        title="Share Your Experience"
        description="Already gone solar with us? We'd love to hear how it went - your review helps other homeowners considering the switch."
      />
      <Reveal><section className="py-20 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
            <div className="space-y-5">
              {points.map((p) => (
                <div key={p.text} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-500/10 text-sun-600">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <p className="text-slate-700 leading-relaxed pt-2">{p.text}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 sm:p-9">
              <ReviewForm />
            </div>
          </div>
        </Container>
      </section></Reveal>
    </>
  );
}
