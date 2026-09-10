import { features, featureGroups } from "@/lib/content";
import { Section } from "./Section";

export function Features() {
  return (
    <Section id="features" eyebrow="Everything it did" title="Thirteen features, grouped the way a marketing team thinks.">
      <p className="max-w-2xl text-ink-300">
        The feature list from the product demo, in full. Some of these were in every user&rsquo;s hands; a couple were in
        the last builds before the company wound down.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-4">
        {featureGroups.map((g) => (
          <div key={g}>
            <h3 className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
              <span className="h-px flex-1 bg-white/10" />
              {g}
              <span className="h-px flex-1 bg-white/10" />
            </h3>
            <ul className="space-y-5">
              {features
                .filter((f) => f.group === g)
                .map((f) => (
                  <li key={f.title}>
                    <p className="font-medium text-white">{f.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-400">{f.body}</p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
