import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import Container from "@/components/ui/Container";
import { company } from "@/data/site";

export default function CtaBanner({
  title = "Ready to Switch to Solar?",
  description = "Get a free site survey and personalized quote from our solar experts.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-16 bg-sun-700">
      <Container className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{title}</h2>
          <p className="mt-2 text-white">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/contact#quote-form"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-950 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-900 transition-colors"
          >
            Get Free Quote <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-950 hover:bg-slate-100 transition-colors"
          >
            <Phone className="h-4 w-4" /> {company.phoneDisplay}
          </a>
        </div>
      </Container>
    </section>
  );
}
