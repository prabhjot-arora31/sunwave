import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { benefits } from "@/data/content";

export default function Benefits() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="Solar ke Benefits"
          title="Why Solar Makes Sense Today"
          description="Going solar isn't just eco-friendly - it's one of the smartest financial decisions for your home or business."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 hover:shadow-lg hover:border-sun-200 hover:-translate-y-1 transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sun-500/10 text-sun-600 mb-4">
                <DynamicIcon name={b.icon} />
              </span>
              <h3 className="text-lg font-bold text-sky-950 mb-2">{b.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
