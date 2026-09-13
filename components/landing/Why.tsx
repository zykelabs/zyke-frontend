import { ambition, failure, failureClose } from "@/lib/content";
import { Block } from "./Block";

export function Why() {
  return (
    <Block
      label="Why"
      title="Why we started it, and why it stopped."
      lede="The interesting part of a company that did not work is usually not the technology."
    >
      <div>
        <p className="label">What we were actually trying to build</p>
        <ol className="mt-6 divide-y divide-rule border-t rule">
          {ambition.map((a) => (
            <li key={a.n} className="grid gap-3 py-7 lg:grid-cols-12 lg:gap-12">
              <span className="font-mono text-xs text-mute lg:col-span-1 lg:pt-1.5">{a.n}</span>
              <h3 className="font-serif text-xl leading-snug tracking-tight sm:text-2xl lg:col-span-4">{a.title}</h3>
              <p className="text-[15px] leading-relaxed text-ink2 lg:col-span-7">{a.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-16">
        <p className="label">Why it did not work</p>
        <p className="mt-4 max-w-3xl font-serif text-3xl leading-snug tracking-tight sm:text-4xl">
          We built the thing and never did the other half.
        </p>
        <ol className="mt-10 border-t rule">
          {failure.map((f, i) => (
            <li key={i} className="grid grid-cols-[32px_1fr] gap-4 border-b rule last:border-b-0 py-5">
              <span aria-hidden className="pt-0.5 font-mono text-xs text-mute">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[15px] leading-relaxed">{f}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink2">{failureClose}</p>
      </div>
    </Block>
  );
}
