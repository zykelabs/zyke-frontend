"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { gallery } from "@/lib/content";
import { Section } from "./Section";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % gallery.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + gallery.length) % gallery.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Section id="gallery" eyebrow="The output" title="Thirteen images. Zero stock photos. All from one afternoon in the demo.">
        <p className="max-w-2xl text-ink-300">
          Three ideas about a rocket landing, rewritten for a food-delivery brand. The typos in the rendered text are the
          image model&rsquo;s, from late 2024. We left them in because that is what it made.
        </p>
      </Section>

      {/* Full-bleed marquee under the section heading */}
      <div className="relative -mt-12 overflow-hidden pb-24" aria-label="Gallery of generated posts">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
        <ul className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
          {[...gallery, ...gallery].map((g, i) => (
            <li key={`${g.src}-${i}`} className="w-[240px] shrink-0 sm:w-[280px]">
              <button
                onClick={() => setOpen(i % gallery.length)}
                className="group block w-full overflow-hidden rounded-2xl border hairline bg-ink-900 text-left transition-transform hover:-translate-y-1"
              >
                <Image src={g.src} alt={g.caption} width={512} height={512} className="aspect-square w-full object-cover" />
                <div className="px-3 py-2.5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-ember-400">{g.idea}</p>
                  <p className="mt-0.5 truncate text-sm text-ink-200 group-hover:text-white">{g.caption}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink-950/90 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal
          aria-label={gallery[open].caption}
        >
          <button
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            onClick={() => setOpen(null)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open - 1 + gallery.length) % gallery.length);
            }}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:grid"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((open + 1) % gallery.length);
            }}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <figure className="w-full max-w-[min(90vw,80vh)]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={gallery[open].src}
              alt={gallery[open].caption}
              width={1024}
              height={1024}
              className="aspect-square w-full rounded-2xl object-contain"
            />
            <figcaption className="mt-3 flex items-baseline justify-between gap-4 text-sm">
              <span className="text-white">{gallery[open].caption}</span>
              <span className="font-mono text-xs text-ink-400">
                {gallery[open].idea} · {open + 1}/{gallery.length}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
