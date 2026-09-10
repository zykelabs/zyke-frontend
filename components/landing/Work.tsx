"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { months, progression, sameIdeaTwice, leaps, type Piece } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

// Flat list in reading order so the lightbox can walk the whole archive.
const flat: { piece: Piece; month: string }[] = months.flatMap((m) =>
  m.pieces.map((piece) => ({ piece, month: m.month })),
);
const indexOf = (src: string) => flat.findIndex((f) => f.piece.src === src);

// How many of each month show before you ask for the rest.
const PREVIEW = 6;

export function Work() {
  const [open, setOpen] = useState<number | null>(null);
  const [shown, setShown] = useState<Record<string, boolean>>({});

  const reveal = (id: string) => {
    setShown((s) => ({ ...s, [id]: true }));
    requestAnimationFrame(() => {
      document.getElementById(`m-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

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
              Three months of it, in order. The jump from September to November is the point of this section: the
              ideas were there from the start, and what changed was whether the model could actually execute them.{" "}
              <a href="#stack" className="link">
                What that took to build.
              </a>
            </p>
          </>
        }
      >
        {/* The connections it made by itself, which are the actual product. */}
        <div className="border-t rule pt-10">
          <p className="label">The leaps it made on its own</p>
          <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
            A headline is not a post. Getting from one to the other is the whole job, and this is the part nobody
            wrote down for it.
          </p>
          <ol className="mt-8 divide-y divide-rule border-y rule">
            {leaps.map((l) => (
              <li key={l.trend} className="grid gap-6 py-8 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                  <p className="label">{l.brand}</p>
                  <h4 className="mt-2 font-serif text-xl leading-snug tracking-tight sm:text-[1.35rem]">{l.trend}</h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink2">{l.leap}</p>
                </div>
                {/* What it produced, beside the reasoning. */}
                <ol className="grid grid-cols-3 gap-3 self-start lg:col-span-7">
                  {l.shots.map((sh) => (
                    <li key={sh.src}>
                      <button
                        onClick={() => setOpen(indexOf(sh.src))}
                        className="group block w-full text-left"
                        aria-label={`Open the ${sh.when} example`}
                      >
                        <span className="plate block aspect-square overflow-hidden">
                          <Image
                            src={sh.src}
                            alt={`${l.brand}, ${l.trend}`}
                            width={sh.w}
                            height={sh.h}
                            sizes="(max-width: 640px) 30vw, 15vw"
                            className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                          />
                        </span>
                        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-mute">
                          {sh.when}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>

        {/* Three cards, three months, each a door into that month's gallery. */}
        <div className="mt-20" />
        <div className="border-y rule py-10">
          <p className="label">It got better fast</p>
          <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
            The same pipeline, three months apart.
          </p>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {progression.map((e) => (
              <li key={e.id} className="flex flex-col">
                <button onClick={() => reveal(e.id)} className="group block text-left">
                  <span className="plate block aspect-square overflow-hidden">
                    <Image
                      src={e.src}
                      alt={`Output from ${e.when}`}
                      width={e.w}
                      height={e.h}
                      sizes="(max-width: 640px) 100vw, 30vw"
                      className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                    />
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-3">
                    <span className="text-[15px] font-medium">{e.when}</span>
                    <span className="font-mono text-[11px] text-mute">{e.size}</span>
                  </span>
                </button>
                <p className="mt-2 text-[13px] leading-relaxed text-ink2">{e.what}</p>
                <button
                  onClick={() => reveal(e.id)}
                  className="link mt-3 w-fit text-[13px] text-ink2 hover:text-ink"
                >
                  View more from {e.when.split(" ")[0]} &rarr;
                </button>
              </li>
            ))}
          </ol>
        </div>

        {/* One block per month. */}
        <div className="mt-24 space-y-24">
          {months.map((m) => {
            const all = shown[m.id] || m.pieces.length <= PREVIEW + 2;
            const visible = all ? m.pieces : m.pieces.slice(0, PREVIEW);
            const hidden = m.pieces.length - visible.length;
            return (
              <div key={m.id} id={`m-${m.id}`} className="scroll-mt-24">
                <div className="grid gap-6 border-t-2 border-ink pt-5 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-4">
                    <p className="label">
                      {m.month} <span className="mx-1 text-rule">/</span> {m.res}
                    </p>
                    <h3 className="display mt-3 text-3xl sm:text-4xl">{m.headline}</h3>
                  </div>
                  <p className="text-[15px] leading-relaxed text-ink2 lg:col-span-7 lg:pt-1">{m.note}</p>
                </div>

                <ol className="mt-12 grid grid-cols-2 items-start gap-x-4 gap-y-10 sm:gap-x-8 lg:grid-cols-3">
                  {visible.map((p) => (
                    <li key={p.src}>
                      <p className="label">
                        {p.brand} <span className="mx-1 text-rule">/</span> {p.trend}
                      </p>
                      <button
                        onClick={() => setOpen(indexOf(p.src))}
                        className="group mt-3 block w-full text-left"
                        aria-label={`Open: ${p.caption}`}
                      >
                        <span className="plate block aspect-square overflow-hidden">
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

                {hidden > 0 && (
                  <button
                    onClick={() => reveal(m.id)}
                    className="mt-10 border-b border-ink pb-1 font-serif text-xl tracking-tight hover:text-ink2"
                  >
                    View {hidden} more from {m.month.split(" ")[0]} &rarr;
                  </button>
                )}

                {/* November earns the extra exhibit. */}
                {m.id === "nov" && <SameIdeaTwice />}
              </div>
            );
          })}
        </div>

        <p className="mt-20 max-w-2xl border-t rule pt-5 text-[13px] leading-relaxed text-mute">
          Everything here is machine generated and was made in 2024 to test a product. Zomato, Bira 91 and Nike appear
          as example brands. None of these companies was involved, none endorsed any of it, and none of it was ever
          published on their behalf. Several pictures are Zyke&rsquo;s own attempt at a public figure, which it reached
          for without being asked. They are here because they are a true record of what the thing did.
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

// Two runs of one idea, minutes apart, as the clearest evidence of the jump.
function SameIdeaTwice() {
  const { first, second } = sameIdeaTwice;
  return (
    <div className="mt-20 border-t rule pt-10">
      <p className="label">The same idea, twice, minutes apart</p>
      <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
        By November you could ask for a thing twice and get the same campaign back.
      </p>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {[
          { p: first, label: "First run", note: "Left panel clean. Right panel still inventing words: “Even our mences Your bang tallen”." },
          { p: second, label: "Second run", note: "Same layout, same palette, same joke. Both headlines correct and both boxes correctly branded." },
        ].map((x) => (
          <figure key={x.label}>
            <div className="plate overflow-hidden" style={{ aspectRatio: `${x.p.w} / ${x.p.h}` }}>
              <Image
                src={x.p.src}
                alt={x.label}
                width={x.p.w}
                height={x.p.h}
                sizes="(max-width: 640px) 100vw, 46vw"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3">
              <span className="label">{x.label}</span>
              <span className="mt-1 block text-[13px] leading-relaxed text-ink2">{x.note}</span>
            </figcaption>
          </figure>
        ))}
      </div>
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
  entry: { piece: Piece; month: string };
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { piece, month } = entry;
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
          className="max-h-[64vh] w-auto max-w-full object-contain"
        />
        <figcaption className="mt-5 w-full max-w-2xl text-paper">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">
            {piece.brand} &middot; {month} &middot; {piece.w} &times; {piece.h}
          </p>
          <p className="mt-2 font-serif text-xl leading-snug tracking-tight sm:text-2xl">{piece.trend}</p>
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
