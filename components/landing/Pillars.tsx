import { pillars, comparison } from "@/lib/content";
import { Section } from "./Section";

export function Pillars() {
  return (
    <Section
      id="pillars"
      n="03"
      label="The promise"
      title="Three things the first landing page said. All three shipped."
    >
      <ol className="divide-y divide-rule border-y rule">
        {pillars.map((p) => (
          <li key={p.n} className="grid gap-4 py-8 lg:grid-cols-12">
            <span className="font-serif text-2xl text-mute lg:col-span-1">{p.n}</span>
            <h3 className="font-serif text-2xl leading-tight tracking-tight sm:text-3xl lg:col-span-5">{p.title}</h3>
            <p className="text-[15px] leading-relaxed text-ink2 lg:col-span-6">{p.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16">
        <p className="label">How we compared ourselves, December 2024</p>
        <div className="scroll-x mt-4">
          <table className="w-full min-w-[560px] border-collapse text-[15px]">
            <thead>
              <tr className="border-b rule">
                <th className="w-1/3 py-3 text-left font-normal text-mute">Feature</th>
                {comparison.columns.map((c, i) => (
                  <th
                    key={c}
                    className={`py-3 text-left font-normal ${i === 0 ? "font-serif text-lg tracking-tight" : "text-mute"}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.feature} className="border-b rule">
                  <th scope="row" className="py-3 pr-6 text-left font-normal">
                    {r.feature}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className={v ? "py-3 text-ink" : "py-3 text-rule"}>
                      <span className="sr-only">{v ? "Yes" : "No"}</span>
                      <span aria-hidden className="font-mono">
                        {v ? "●" : "—"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-2xl text-[13px] leading-relaxed text-mute">
          The three tools we benchmarked against are unnamed here. Two of them are still trading and this comparison is
          two years old, so treat it as a record of what we believed at the time rather than a claim about them today.
        </p>
      </div>
    </Section>
  );
}
