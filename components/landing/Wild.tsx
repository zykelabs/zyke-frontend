"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { wild, brandFilters, type Piece } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Section } from "./Section";

export function Wild() {
  const [brand, setBrand] = useState("All");
  const [open, setOpen] = useState<number | null>(null);

  const shown = useMemo(() => (brand === "All" ? wild : wild.filter((p) => p.brand === brand)), [brand]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, shown.length]);

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
              This is real output from the testing months. Zyke chose the trend, decided how to bend it toward the
              brand, wrote the caption and generated the picture. At most we handed it a brand and said go. In most
              cases we did not even do that.
            </p>
            <p className="mt-4">
              The prompts are lost, so the line above each picture is our reconstruction of the idea behind it, kept as
              short as the original would have been. Text inside the images is often misspelled. That is what image
              models did in 2024, and we have not touched it.
            </p>
          </>
        }
      >
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-y rule py-3">
          <span className="label">Brand</span>
          {brandFilters.map((b) => {
            const count = b === "All" ? wild.length : wild.filter((p) => p.brand === b).length;
            return (
              <button
                key={b}
                onClick={() => {
                  setBrand(b);
                  setOpen(null);
                }}
                className={cn(
                  "text-[15px] transition-colors",
                  brand === b ? "text-ink underline decoration-ink decoration-1 underline-offset-[5px]" : "text-mute hover:text-ink",
                )}
              >
                {b} <span className="font-mono text-[11px] text-mute">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Two openers at full width, then an even contact sheet. Uniform columns
            so no row is left with a hole in it. */}
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2">
          {shown.slice(0, 2).map((p, i) => (
            <Tile key={p.src} piece={p} onOpen={() => setOpen(i)} sizes="(max-width: 640px) 100vw, 46vw" />
          ))}
        </div>

        {shown.length > 2 && (
          <ol className="mt-12 grid grid-cols-2 items-start gap-x-4 gap-y-12 sm:gap-x-8 lg:grid-cols-3">
            {shown.slice(2).map((p, i) => (
              <li key={p.src}>
                <Tile piece={p} onOpen={() => setOpen(i + 2)} sizes="(max-width: 640px) 50vw, 30vw" />
              </li>
            ))}
          </ol>
        )}

        <p className="mt-12 max-w-2xl border-t rule pt-5 text-[13px] leading-relaxed text-mute">
          Everything here is machine generated and was made in 2024 to test a product. Zomato and Bira 91 appear as
          example brands. Neither company was involved, neither endorsed any of it, and none of it was ever published on
          their behalf. Two of the pictures are Zyke&rsquo;s own attempt at a public figure, which it reached for
          without being asked. They are here because they are a true record of what the thing did.
        </p>
      </Section>

      {open !== null && shown[open] && (
        <Lightbox
          piece={shown[open]}
          index={open}
          total={shown.length}
          onClose={() => setOpen(null)}
          onPrev={() => setOpen((open - 1 + shown.length) % shown.length)}
          onNext={() => setOpen((open + 1) % shown.length)}
        />
      )}
    </>
  );
}

function Tile({
  piece,
  onOpen,
  sizes,
}: {
  piece: Piece;
  onOpen: () => void;
  sizes: string;
}) {
  return (
    <figure>
      <p className="label">{piece.trend === "none" ? "No trend, just the brand" : piece.trend}</p>
      <p className="mt-2 flex gap-2 font-serif text-lg leading-snug tracking-tight sm:text-xl">
        <span aria-hidden className="mt-[0.35em] shrink-0 font-mono text-[11px] text-mute">
          &rarr;
        </span>
        <span>&ldquo;{piece.prompt}&rdquo;</span>
      </p>
      <button onClick={onOpen} className="group mt-4 block w-full text-left" aria-label={`Open: ${piece.caption}`}>
        {/* Every plate is the same square so the sheet stays even. The few wide
            pictures letterbox onto the plate rather than being cropped. */}
        <span className="plate block aspect-square overflow-hidden">
          <Image
            src={piece.src}
            alt={piece.caption}
            width={piece.w}
            height={piece.h}
            sizes={sizes}
            className="h-full w-full object-contain transition-opacity group-hover:opacity-90"
          />
        </span>
        <figcaption className="mt-2 text-[13px] leading-relaxed text-mute">{piece.caption}</figcaption>
      </button>
    </figure>
  );
}

function Lightbox({
  piece,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  piece: Piece;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
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
          width={piece.w * 2}
          height={piece.h * 2}
          className="max-h-[68vh] w-auto max-w-full object-contain"
        />
        <figcaption className="mt-5 w-full max-w-2xl text-paper">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/50">
            {piece.brand}
            {piece.trend !== "none" && <> &middot; {piece.trend}</>}
          </p>
          <p className="mt-2 font-serif text-xl leading-snug tracking-tight sm:text-2xl">&ldquo;{piece.prompt}&rdquo;</p>
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
