"use client";

import { sections } from "@/lib/content";
import { useSections } from "./sections-context";

// The contents list under the hero. Doubles as the page's main navigation,
// since every section below it is closed until you ask for it.
export function Contents() {
  const { reveal, openAll, closeAll, anyOpen } = useSections();
  return (
    <section id="contents" className="scroll-mt-14 border-t rule">
      <div className="mx-auto max-w-page px-6 py-14 lg:px-10 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="label">Contents</p>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-mute">
              Eleven sections, all closed. Open the ones you want.
            </p>
            <button
              onClick={anyOpen ? closeAll : openAll}
              className="link mt-4 w-fit text-[13px] text-ink2 hover:text-ink"
            >
              {anyOpen ? "Close everything" : "Open everything"}
            </button>
          </div>
          <ol className="border-t rule lg:col-span-9">
            {sections.map((s) => (
              <li key={s.id} className="border-b rule">
                <button
                  onClick={() => reveal(s.id)}
                  className="group grid w-full grid-cols-[2.25rem_1fr_auto] items-baseline gap-4 py-4 text-left"
                >
                  <span className="font-mono text-xs text-mute">{s.n}</span>
                  <span>
                    <span className="block font-serif text-xl leading-snug tracking-tight sm:text-2xl">
                      {s.label}
                    </span>
                    <span className="mt-0.5 block text-[13px] leading-relaxed text-mute">{s.blurb}</span>
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-xs text-rule transition-colors group-hover:text-ink"
                  >
                    open
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
