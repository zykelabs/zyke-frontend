import { pillars, comparison } from "@/lib/content";
import { Block } from "./Block";

export function Pillars() {
  return (
    <Block
      label="The promise"
      title="Three things the first landing page said. All three shipped."
    >
      <ol className="grid gap-px border-t rule bg-rule sm:grid-cols-3">
        {pillars.map((p) => (
          <li key={p.n} className="bg-paper px-5 py-8 first:pl-0">
            <span className="label">{p.n}</span>
            <p className="mt-3 font-serif text-xl leading-snug tracking-tight sm:text-2xl">{p.title}</p>
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
                <tr key={r.feature} className="border-b rule last:border-b-0">
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
          The three rivals are unnamed. This is two years old, so read it as what we believed then.
        </p>
      </div>
    </Block>
  );
}
