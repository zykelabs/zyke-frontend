import Image from "next/image";
import { steps, beforeAfter } from "@/lib/content";
import { Section } from "./Section";
import { BeforeAfter } from "./BeforeAfter";

export function HowItWorked() {
  return (
    <Section
      id="how"
      n="03"
      label="How it worked"
      title={
        <>
          One brand, one trend, nine posts, one edit.
        </>
      }
      lede="The product was a pipeline. Each stage handed a richer object to the next: a brand, then an idea, then a post, then a corrected image. You could stop and steer at every stage. This is the demo, step by step."
    >
      <ol className="divide-y divide-rule border-y rule">
        {steps.map((s, i) => (
          <li key={s.n} className="grid gap-8 py-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <p className="label">Step {s.n}</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">{s.title}</h3>
              <p className="mt-5 text-[15px] italic leading-relaxed text-ink2">{s.demo}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink2">{s.body}</p>
            </div>
            <div className="lg:col-span-6">
              {i === 0 && <BrandVoiceForm />}
              {i === 1 && <IdeaList />}
              {i === 2 && <PostGrid />}
              {i === 3 && <BeforeAfter {...beforeAfter} />}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// A quiet, faithful recreation of the brand voice record from the demo.
function BrandVoiceForm() {
  const rows: [string, string][] = [
    ["Brand", "Zomato"],
    ["Type", "Product-based"],
    ["Tone", "Playful, quick, a little cheeky"],
    ["Emotion", "Delight, mild chaos"],
    ["Character", "The witty friend who always knows where to eat"],
    ["Sources", "zomato.com, @zomato on Instagram and X, 3 uploaded posts"],
  ];
  return (
    <dl className="border-t rule text-[15px]">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[96px_1fr] gap-4 border-b rule py-3">
          <dt className="text-mute">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function IdeaList() {
  const trends = [
    ["SpaceX catches Starship booster", true],
    ["Diwali sales week", false],
    ["IPL auction rumours", false],
    ["Monsoon delays in Mumbai", false],
  ] as const;
  const ideas = [
    ["SpaceX vs Zomato: a precision infographic", true],
    ["Zomato Mission Control", true],
    ["Boosters vs biryani: the countdown", false],
    ["Let Zyke add one idea of its own", true],
  ] as const;
  const List = ({ heading, rows, radio }: { heading: string; rows: readonly (readonly [string, boolean])[]; radio?: boolean }) => (
    <div>
      <p className="label border-b rule pb-2">{heading}</p>
      <ul className="divide-y divide-rule text-[15px]">
        {rows.map(([t, on]) => (
          <li key={t} className="flex items-center gap-3 py-2.5">
            <span
              className={cnMark(on, radio)}
              aria-hidden
            />
            <span className={on ? "text-ink" : "text-mute"}>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <List heading="Trending now" rows={trends} radio />
      <List heading="Ideas in your voice" rows={ideas} />
    </div>
  );
}

function cnMark(on: boolean, radio?: boolean) {
  const shape = radio ? "rounded-full" : "rounded-[2px]";
  return `inline-block h-3.5 w-3.5 shrink-0 border ${shape} ${on ? "border-ink bg-ink" : "border-rule"}`;
}

function PostGrid() {
  const imgs = ["/posts/Idea1Post1Img1.jpg", "/posts/Idea1Post1Img2.png", "/posts/Idea1Post1Img3.png"];
  return (
    <figure>
      <div className="grid grid-cols-3 gap-2">
        {imgs.map((s, i) => (
          <div key={s} className="plate">
            <Image src={s} alt={`SpaceX vs Zomato, image ${i + 1}`} width={512} height={512} className="aspect-square w-full object-cover" />
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-[13px] leading-relaxed text-mute">
        Idea 1, post 1: three images, one caption. The typos in the rendered text are the image model&rsquo;s, from late
        2024, and are left as they were.
      </figcaption>
    </figure>
  );
}
