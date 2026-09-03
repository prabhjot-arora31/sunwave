import { MapPin, Zap } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/data/content";

const typeColors: Record<string, string> = {
  Residential: "bg-leaf-500/10 text-leaf-700",
  Commercial: "bg-sun-500/10 text-sun-700",
  Industrial: "bg-sky-500/10 text-sky-700",
};

export default function Projects() {
  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="Our Work"
          title="Completed Projects"
          description="A glimpse of rooftop and ground-mount solar systems we've installed across India."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.title} className="rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
              <div className="h-40 bg-gradient-to-br from-sky-900 to-sky-700 flex items-center justify-center">
                <Zap className="h-10 w-10 text-sun-400/70" />
              </div>
              <div className="p-5">
                <span
                  className={`inline-block text-xs font-semibold rounded-full px-2.5 py-1 mb-3 ${typeColors[p.type]}`}
                >
                  {p.type}
                </span>
                <h3 className="font-bold text-sky-950 mb-1.5">{p.title}</h3>
                <p className="flex items-center gap-1.5 text-sm text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {p.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
