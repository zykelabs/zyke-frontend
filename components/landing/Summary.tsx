import Image from "next/image";
import { summaryStats, summarySteps, summaryWork, summaryTech } from "@/lib/content";

// The whole thing on one screen, for anyone not reading eleven sections.
export function Summary() {
  return (
    <section id="short" className="scroll-mt-14 border-t rule">
      <div className="mx-auto max-w-page px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="label">The short version</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="display max-w-3xl text-4xl sm:text-5xl">One brand in. Finished posts out.</h2>

            {/* Four numbers. */}
            <dl className="mt-12 grid grid-cols-2 gap-px border-t rule bg-rule sm:grid-cols-4">
              {summaryStats.map((s) => (
                <div key={s.label} className="bg-paper px-5 py-6 first:pl-0">
                  <dd className="display text-4xl sm:text-5xl">{s.figure}</dd>
                  <dt className="mt-2 text-[13px] text-mute">{s.label}</dt>
                </div>
              ))}
            </dl>

            {/* How it worked, four lines. */}
            <ol className="mt-12 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {summarySteps.map((s) => (
                <li key={s.n} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="font-mono text-xs text-mute">{s.n}</span>
                  <span>
                    <span className="block text-[15px] font-medium">{s.label}</span>
                    <span className="mt-0.5 block text-[15px] leading-snug text-ink2">{s.line}</span>
                  </span>
                </li>
              ))}
            </ol>

            {/* What it made, with one line each. */}
            <p className="label mt-14">What it came up with, unprompted</p>
            <ol className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
              {summaryWork.map((w) => (
                <li key={w.src}>
                  <span className="plate block aspect-square overflow-hidden">
                    <Image
                      src={w.src}
                      alt={w.line}
                      width={w.w}
                      height={w.h}
                      sizes="(max-width: 640px) 50vw, 30vw"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="mt-2 block text-[13px] leading-snug text-mute">{w.line}</span>
                </li>
              ))}
            </ol>

            {/* What ran it. */}
            <p className="label mt-14">What ran it</p>
            <dl className="mt-4 border-t rule">
              {summaryTech.map((t) => (
                <div key={t.label} className="grid gap-1 border-b rule last:border-b-0 py-3.5 sm:grid-cols-12 sm:gap-6">
                  <dt className="text-[15px] font-medium sm:col-span-3">{t.label}</dt>
                  <dd className="text-[15px] leading-snug text-ink2 sm:col-span-9">{t.line}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 text-[15px] text-ink2">
              That is the whole of it.{" "}
              <a href="#demo" className="link">
                Watch the demo
              </a>
              , or{" "}
              <a href="#contents" className="link">
                open any section below
              </a>{" "}
              for the detail.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
