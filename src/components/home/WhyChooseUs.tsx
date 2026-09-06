import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { whyChooseUs } from "@/data/content";

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading eyebrow="Why Choose Us" title="Trusted by 700+ Customers" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {whyChooseUs.map((w) => (
            <div key={w.title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-950 text-sun-400">
                <DynamicIcon name={w.icon} className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-sky-950 mb-1">{w.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{w.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
