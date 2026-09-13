import { SectionsProvider } from "@/components/landing/sections-context";
import { Group } from "@/components/landing/Group";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Summary } from "@/components/landing/Summary";
import { DemoVideo } from "@/components/landing/DemoVideo";
import { SectionBar } from "@/components/landing/SectionBar";
import { Pillars } from "@/components/landing/Pillars";
import { HowItWorked } from "@/components/landing/HowItWorked";
import { Features } from "@/components/landing/Features";
import { Work } from "@/components/landing/Work";
import { Problem } from "@/components/landing/Problem";
import { Buyers } from "@/components/landing/Buyers";
import { Economics } from "@/components/landing/Economics";
import { UnderTheHood } from "@/components/landing/UnderTheHood";
import { Story } from "@/components/landing/Story";
import { Why } from "@/components/landing/Why";
import { Footer } from "@/components/landing/Footer";
import { sections } from "@/lib/content";

const g = Object.fromEntries(sections.map((s) => [s.id, s]));

export default function Home() {
  return (
    <SectionsProvider ids={sections.map((s) => s.id)}>
      <Nav />
      <main>
        <Hero />
        <Summary />
        <DemoVideo />
        <SectionBar />

        <Group {...g.product}>
          <Pillars />
          <HowItWorked />
          <Features />
        </Group>

        <Group {...g.work}>
          <Work />
        </Group>

        <Group {...g.machine}>
          <UnderTheHood />
        </Group>

        <Group {...g.business}>
          <Problem />
          <Buyers />
          <Economics />
        </Group>

        <Group {...g.story}>
          <Story />
          <Why />
        </Group>
      </main>
      <Footer />
    </SectionsProvider>
  );
}
