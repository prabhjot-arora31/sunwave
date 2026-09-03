import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { installationProcess } from "@/data/content";

export default function InstallationProcess() {
  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Our Installation Process"
          description="From the first call to switching on your system - here's what to expect."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {installationProcess.map((p) => (
            <div key={p.step} className="relative rounded-2xl bg-white border border-slate-100 p-6">
              <span
                aria-hidden="true"
                className="absolute -top-4 -left-2 text-6xl font-black text-slate-100 select-none"
              >
                {String(p.step).padStart(2, "0")}
              </span>
              <div className="relative">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sun-500/10 text-sun-600 mb-4">
                  <DynamicIcon name={p.icon} className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-sky-950 mb-1.5">{p.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
