"use client";

import { useState } from "react";
import Image from "next/image";
import { chapters, gallery, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

export function DemoVideo() {
  const [start, setStart] = useState<number | null>(null);
  const base = `https://www.youtube-nocookie.com/embed/${site.youtubeId}?rel=0&modestbranding=1`;
  const src = start === null ? base : `${base}&autoplay=1&start=${start}`;

  return (
    <Section
      id="demo"
      n="01"
      label="The demo"
      title={
        <>
          Four minutes, from a blank brand to <em>edited</em> posts.
        </>
      }
      lede="Recorded in November 2024 on the version 1.0 build. The example brand is Zomato. Pick a chapter or press play."
    >
      <div className="plate aspect-video w-full border rule">
        <iframe
          key={src}
          src={src}
          title="Zyke product demo"
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <ol className="mt-8 grid gap-x-12 border-t rule sm:grid-cols-2">
        {chapters.map((c) => (
          <li key={c.t} className="border-b rule">
            <button
              onClick={() => setStart(c.t)}
              className={cn(
                "group flex w-full items-baseline gap-4 py-3 text-left",
                start === c.t ? "text-ink" : "text-ink2 hover:text-ink",
              )}
            >
              <span className="w-9 shrink-0 font-mono text-xs tabular-nums text-mute">{c.label}</span>
              <span className="text-[15px] leading-snug">{c.title}</span>
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-[13px] text-mute">
        Or{" "}
        <a href={site.youtubeUrl} target="_blank" rel="noreferrer" className="link">
          open it on YouTube
        </a>
        .
      </p>

      {/* Everything the demo run actually produced, in order. */}
      <div className="mt-16">
        <p className="label">The thirteen images that run produced</p>
        <ol className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3">
          {gallery.map((g) => (
            <li key={g.src} className="plate">
              <Image
                src={g.src}
                alt={g.caption}
                width={512}
                height={512}
                sizes="14vw"
                className="aspect-square w-full object-cover"
              />
            </li>
          ))}
        </ol>
        <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-mute">
          Three ideas, nine posts, thirteen images, one trend about a rocket landing. Generated in the four minutes you
          just watched.
        </p>
      </div>
    </Section>
  );
}
