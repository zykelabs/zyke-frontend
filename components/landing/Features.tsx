import { features } from "@/lib/content";
import { Section } from "./Section";

export function Features() {
  return (
    <Section
      id="features"
      n="04"
      label="Features"
      title="Thirteen things it did."
      lede="The feature list from the product demo, in full. Most were in every user's hands; a few were in the last builds before the company wound down."
    >
      <ol className="grid border-t rule sm:grid-cols-2 sm:gap-x-12">
        {features.map((f) => (
          <li key={f.n} className="grid grid-cols-[32px_1fr] gap-4 border-b rule py-5">
            <span className="font-mono text-xs text-mute pt-1">{f.n}</span>
            <div>
              <h3 className="text-[15px] font-medium">{f.title}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-ink2">{f.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
