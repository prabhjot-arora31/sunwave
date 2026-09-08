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
import Reveal from "@/components/ui/Reveal";

// Testimonials queries the DB for approved reviews - without this the page
// would be statically frozen at build time and newly approved reviews
// wouldn't appear until the next deploy.
export const revalidate = 300;

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal><QuickContactSection /></Reveal>
      <Reveal><SubsidySection /></Reveal>
      <Reveal><SavingsCalculator /></Reveal>
      <Reveal><Benefits /></Reveal>
      <Reveal><SolarSegments /></Reveal>
      <Reveal><GridTypes /></Reveal>
      <Reveal><FinanceSection /></Reveal>
      <Reveal><WhyChooseUs /></Reveal>
      <Reveal><InstallationProcess /></Reveal>
      <Reveal><Testimonials /></Reveal>
      <Reveal><Projects /></Reveal>
      <Reveal><FAQ /></Reveal>
      <Reveal><ContactSection /></Reveal>
    </>
  );
}
