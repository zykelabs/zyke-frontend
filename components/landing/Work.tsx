"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { work, progression, type Piece } from "@/lib/content";
import { Section } from "./Section";

// Flatten once so the lightbox can walk the whole set in reading order.
const flat: { piece: Piece; brand: string; trend: string }[] = work.flatMap((b) =>
  b.groups.flatMap((g) => g.pieces.map((piece) => ({ piece, brand: b.brand, trend: g.trend }))),
);
const indexOf = (src: string) => flat.findIndex((f) => f.piece.src === src);

export function Work() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % flat.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + flat.length) % flat.length));
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
      <Section
        id="gallery"
        n="06"
        label="What it made"
        title={
          <>
            We did not write any of these. <em>It did.</em>
          </>
        }
        lede={
          <>
            <p>
              Real output from the testing months. Zyke read the day&rsquo;s trends, picked one, decided by itself how
              to bend it toward the brand, wrote the caption and generated the picture. At most we handed it a brand
              name and a website. In most cases we did not even do that much.
            </p>
            <p className="mt-4">
              Grouped below the way it worked: by brand, then by the trend it latched onto. The interesting part is
              rarely the picture. It is the jump from the news to the brand, which nobody wrote down for it.
            </p>
            <p className="mt-4">
              All of it was generated in the second half of 2024, before any model could spell reliably or hold a
              megapixel. The misspellings are the model&rsquo;s and are left exactly as they came out.{" "}
              <a href="#stack" className="link">
                What that took to build.
              </a>
            </p>
          </>
        }
      >
        <Era />

        <div className="mt-24 space-y-24">
          {work.map((b) => (
            <div key={b.brand}>
              <div className="border-t-2 border-ink pt-5">
                <h3 className="display text-3xl sm:text-4xl">{b.brand}</h3>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink2">{b.note}</p>
              </div>

              <div className="mt-12 space-y-16">
                {b.groups.map((g) => (
                  <section key={g.id} className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                    <header className="lg:col-span-4">
                      <p className="label">Trend &middot; {g.when}</p>
                      <h4 className="mt-3 font-serif text-2xl leading-snug tracking-tight sm:text-[1.75rem]">
                        {g.trend}
                      </h4>
                      <p className="mt-4 text-[15px] leading-relaxed text-ink2">{g.leap}</p>
                    </header>
                    <ol className="grid grid-cols-2 items-start gap-x-4 gap-y-8 sm:gap-x-6 lg:col-span-8">
                      {g.pieces.map((p) => (
                        <li key={p.src}>
                          <button
                            onClick={() => setOpen(indexOf(p.src))}
                            className="group block w-full text-left"
                            aria-label={`Open: ${p.caption}`}
                          >
                            {/* Every picture in a group shares an aspect ratio, so rows stay even
                                without cropping the wide ones. */}
                            <span
                              className="plate block overflow-hidden"
                              style={{ aspectRatio: `${p.w} / ${p.h}` }}
                            >
                              <Image
                                src={p.src}
                                alt={p.caption}
                                width={p.w}
                                height={p.h}
                                sizes="(max-width: 640px) 50vw, 30vw"
                                className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                              />
                            </span>
                            <span className="mt-2 flex items-baseline justify-between gap-3">
                              <span className="text-[13px] leading-relaxed text-mute">{p.caption}</span>
                              <span className="shrink-0 font-mono text-[10px] text-rule">{p.w}px</span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ol>
                  </section>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-20 max-w-2xl border-t rule pt-5 text-[13px] leading-relaxed text-mute">
          Everything here is machine generated and was made in 2024 to test a product. Zomato and Bira 91 appear as
          example brands. Neither company was involved, neither endorsed any of it, and none of it was ever published
          on their behalf. Two of the pictures are Zyke&rsquo;s own attempt at a public figure, which it reached for
          without being asked. They are here because they are a true record of what the thing did.
        </p>
      </Section>

      {open !== null && flat[open] && (
        <Lightbox
          entry={flat[open]}
          index={open}
          total={flat.length}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((open - 1 + flat.length) % flat.length)}
          onNext={() => setOpen((open + 1) % flat.length)}
        />
      )}
    </>
  );
}

// What three months of model progress looked like on the same pipeline.
function Era() {
  return (
    <div className="border-y rule py-10">
      <p className="label">It got better fast</p>
      <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
        The same pipeline, three months apart.
      </p>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink2">
        We did not keep dates against the files, but we can read them off the pixels. The resolution went up every
        time we rebuilt the image stage, so the size of a picture is a rough stamp for when it was made. Each one
        below carries its width.
      </p>
      <ol className="mt-10 grid gap-8 sm:grid-cols-3">
        {progression.map((e) => (
          <li key={e.when}>
            <span className="plate block aspect-square overflow-hidden">
              <Image
                src={e.src}
                alt={`Example output from ${e.when}`}
                width={e.w}
                height={e.h}
                sizes="(max-width: 640px) 100vw, 30vw"
                className="h-full w-full object-contain"
              />
            </span>
            <p className="mt-3 flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-medium">{e.when}</span>
              <span className="font-mono text-[11px] text-mute">{e.size}</span>
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-ink2">{e.what}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Lightbox({
  entry,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  entry: { piece: Piece; brand: string; trend: string };
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { piece, brand, trend } = entry;
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink/95 p-5 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-label={piece.caption}
    >
      <button className="absolute right-5 top-4 text-[13px] text-paper/70 hover:text-paper sm:right-8" onClick={onClose}>
        Close
      </button>
      <figure className="flex min-h-0 w-full max-w-4xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <Image
          src={piece.src}
          alt={piece.caption}
          width={piece.w}
          height={piece.h}
          className="max-h-[68vh] w-auto max-w-full object-contain"
        />
        <figcaption className="mt-5 w-full max-w-2xl text-paper">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">
            {brand} &middot; {piece.w} &times; {piece.h}
          </p>
          <p className="mt-2 font-serif text-xl leading-snug tracking-tight sm:text-2xl">{trend}</p>
          <p className="mt-2 text-[14px] leading-relaxed text-paper/70">{piece.caption}</p>
          <div className="mt-5 flex items-center justify-between border-t border-paper/20 pt-3 font-mono text-xs text-paper/60">
            <button onClick={onPrev} className="hover:text-paper">
              &larr; prev
            </button>
            <span className="tabular-nums">
              {index + 1} / {total}
            </span>
            <button onClick={onNext} className="hover:text-paper">
              next &rarr;
            </button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
