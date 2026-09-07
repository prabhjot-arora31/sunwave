import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import Container from "@/components/ui/Container";
import DynamicIcon from "@/components/ui/DynamicIcon";
import { productCategories } from "@/data/products";

export const metadata: Metadata = {
  title: "Solar Products",
  description:
    "Explore Sun Wave's range of solar panels, inverters, batteries, mounting structures and accessories.",
  alternates: { canonical: "/solar-products" },
};

export default function SolarProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Range"
        title="Solar Products"
        description="High-quality, BIS-certified solar components sourced from trusted manufacturers, built to perform for 25+ years."
      />
      <section className="py-20 bg-white">
        <Container className="space-y-14">
          {productCategories.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sun-500/10 text-sun-600">
                  <DynamicIcon name={cat.icon} className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-bold text-sky-950">{cat.category}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6 hover:shadow-lg hover:border-sun-200 transition-all"
                  >
                    <h3 className="font-bold text-sky-950 mb-2">{item.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{item.specs}</p>
                    {item.warranty && (
                      <p className="text-xs font-semibold text-leaf-700 bg-leaf-500/10 inline-block rounded-full px-3 py-1">
                        {item.warranty}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Container>
      </section>
      <CtaBanner
        title="Need Help Choosing the Right Components?"
        description="Talk to our solar consultants for a system designed around your roof and budget."
      />
    </>
  );
}
