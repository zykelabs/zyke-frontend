"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { chapters, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

export function DemoVideo() {
  const [start, setStart] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);

  const src =
    start === null
      ? `https://www.youtube-nocookie.com/embed/${site.youtubeId}?rel=0&modestbranding=1`
      : `https://www.youtube-nocookie.com/embed/${site.youtubeId}?rel=0&modestbranding=1&autoplay=1&start=${start}`;

  return (
    <Section id="demo" eyebrow="The product demo" title="Four minutes, from a blank brand to edited posts.">
      <p className="max-w-2xl text-ink-300">
        Recorded in November 2024 on the version 1.0 build. The example brand is Zomato, the Indian food-delivery company
        with famously cheeky marketing. Jump to a chapter, or just press play.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-2xl border hairline bg-ink-900 shadow-card">
          <iframe
            key={src}
            src={src}
            title="Zyke product demo"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>

        <ol className="flex flex-col divide-y divide-white/[.06] rounded-2xl border hairline bg-ink-900/60">
          {chapters.map((c, i) => (
            <li key={c.t}>
              <button
                onClick={() => {
                  setStart(c.t);
                  setActive(i);
                }}
                className={cn(
                  "group flex w-full items-start gap-4 px-4 py-3 text-left transition-colors hover:bg-white/[.04]",
                  active === i && "bg-white/[.06]",
                )}
              >
                <span className="mt-0.5 font-mono text-xs tabular-nums text-ember-400">{c.label}</span>
                <span className="flex-1 text-sm text-ink-200 group-hover:text-white">{c.title}</span>
                <Play className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-500 group-hover:text-white" aria-hidden />
              </button>
            </li>
          ))}
          <li className="px-4 py-3">
            <a
              href={site.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-ink-400 hover:text-white"
            >
              Open on YouTube <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </li>
        </ol>
      </div>
    </Section>
  );
}
