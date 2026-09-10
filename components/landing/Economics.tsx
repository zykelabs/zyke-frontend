import { economics, market, marketerUse } from "@/lib/content";
import { Section } from "./Section";

export function Economics() {
  return (
    <Section
      id="numbers"
      n="08"
      label="The numbers"
      title="Four cents of margin, and a market we never got to."
      lede="Zyke was pay as you go. Five dollars of credits on sign-up, then twenty cents a post. We knew our costs to the cent because every generation was a metered API call."
    >
      <dl className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {economics.map((e) => (
          <div key={e.label} className="bg-paper p-6">
            <dd className="display text-4xl sm:text-5xl">{e.figure}</dd>
            <dt className="mt-4 text-[15px] font-medium">{e.label}</dt>
            <dd className="mt-1 text-[13px] leading-relaxed text-mute">{e.note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label">The market, as we sized it in December 2024</p>
          <dl className="mt-4 border-t rule">
            {market.map((m) => (
              <div key={m.label} className="flex items-baseline gap-6 border-b rule py-4">
                <dd className="w-[5.5rem] shrink-0 whitespace-nowrap font-serif text-2xl tracking-tight sm:w-28 sm:text-3xl">
                  {m.figure}
                </dd>
                <dt className="text-[15px] leading-snug text-ink2">{m.label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5">
          <p className="label">What marketers were already using AI for</p>
          <dl className="mt-4 border-t rule">
            {marketerUse.map((m) => (
              <div key={m.what} className="flex items-baseline gap-6 border-b rule py-4">
                <dd className="w-14 shrink-0 font-serif text-2xl tracking-tight">{m.pct}</dd>
                <dt className="text-[15px] leading-snug text-ink2">{m.what}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] leading-relaxed text-mute">
            All three were things Zyke did in one pass, which is the argument the whole deck rested on.
          </p>
        </div>
      </div>
    </Section>
  );
}
