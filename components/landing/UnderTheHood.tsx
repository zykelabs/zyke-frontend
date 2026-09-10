import { stack, era2024, pipeline, novelties } from "@/lib/content";
import { Section } from "./Section";

const path = [
  ["Brand voice", "MongoDB"],
  ["Trend", "Google Trends, Perplexity"],
  ["Ideas", "o1-mini"],
  ["Captions", "o1-mini"],
  ["Images", "FLUX 1.1 Pro"],
  ["Click", "Semantic segmentation on a GPU"],
  ["Edit", "Stability inpainting"],
];

export function UnderTheHood() {
  return (
    <Section
      id="stack"
      n="09"
      label="Under the hood"
      title="Most of this had to be built because it did not exist yet."
      lede="Three of us built and operated it. There was never one model; each job went to the model that was good at it, and a saved brand voice object was passed into every prompt to hold the whole thing together. What follows is taken from the code, not the deck."
    >
      {/* The constraint that shaped everything else. */}
      <div className="border-y-2 border-ink py-10">
        <p className="label">Remember what 2024 was like</p>
        <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
          Every picture on this page was generated in the second half of 2024, which in image models is a very long
          time ago.
        </p>
        <ul className="mt-8 grid gap-x-12 border-t rule sm:grid-cols-2">
          {era2024.map((e, i) => (
            <li key={i} className="grid grid-cols-[24px_1fr] gap-3 border-b rule py-4">
              <span aria-hidden className="pt-1 font-mono text-xs text-mute">
                &minus;
              </span>
              <span className="text-[15px] leading-relaxed text-ink2">{e}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink2">
          So a good part of the product was scaffolding around models that were not yet good enough. The pipeline
          below is what that scaffolding looked like.
        </p>
      </div>

      {/* The image pipeline, step by step. */}
      <div className="mt-20">
        <p className="label">The image pipeline, end to end</p>
        <ol className="mt-6 divide-y divide-rule border-y rule">
          {pipeline.map((s) => (
            <li key={s.n} className="grid gap-3 py-7 lg:grid-cols-12 lg:gap-12">
              <span className="font-mono text-xs text-mute lg:col-span-1 lg:pt-1.5">{s.n}</span>
              <h3 className="font-serif text-xl leading-snug tracking-tight sm:text-2xl lg:col-span-4">{s.title}</h3>
              <p className="text-[15px] leading-relaxed text-ink2 lg:col-span-7">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* What was genuinely ours. */}
      <div className="mt-20">
        <p className="label">What was actually new about it</p>
        <ol className="mt-6 grid gap-x-12 border-t rule sm:grid-cols-2">
          {novelties.map((n, i) => (
            <li key={i} className="grid grid-cols-[28px_1fr] gap-3 border-b rule py-4">
              <span aria-hidden className="pt-1 font-mono text-xs text-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] leading-relaxed">{n}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-mute">
          Point-and-describe image editing is a checkbox feature now. In November 2024 it took three services on two
          hosts, a GPU we rented, and a negative prompt written by trial and error.
        </p>
      </div>

      {/* The full stack. */}
      <div className="mt-20">
        <p className="label">Everything that ran</p>
        <dl className="mt-6 border-t rule">
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
      </div>

      <div className="mt-12">
        <p className="label">The path of one post</p>
        <ol className="scroll-x mt-4 flex border-t border-b rule">
          {path.map(([n, m], i) => (
            <li key={n} className="flex min-w-[150px] flex-1 items-start gap-3 py-4 lg:min-w-0">
              <span className="font-mono text-xs text-mute">{i + 1}</span>
              <span>
                <span className="block text-[15px]">{n}</span>
                <span className="block text-[12px] leading-snug text-mute">{m}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
