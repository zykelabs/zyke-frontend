import { pillars } from "@/lib/content";
import { Section } from "./Section";

export function Pillars() {
  return (
    <Section id="pillars" n="02" label="The promise" title="Three things the first landing page said. All three shipped.">
      <ol className="divide-y divide-rule border-y rule">
        {pillars.map((p) => (
          <li key={p.n} className="grid gap-4 py-8 lg:grid-cols-12">
            <span className="font-serif text-2xl text-mute lg:col-span-1">{p.n}</span>
            <h3 className="font-serif text-2xl leading-tight tracking-tight sm:text-3xl lg:col-span-5">{p.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink2 lg:col-span-6">{p.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
