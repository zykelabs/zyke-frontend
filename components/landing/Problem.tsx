import { problems, coreNeed } from "@/lib/content";
import { Block } from "./Block";

export function Problem() {
  return (
    <Block
      label="The problem"
      title="We ran a marketing team once. It was miserable."
      lede="We ran PR for the Indian Case Challenge at IIT Kharagpur. We needed a lot of posts, fast, and everything available was either expensive or bad."
    >
      <ol className="grid gap-px border-t rule bg-rule sm:grid-cols-3">
        {problems.map((p) => (
          <li key={p.n} className="bg-paper px-5 py-8 first:pl-0">
            <span className="label">{p.n}</span>
            <p className="mt-3 font-serif text-xl leading-snug tracking-tight sm:text-2xl">{p.title}</p>
          </li>
        ))}
      </ol>

      <p className="mt-10 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
        <span className="label mr-3 align-middle">So</span>
        {coreNeed}
      </p>
    </Block>
  );
}
