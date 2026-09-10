import { stack } from "@/lib/content";
import { Section } from "./Section";

const path = [
  ["Brand voice", "MongoDB"],
  ["Trend", "Google Trends, Perplexity"],
  ["Ideas", "o1-mini"],
  ["Captions", "o1-mini"],
  ["Images", "FLUX 1.1 Pro"],
  ["Click", "Segmenter on a GPU"],
  ["Edit", "Stability inpainting"],
];

export function UnderTheHood() {
  return (
    <Section
      id="stack"
      n="09"
      label="Under the hood"
      title="What ran. Taken from the code, not the deck."
      lede="Two people built and operated it. There was never one model; each job went to the model that was good at it, and a saved brand voice object was passed into every prompt to hold the whole thing together."
    >
      <dl className="border-t rule">
        {stack.map((s) => (
          <div key={s.layer} className="grid gap-2 border-b rule py-5 sm:grid-cols-12 sm:gap-8">
            <dt className="text-[15px] font-medium sm:col-span-3">{s.layer}</dt>
            <dd className="sm:col-span-9">
              <ul className="space-y-1 text-[15px] leading-relaxed text-ink2">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <p className="label">The path of one post</p>
        <ol className="scroll-x mt-4 flex border-t border-b rule">
          {path.map(([n, m], i) => (
            <li key={n} className="flex min-w-[140px] flex-1 items-start gap-3 py-4 lg:min-w-0">
              <span className="font-mono text-xs text-mute">{i + 1}</span>
              <span>
                <span className="block text-[15px]">{n}</span>
                <span className="block text-[12px] text-mute">{m}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
