import { features } from "@/lib/content";
import { Block } from "./Block";

export function Features() {
  return (
    <Block
      label="Features"
      title="Thirteen things it did."
      lede="From the product demo. Most shipped to every user; a few landed in the last builds."
    >
      <ol className="grid border-t rule sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-3">
        {features.map((f) => (
          <li key={f.n} className="grid grid-cols-[2rem_1fr] gap-3 border-b rule last:border-b-0 py-3">
            <span className="font-mono text-xs text-mute">{f.n}</span>
            <span className="text-[15px] leading-snug">{f.title}</span>
          </li>
        ))}
      </ol>

    </Block>
  );
}
