import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
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
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
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
      </main>
      <Footer />
    </>
  );
}
