import { timeline, team, grants, site } from "@/lib/content";
import { Block } from "./Block";

export function Story() {
  return (
    <Block
      label="The story"
      title="Three people, five months, one Flask route to version 1.0."
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="space-y-5 text-[15px] leading-relaxed text-ink2 lg:col-span-5">
          <p>
            It began in the campus Business Club at IIT Kharagpur, running PR for the Indian Case Challenge. Doing
            design work at two in the morning, the idea stopped being a joke.
          </p>
          <p>
            July 2024: one page, one API route. Rough, and people used it anyway. By October the brand voice had to be
            a saved object, trends had to be live, and images had to be fixable. So we rewrote all of it.
          </p>
          <p>
            Version 1.0 shipped on 5 November 2024. Bira 91 and a few others tested it. It went no further, for
            reasons{" "}
            <a href="#why" className="link">
              in the next section
            </a>
            .
          </p>
        </div>
        <dl className="border-t rule lg:col-span-7">
          {timeline.map((t) => (
            <div key={t.when} className="grid gap-2 border-b rule last:border-b-0 py-5 sm:grid-cols-12 sm:gap-8">
              <dt className="font-mono text-xs uppercase tracking-wider text-mute sm:col-span-3 sm:pt-1">{t.when}</dt>
              <dd className="text-[15px] leading-relaxed sm:col-span-9">{t.what}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label">Who built it</p>
          <dl className="mt-4 border-t rule">
            {team.map((m) => (
              <div key={m.name} className="border-b rule last:border-b-0 py-4">
                <dt className="font-serif text-2xl tracking-tight">
                  {m.linkedin ? (
                    <a href={m.linkedin} target="_blank" rel="noreferrer" className="link">
                      {m.name}
                    </a>
                  ) : (
                    m.name
                  )}
                </dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-mute">{m.role}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] leading-relaxed text-mute">
            Between us we had won gold at Inter IIT for product development and for an NLP problem statement, which is
            roughly how we convinced ourselves we could build this in the first place.
          </p>
        </div>
        <div className="lg:col-span-7">
          <p className="label">What paid for it</p>
          <p className="display mt-3 text-5xl sm:text-6xl">$50k+</p>
          <p className="mt-2 text-[13px] text-mute">in credits, across seven programmes. No cash.</p>
          <dl className="mt-8 border-t rule">
            {grants.map((g) => (
              <div key={g.org} className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b rule last:border-b-0 py-4">
                <div>
                  <dt className="text-[15px] font-medium">{g.org}</dt>
                  <dd className="mt-0.5 text-[13px] text-mute">{g.what}</dd>
                </div>
                <dd className="font-serif text-2xl tracking-tight tabular-nums">{g.amount}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] leading-relaxed text-mute">
            Every model call behind every picture on this page was paid for out of that.
          </p>
        </div>
      </div>
    </Block>
  );
}
