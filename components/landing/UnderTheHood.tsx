import { stack, era2024, recommender, pipeline, editing, novelties } from "@/lib/content";
import { Block } from "./Block";

const path = [
  ["Trend", "Google Trends"],
  ["Why", "Perplexity"],
  ["Rank", "o1-mini, per brand"],
  ["Ideas", "o1-mini"],
  ["Captions", "o1-mini"],
  ["Images", "FLUX 1.1 Pro"],
  ["Route", "o1-mini tool calls"],
  ["Segment", "GraCo on a GPU"],
  ["Edit", "Infill, image to image, LoRA"],
];

// A numbered list of steps, used three times below.
function Steps({ label, items }: { label: string; items: { n: string; title: string; body: string }[] }) {
  return (
    <div>
      <p className="label">{label}</p>
      <ol className="mt-6 divide-y divide-rule border-t rule">
        {items.map((s) => (
          <li key={s.n} className="grid gap-3 py-7 lg:grid-cols-12 lg:gap-12">
            <span className="font-mono text-xs text-mute lg:col-span-1 lg:pt-1.5">{s.n}</span>
            <h3 className="font-serif text-xl leading-snug tracking-tight sm:text-2xl lg:col-span-4">{s.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink2 lg:col-span-7">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function UnderTheHood() {
  return (
    <Block
      label="Under the hood"
      title="Most of this had to be built because it did not exist yet."
      lede="Three of us built it. Each job went to the model that was good at it, with a saved brand voice holding it together."
    >
      {/* The constraint that shaped everything else. */}
      <div className="border-b rule pb-10">
        <p className="label">Remember what 2024 was like</p>
        <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
          Every picture here was generated in the second half of 2024, which in image models is a long time ago.
        </p>
        <ul className="mt-8 grid gap-x-12 border-t rule sm:grid-cols-2">
          {era2024.map((e, i) => (
            <li key={i} className="grid grid-cols-[24px_1fr] gap-3 border-b rule last:border-b-0 py-4">
              <span aria-hidden className="pt-1 font-mono text-xs text-mute">
                &minus;
              </span>
              <span className="text-[15px] leading-relaxed text-ink2">{e}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink2">
          So most of the product was scaffolding around models that were not good enough yet.
        </p>
      </div>

      <div className="mt-20">
        <h3 className="display max-w-3xl text-3xl sm:text-4xl">
          The trend engine, and why it ranked the same list differently for two brands.
        </h3>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink2">
          Generating a post is the easy half. Deciding what is worth posting about today, for this brand, is the half that made it a product.
        </p>
        <div className="mt-10">
          <Steps label="The recommendation engine" items={recommender} />
        </div>
      </div>

      <div className="mt-20">
        <Steps label="From an idea to the images" items={pipeline} />
      </div>

      <div className="mt-20">
        <h3 className="display max-w-3xl text-3xl sm:text-4xl">
          The editing pipeline: four different workflows, and a model choosing between them.
        </h3>
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink2">
          Nothing like this existed yet, so we built it out of a router and four pipelines. Most of it ran as a GPU service that is not preserved in the repos, so this comes from the calls the app made into it.
        </p>
        <div className="mt-10">
          <Steps label="Point, name, or describe" items={editing} />
        </div>
      </div>

      {/* What was genuinely ours. */}
      <div className="mt-20">
        <p className="label">What was actually new about it</p>
        <ol className="mt-6 grid gap-x-12 border-t rule sm:grid-cols-2">
          {novelties.map((n, i) => (
            <li key={i} className="grid grid-cols-[28px_1fr] gap-3 border-b rule last:border-b-0 py-4">
              <span aria-hidden className="pt-1 font-mono text-xs text-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] leading-relaxed">{n}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-mute">
          A checkbox feature now. In November 2024 it took a router, two vision models, a set of LoRAs and a rented GPU.
        </p>
      </div>

      {/* The full stack. */}
      <div className="mt-20">
        <p className="label">Everything that ran</p>
        <dl className="mt-6 border-t rule">
          {stack.map((s) => (
            <div key={s.layer} className="grid gap-2 border-b rule last:border-b-0 py-5 sm:grid-cols-12 sm:gap-8">
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
        <ol className="scroll-x mt-4 flex border-t rule">
          {path.map(([n, m], i) => (
            <li key={n} className="flex min-w-[150px] flex-1 items-start gap-3 py-4 xl:min-w-0">
              <span className="font-mono text-xs text-mute">{i + 1}</span>
              <span>
                <span className="block text-[15px]">{n}</span>
                <span className="block text-[12px] leading-snug text-mute">{m}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </Block>
  );
}
