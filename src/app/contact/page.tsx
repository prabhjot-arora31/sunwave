import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import LeadForm from "@/components/forms/LeadForm";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Sun Wave Solar for a free consultation and quote on residential, commercial or industrial solar.",
  alternates: { canonical: "/contact" },
};

const contactDetails = [
  { icon: Phone, label: "Call Us", value: company.phone, href: `tel:${company.phone.replace(/\s/g, "")}` },
  { icon: Mail, label: "Email Us", value: company.email, href: `mailto:${company.email}` },
  { icon: MapPin, label: "Visit Us", value: company.address },
  { icon: Clock, label: "Working Hours", value: company.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Have a question or ready for a free solar consultation? Reach out and our team will respond within 24 hours."
      />

      <section id="quote-form" className="py-20 bg-white scroll-mt-20">
        <Container className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 rounded-2xl bg-slate-50 border border-slate-100 p-6 sm:p-9">
            <h2 className="text-xl font-bold text-sky-950 mb-6">Send Us Your Requirement</h2>
            <LeadForm source="contact" />
          </div>
          <div className="space-y-4">
            <h2 className="sr-only">Contact Details</h2>
            {contactDetails.map((c) => (
              <div
                key={c.label}
                className="flex items-start gap-4 rounded-2xl bg-slate-50 border border-slate-100 p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-500/10 text-sun-600">
                  <c.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-slate-500">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-sm font-semibold text-sky-950 hover:text-sun-600">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-sky-950">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-2xl overflow-hidden border border-slate-100 h-56 bg-slate-200">
              <iframe
                title="Sun Wave Solar Location"
                className="w-full h-full grayscale"
                loading="lazy"
                src="https://maps.google.com/maps?q=Kabir%20Nagar%2C%20Nari%20Road%2C%20Nagpur%2C%20Maharashtra%20440026&t=&z=14&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
