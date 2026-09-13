"use client";

import { cn } from "@/lib/utils";
import { useSections } from "./sections-context";

// A collapsible group. The closed row reads as an index entry: number, short
// name, one line. Not a giant sentence.
export function Group({
  id,
  n,
  name,
  line,
  children,
}: {
  id: string;
  n: string;
  name: string;
  line: string;
  children: React.ReactNode;
}) {
  const { isOpen, toggle } = useSections();
  const open = isOpen(id);

  return (
    <section id={id} className="scroll-mt-14 border-t rule">
      <div className="mx-auto max-w-page px-6 lg:px-10">
        <h2>
          <button
            type="button"
            onClick={() => toggle(id)}
            aria-expanded={open}
            aria-controls={`${id}-body`}
            className="group grid w-full grid-cols-[2.5rem_1fr_1.5rem] items-baseline gap-x-4 gap-y-2 py-8 text-left lg:grid-cols-12 lg:gap-8"
          >
            <span className="label lg:col-span-1">{n}</span>
            <span className="display text-3xl sm:text-4xl lg:col-span-4">{name}</span>
            <span
              aria-hidden
              className="justify-self-end font-mono text-lg leading-none text-mute transition-colors group-hover:text-ink lg:order-last lg:col-span-1"
            >
              {open ? "−" : "+"}
            </span>
            <span className="col-span-2 col-start-2 text-[15px] leading-snug text-ink2 lg:col-span-6 lg:col-start-auto lg:pt-2">
              {line}
            </span>
          </button>
        </h2>

        {open && (
          <div id={`${id}-body`} className={cn("space-y-24 pb-16 lg:pb-24")}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
