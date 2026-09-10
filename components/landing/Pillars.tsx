import { pillars } from "@/lib/content";
import { Section } from "./Section";

export function Pillars() {
  return (
    <Section id="pillars" eyebrow="What we promised" title="Three things the original landing page said. All three shipped.">
      <div className="grid gap-px overflow-hidden rounded-2xl border hairline bg-white/[.06] md:grid-cols-3">
        {pillars.map((p) => (
          <article key={p.kicker} className="bg-ink-950 p-7 sm:p-8">
            <p className="font-mono text-xs text-ember-400">{p.kicker}</p>
            <h3 className="mt-4 text-xl font-semibold leading-snug tracking-tight">{p.title}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-300">{p.body}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
