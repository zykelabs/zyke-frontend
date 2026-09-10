import { timeline, team, grants, site } from "@/lib/content";
import { Section } from "./Section";

export function Story() {
  return (
    <Section
      id="story"
      n="10"
      label="The story"
      title="Two people, five months, one Flask route to version 1.0."
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="space-y-5 text-[15px] leading-relaxed text-ink2 lg:col-span-5">
          <p>
            It started at IIT Kharagpur, in the campus Business Club. Two of us ended up running PR and marketing for
            the Indian Case Challenge, one of the larger business case competitions in Asia. Somewhere in the middle of
            that, doing design work at two in the morning, the idea for Zyke stopped being a joke. Rupam joined in
            October 2024 and wrote most of the product you can see in the demo.
          </p>
          <p>
            It started in July 2024 as a single page and a single API route: type a brief, answer two clarifying
            questions, get posts and images back. It was rough. People used it anyway.
          </p>
          <p>
            By October we had learned what mattered. The brand voice had to be a real, saved object rather than a text
            box. Trends had to be live. Images had to be fixable without regenerating everything. So we rewrote it: a
            proper web app, an API with a database, accounts, and a segmentation model on a GPU so you could click the
            part of the picture you wanted changed.
          </p>
          <p>
            Version 1.0 shipped on 5 November 2024 and the demo above was recorded on it. Bira 91 and a handful of
            other companies tested it. It did not go further than that, for reasons worth being straight about, which
            are{" "}<a href="#why" className="link">in the next section</a>.
          </p>
          <p className="text-mute">
            The source is on{" "}
            <a href={site.github} target="_blank" rel="noreferrer" className="link">
              GitHub
            </a>
            , with the earlier versions kept as branches.
          </p>
        </div>
        <dl className="border-t rule lg:col-span-7">
          {timeline.map((t) => (
            <div key={t.when} className="grid gap-2 border-b rule py-5 sm:grid-cols-12 sm:gap-8">
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
              <div key={m.name} className="border-b rule py-4">
                <dt className="font-serif text-2xl tracking-tight">
                  {m.linkedin ? (
                    <a href={m.linkedin} target="_blank" rel="noreferrer" className="link">
                      {m.name}
                    </a>
                  ) : (
                    m.name
                  )}
                </dt>
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
          <dl className="mt-4 border-t rule">
            {grants.map((g) => (
              <div key={g.org} className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b rule py-4">
                <div>
                  <dt className="text-[15px] font-medium">{g.org}</dt>
                  <dd className="mt-0.5 text-[13px] text-mute">{g.what}</dd>
                </div>
                <dd className="font-serif text-2xl tracking-tight tabular-nums">{g.amount}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[13px] leading-relaxed text-mute">
            Fifty-four and a half thousand dollars of credits and no cash. Every model call behind every picture on
            this page was paid for out of that.
          </p>
        </div>
      </div>
    </Section>
  );
}
