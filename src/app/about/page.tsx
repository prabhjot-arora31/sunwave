import type { Metadata } from "next";
import { Target, Eye, Users, BadgeCheck, MapPin } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { company } from "@/data/site";
import { getSiteSettings } from "@/lib/siteSettings";

const otherCities = [
  "Amravati",
  "Akola",
  "Chandrapur",
  "Yavatmal",
  "Wardha",
  "Bhandara",
  "Gondia",
  "Gadchiroli",
  "Khamgaon",
  "Wani",
  "Hinganghat",
  "Ballarpur",
  "Katol",
  "Umred",
];

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Sun Wave Solar - our story, mission and the team helping India switch to clean solar energy.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To make clean, affordable solar energy accessible to every home and business in India through quality installations and honest service.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A future where every rooftop generates its own clean power, reducing dependence on fossil fuels and electricity bills alike.",
  },
];

const certifications = [
  "MNRE Empanelled Channel Partner",
  "ISO 9001:2015 Certified",
  "BIS Certified Component Suppliers",
  "Authorized DISCOM Net-Metering Partner",
];

const team = [
  { name: "Vikram Singh", role: "Founder & CEO" },
  { name: "Neha Kapoor", role: "Head of Engineering" },
  { name: "Arjun Verma", role: "Head of Operations" },
  { name: "Simran Kaur", role: "Customer Success Lead" },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const stats = [
    { label: "Years of Experience", value: settings.yearsExperience },
    { label: "Happy Customers", value: settings.happyCustomers },
    { label: "MW Installed Capacity", value: settings.mwCapacity },
    { label: "Cities Served", value: settings.citiesServed },
  ];

  return (
    <>
      <PageHero
        eyebrow="About Sun Wave"
        title="Powering India's Switch to Solar"
        description={`Founded in ${company.yearFounded}, ${company.fullName} has helped thousands of homes and businesses generate their own clean power.`}
      />

      <Reveal><section className="py-20 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <SectionHeading center={false} eyebrow="Our Story" title="Fast-Growing Solar Excellence" />
              <p className="text-slate-600 leading-relaxed mb-4">
                Sun Wave started with a simple belief - that clean energy shouldn&apos;t be a luxury.
                What began as a small team of engineers in Nagpur has grown into a
                solar EPC company serving residential, commercial and industrial
                customers across {settings.citiesServed} cities.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                In just a few years, we&apos;ve installed more than {settings.mwCapacity} MW of solar capacity, helped
                customers save crores in electricity costs, and built a reputation for
                transparent pricing and reliable after-sales service.
              </p>

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Areas We Serve
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-950 text-white text-xs font-semibold px-3.5 py-2">
                  <MapPin className="h-3.5 w-3.5" /> Nagpur (HQ)
                </span>
                {otherCities.map((city) => (
                  <span
                    key={city}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium px-3.5 py-2 hover:bg-sun-50 hover:text-sun-700 hover:-translate-y-0.5 transition-all"
                  >
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {city}
                  </span>
                ))}
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-6 text-center">
                  <dd className="text-3xl font-extrabold text-sun-600">{s.value}</dd>
                  <dt className="text-sm text-slate-500 mt-1">{s.label}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-950 text-sun-400 mb-4">
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="text-lg font-bold text-sky-950 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section></Reveal>

      <Reveal><section className="py-20 bg-slate-50">
        <Container>
          <SectionHeading eyebrow="Credentials" title="Certifications & Accreditations" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {certifications.map((c) => (
              <div
                key={c}
                className="flex items-center gap-3 rounded-2xl bg-white border border-slate-100 p-5"
              >
                <BadgeCheck className="h-6 w-6 text-leaf-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700">{c}</span>
              </div>
            ))}
          </div>
        </Container>
      </section></Reveal>

      <Reveal><section className="py-20 bg-white">
        <Container>
          <SectionHeading eyebrow="Our Team" title="Meet the People Behind Sun Wave" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t) => (
              <div key={t.name} className="text-center">
                <div className="h-28 w-28 mx-auto rounded-full bg-gradient-to-br from-sun-200 to-sun-400 flex items-center justify-center mb-4">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="font-bold text-sky-950">{t.name}</h3>
                <p className="text-sm text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>
        </Container>
      </section></Reveal>

      <Reveal><CtaBanner /></Reveal>
    </>
  );
}
