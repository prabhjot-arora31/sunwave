import Hero from "@/components/home/Hero";
import QuickContactSection from "@/components/home/QuickContactSection";
import SavingsCalculator from "@/components/home/SavingsCalculator";
import Benefits from "@/components/home/Benefits";
import SolarSegments from "@/components/home/SolarSegments";
import GridTypes from "@/components/home/GridTypes";
import SubsidySection from "@/components/home/SubsidySection";
import FinanceSection from "@/components/home/FinanceSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import InstallationProcess from "@/components/home/InstallationProcess";
import Testimonials from "@/components/home/Testimonials";
import Projects from "@/components/home/Projects";
import FAQ from "@/components/home/FAQ";
import ContactSection from "@/components/home/ContactSection";

// Testimonials queries the DB for approved reviews - without this the page
// would be statically frozen at build time and newly approved reviews
// wouldn't appear until the next deploy.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Hero />
      <QuickContactSection />
      <SavingsCalculator />
      <Benefits />
      <SolarSegments />
      <GridTypes />
      <SubsidySection />
      <FinanceSection />
      <WhyChooseUs />
      <InstallationProcess />
      <Testimonials />
      <Projects />
      <FAQ />
      <ContactSection />
    </>
  );
}
