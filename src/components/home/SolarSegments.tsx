import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { solarSegments } from "@/data/content";

export default function SolarSegments() {
  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="Our Solutions"
          title="Solar for Every Need"
          description="Whether it's your home, your business or your factory - we have a solar solution sized for you."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solarSegments.map((s) => (
            <div
              key={s.title}
              className="flex flex-col rounded-2xl bg-white border border-slate-100 p-7 shadow-sm hover:shadow-xl transition-shadow"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-950 text-sun-400 mb-5">
                <DynamicIcon name={s.icon} />
              </span>
              <h3 className="text-xl font-bold text-sky-950 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{s.description}</p>
              <ul className="space-y-2 mb-6 mt-auto">
                {s.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-leaf-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={s.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800"
              >
                Learn More <span className="sr-only">about {s.title}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
