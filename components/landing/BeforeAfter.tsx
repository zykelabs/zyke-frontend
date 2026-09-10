"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// Drag the handle to compare the original post image with the inpainted one.
export function BeforeAfter({ before, after, prompt }: { before: string; after: string; mask: string; prompt: string }) {
  const [pos, setPos] = useState(52);
  const ref = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.min(98, Math.max(2, pct)));
  };

  return (
    <figure className="w-full">
      <div
        ref={ref}
        className="relative aspect-square select-none overflow-hidden rounded-xl border hairline bg-ink-950 touch-none"
        onPointerDown={(e) => {
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons === 1) setFromClientX(e.clientX);
        }}
        role="slider"
        aria-label="Compare original and edited image"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 4));
          if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 4));
        }}
      >
        <Image src={after} alt="Edited image with a galaxy background" fill sizes="(min-width:1024px) 380px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt="Original generated image" fill sizes="(min-width:1024px) 380px, 100vw" className="object-cover" />
        </div>
        <div className="absolute inset-y-0 w-px bg-white/90" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-ink-950/80 font-mono text-[10px] text-white backdrop-blur">
            ↔
          </span>
        </div>
        <span className="absolute left-2 top-2 rounded bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] text-white backdrop-blur">
          original
        </span>
        <span className="absolute right-2 top-2 rounded bg-ember-500/90 px-1.5 py-0.5 font-mono text-[10px] text-ink-950">
          edited
        </span>
      </div>
      <figcaption className="mt-2 font-mono text-[11px] leading-relaxed text-ink-400">
        prompt: &ldquo;{prompt}&rdquo; · the scooter, rider and pizza were left untouched
      </figcaption>
    </figure>
  );
}
