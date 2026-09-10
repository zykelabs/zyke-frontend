import { stack } from "@/lib/content";
import { Section } from "./Section";

export function UnderTheHood() {
  return (
    <Section id="stack" eyebrow="Under the hood" title="What actually ran. Taken from the code, not the pitch deck.">
      <p className="max-w-2xl text-ink-300">
        Two people built and ran this. The trick was never one model; it was routing each job to the model that was good
        at it and holding the whole thing together with a brand voice object that every prompt received.
      </p>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stack.map((s) => (
          <div key={s.layer} className="rounded-2xl border hairline bg-ink-900/50 p-5">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ember-400">{s.layer}</h3>
            <ul className="mt-4 space-y-2.5">
              {s.items.map((it) => (
                <li key={it} className="text-sm leading-relaxed text-ink-200">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <PipelineDiagram />
    </Section>
  );
}

// The request path for one post, drawn as boxes and arrows.
function PipelineDiagram() {
  const nodes = [
    ["brand voice", "Mongo"],
    ["trend", "Google Trends + Perplexity"],
    ["ideas", "o1-mini"],
    ["captions", "o1-mini"],
    ["images", "FLUX 1.1 Pro"],
    ["click", "segmenter on GPU"],
    ["edit", "Stability inpaint"],
  ];
  return (
    <div className="scroll-x mt-10 rounded-2xl border hairline bg-ink-950 p-5">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ink-400">the path of one post</p>
      <ol className="flex min-w-[860px] items-stretch gap-2">
        {nodes.map(([n, m], i) => (
          <li key={n} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-lg border hairline bg-ink-900 px-3 py-2.5">
              <p className="text-sm font-medium text-white">{n}</p>
              <p className="mt-0.5 font-mono text-[10px] text-ink-400">{m}</p>
            </div>
            {i < nodes.length - 1 && <span className="font-mono text-ink-600">→</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
