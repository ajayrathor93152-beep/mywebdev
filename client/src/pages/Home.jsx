import CtaBand from "@/components/home/CtaBand";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import StatsShowcase from "@/components/home/StatsShowcase";
import Testimonials from "@/components/home/Testimonials";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import { useForcedTheme } from "@/context/ThemeContext";

export default function Home() {
  // The landing page is designed for black + neon only; other pages follow the visitor's theme.
  useForcedTheme("dark");

  return (
    <>
      <Hero />
      <Marquee />
      <ServicesShowcase />
      <WhyChooseUs />
      <StatsShowcase />
      <Testimonials />
      <CtaBand />
    </>
  );
}
