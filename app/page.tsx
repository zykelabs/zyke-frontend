import { SectionsProvider } from "@/components/landing/sections-context";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Contents } from "@/components/landing/Contents";
import { DemoVideo } from "@/components/landing/DemoVideo";
import { Problem } from "@/components/landing/Problem";
import { Pillars } from "@/components/landing/Pillars";
import { HowItWorked } from "@/components/landing/HowItWorked";
import { Features } from "@/components/landing/Features";
import { Work } from "@/components/landing/Work";
import { Buyers } from "@/components/landing/Buyers";
import { Economics } from "@/components/landing/Economics";
import { UnderTheHood } from "@/components/landing/UnderTheHood";
import { Story } from "@/components/landing/Story";
import { Why } from "@/components/landing/Why";
import { Footer } from "@/components/landing/Footer";
import { sections } from "@/lib/content";

export default function Home() {
  return (
    <SectionsProvider ids={sections.map((s) => s.id)}>
      <Nav />
      <main>
        <Hero />
        <Contents />
        <DemoVideo />
        <Problem />
        <Pillars />
        <HowItWorked />
        <Features />
        <Work />
        <Buyers />
        <Economics />
        <UnderTheHood />
        <Story />
        <Why />
      </main>
      <Footer />
    </SectionsProvider>
  );
}
