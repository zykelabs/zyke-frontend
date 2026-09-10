import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { DemoVideo } from "@/components/landing/DemoVideo";
import { Pillars } from "@/components/landing/Pillars";
import { HowItWorked } from "@/components/landing/HowItWorked";
import { Features } from "@/components/landing/Features";
import { Gallery } from "@/components/landing/Gallery";
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
        <Pillars />
        <HowItWorked />
        <Features />
        <Gallery />
        <UnderTheHood />
        <Story />
      </main>
      <Footer />
    </>
  );
}
