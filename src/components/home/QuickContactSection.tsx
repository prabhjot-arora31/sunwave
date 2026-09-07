import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadForm from "@/components/forms/LeadForm";

export default function QuickContactSection() {
  return (
    <section id="quick-quote" className="py-16 bg-white scroll-mt-20">
      <Container className="max-w-2xl">
        <SectionHeading
          eyebrow="Get In Touch"
          title="Request a Free Callback"
          description="Just your name, number and address - we'll call you within 24 hours."
        />
        <div className="rounded-2xl bg-slate-50 border border-slate-100 shadow-sm p-6 sm:p-8">
          <LeadForm source="home-quick" variant="quick" />
        </div>
      </Container>
    </section>
  );
}
