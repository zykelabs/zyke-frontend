import { problems, coreNeed } from "@/lib/content";
import { Section } from "./Section";

export function Problem() {
  return (
    <Section
      id="problem"
      n="02"
      label="The problem"
      title="We ran a marketing team once. It was miserable."
      lede="Both of us handled PR and marketing for the Indian Case Challenge at IIT Kharagpur in 2024. We needed a lot of posts, fast, and everything available to us was either expensive or bad. That is the whole reason Zyke existed."
    >
      <ol className="divide-y divide-rule border-y rule">
        {problems.map((p) => (
          <li key={p.n} className="grid gap-3 py-8 lg:grid-cols-12 lg:gap-8">
            <span className="font-mono text-xs text-mute lg:col-span-1 lg:pt-2">{p.n}</span>
            <h3 className="font-serif text-2xl leading-tight tracking-tight sm:text-3xl lg:col-span-5">{p.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink2 lg:col-span-6">{p.body}</p>
          </li>
        ))}
      </ol>
      <p className="mt-10 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
        <span className="label mr-3 align-middle">So</span>
        {coreNeed}
      </p>
    </Section>
  );
}
