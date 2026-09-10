import { timeline, site } from "@/lib/content";
import { Section } from "./Section";

export function Story() {
  return (
    <Section id="story" eyebrow="The story" title="From one Flask route to version 1.0 in five months.">
      <div className="mt-4 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-5 text-[15px] leading-relaxed text-ink-300">
          <p>
            Zyke started in July 2024 as a single page and a single API route: type a brief, answer a couple of
            clarifying questions, get posts and images back. It was rough, and people used it anyway.
          </p>
          <p>
            By October we had learned what mattered. The brand voice had to be a real, saved object, not a text box.
            Trends had to be live. Images had to be fixable without regenerating everything. So we rewrote it: a proper
            web app, an API with a database, accounts, and a segmentation model on a GPU so you could just click the
            part of the picture you wanted changed.
          </p>
          <p>
            Version 1.0 shipped in November 2024, and this demo was recorded on it. The company did not continue past
            that, but the domain, the code and the work did. That is what this page is for.
          </p>
          <p className="text-ink-400">
            The source lives on{" "}
            <a href={site.github} target="_blank" rel="noreferrer" className="text-ink-200 underline-offset-4 hover:underline">
              GitHub
            </a>
            , with the older versions kept as branches.
          </p>
        </div>

        <ol className="relative border-l hairline pl-8">
          {timeline.map((t) => (
            <li key={t.when} className="relative pb-8 last:pb-0">
              <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-ink-950 bg-ember-500" />
              <p className="font-mono text-xs uppercase tracking-widest text-ember-400">{t.when}</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-200">{t.what}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
