import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import LeadForm from "@/components/forms/LeadForm";
import { company } from "@/data/site";

const contactDetails = [
  { icon: Phone, label: "Call Us", value: company.phone },
  { icon: Mail, label: "Email Us", value: company.email },
  { icon: MapPin, label: "Visit Us", value: company.address },
  { icon: Clock, label: "Working Hours", value: company.hours },
];

export default function ContactSection() {
  return (
    <section id="quote-form" className="py-20 bg-slate-50 scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="Get In Touch"
          title="Get Your Free Solar Quote Today"
          description="Fill in your details below and our solar expert will get back to you within 24 hours."
        />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 shadow-sm p-6 sm:p-9">
            <LeadForm source="home" />
          </div>
          <div className="space-y-4">
            {contactDetails.map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-4 rounded-2xl bg-white border border-slate-100 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-500/10 text-sun-600">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-500">{c.label}</p>
                  <p className="text-sm font-semibold text-sky-950">{c.value}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl overflow-hidden border border-slate-100 h-48 bg-slate-200">
              <iframe
                title="Sun Wave Solar Location"
                className="w-full h-full"
                loading="lazy"
                src="https://maps.google.com/maps?q=Kabir%20Nagar%2C%20Nari%20Road%2C%20Nagpur%2C%20Maharashtra%20440026&t=&z=14&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
