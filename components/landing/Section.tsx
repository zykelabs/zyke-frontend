"use client";

import { cn } from "@/lib/utils";
import { useSections } from "./sections-context";

// Editorial two-column section. The header is always a button; the body only
// renders when the section is open, so a closed page costs nothing to draw.
export function Section({
  id,
  n,
  label,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  n: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const { isOpen, toggle } = useSections();
  const open = isOpen(id);

  return (
    <section id={id} className={cn("scroll-mt-14 border-t rule", className)}>
      <div className="mx-auto max-w-page px-6 lg:px-10">
        <h2>
          <button
            type="button"
            onClick={() => toggle(id)}
            aria-expanded={open}
            aria-controls={`${id}-body`}
            className="group grid w-full gap-4 py-10 text-left lg:grid-cols-12 lg:py-14"
          >
            <span className="lg:col-span-3">
              <span className="label block">
                {n} <span className="mx-1.5 text-rule">/</span> {label}
              </span>
            </span>
            <span className="display block max-w-3xl text-4xl sm:text-5xl lg:col-span-8 lg:text-6xl">{title}</span>
            <span className="flex items-start lg:col-span-1 lg:justify-end">
              <span
                aria-hidden
                className="font-mono text-lg leading-none text-mute transition-colors group-hover:text-ink"
              >
                {open ? "−" : "+"}
              </span>
            </span>
          </button>
        </h2>

        {open && (
          <div id={`${id}-body`} className="grid gap-8 pb-16 lg:grid-cols-12 lg:pb-24">
            <div className="hidden lg:col-span-3 lg:block" />
            <div className="lg:col-span-9">
              {lede && <div className="max-w-2xl text-lg leading-relaxed text-ink2">{lede}</div>}
              <div className={lede ? "mt-12" : ""}>{children}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
