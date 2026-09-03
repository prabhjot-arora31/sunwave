import { Star } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/content";

export default function Testimonials() {
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
              key={t.name}
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
                <p className="text-xs text-slate-500">{t.location}</p>
                <p className="text-xs font-medium text-sun-700 mt-1">{t.system}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
