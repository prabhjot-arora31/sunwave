import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { gridTypes } from "@/data/content";

export default function GridTypes() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading
          eyebrow="System Types"
          title="On-Grid, Off-Grid & Hybrid Solar"
          description="Choose the system type that fits your power needs and budget."
        />
        <div className="grid sm:grid-cols-3 gap-6">
          {gridTypes.map((g) => (
            <div
              key={g.title}
              className="rounded-2xl border-2 border-slate-100 p-7 hover:border-sun-300 transition-colors"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sun-500/10 text-sun-600 mb-4">
                <DynamicIcon name={g.icon} />
              </span>
              <h3 className="text-lg font-bold text-sky-950 mb-2">{g.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{g.description}</p>
              <p className="text-xs font-semibold text-leaf-700 bg-leaf-500/10 inline-block rounded-full px-3 py-1">
                Best for: {g.bestFor}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
