import { buyers } from "@/lib/content";
import { Section } from "./Section";

export function Buyers() {
  return (
    <Section
      id="buyers"
      n="07"
      label="Who it was for"
      title="Three sizes of company, three different reasons to want it."
      lede="Before we wrote much code we sat down with marketing people and founders and asked what they actually needed. These are their words, from those conversations in 2024."
    >
      <ol className="grid gap-px bg-rule sm:grid-cols-3">
        {buyers.map((b) => (
          <li key={b.who} className="flex flex-col bg-paper p-6 lg:p-8">
            <h3 className="label">{b.who}</h3>
            <p className="mt-4 font-serif text-xl leading-snug tracking-tight sm:text-2xl">{b.need}</p>
            <blockquote className="mt-auto pt-8">
              <p className="text-[15px] leading-relaxed text-ink2">&ldquo;{b.quote}&rdquo;</p>
              <footer className="mt-3 text-[13px] text-mute">
                {b.by}, {b.role}
              </footer>
            </blockquote>
          </li>
        ))}
      </ol>
    </Section>
  );
}
