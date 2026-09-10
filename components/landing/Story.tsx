import { timeline, site } from "@/lib/content";
import { Section } from "./Section";

export function Story() {
  return (
    <Section id="story" n="07" label="The story" title="From one Flask route to version 1.0 in five months.">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="space-y-5 text-[15px] leading-relaxed text-ink2 lg:col-span-5">
          <p>
            Zyke started in July 2024 as a single page and a single API route: type a brief, answer two clarifying
            questions, get posts and images back. It was rough. People used it anyway.
          </p>
          <p>
            By October we had learned what mattered. The brand voice had to be a real, saved object rather than a text
            box. Trends had to be live. Images had to be fixable without regenerating everything. So we rewrote it: a
            proper web app, an API with a database, accounts, and a segmentation model on a GPU so you could click the
            part of the picture you wanted changed.
          </p>
          <p>
            Version 1.0 shipped in November 2024 and the demo above was recorded on it. The company did not continue
            past that. The domain, the code and the work did, which is what this page is for.
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
    </Section>
  );
}
