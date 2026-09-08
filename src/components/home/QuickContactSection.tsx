import { CheckCircle2, Clock, ShieldCheck, PhoneCall } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadForm from "@/components/forms/LeadForm";

const points = [
  { icon: Clock, text: "We call you back within 24 hours, guaranteed." },
  { icon: ShieldCheck, text: "No obligation - just a free, honest assessment." },
  { icon: PhoneCall, text: "Talk to a real solar consultant, not a call center." },
];

export default function QuickContactSection() {
  return (
    <section id="quick-quote" className="py-16 bg-white scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Get In Touch"
          title="Request a Free Callback"
          description="Just your name, number and address - we'll call you within 24 hours."
        />
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
            <div className="flex items-center gap-2 text-sm text-leaf-700 bg-leaf-500/10 border border-leaf-500/20 rounded-full px-4 py-2 w-fit">
              <CheckCircle2 className="h-4 w-4" /> Free site survey included
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 shadow-sm p-6 sm:p-8">
            <LeadForm source="home-quick" variant="quick" />
          </div>
        </div>
      </Container>
    </section>
  );
}
