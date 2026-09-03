import Hero from "@/components/home/Hero";
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

export default function Home() {
  return (
    <>
      <Hero />
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
