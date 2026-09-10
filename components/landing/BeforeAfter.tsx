"use client";

import { useRef, useState } from "react";
import Image from "next/image";

// Drag the divider to compare the original post image with the inpainted one.
export function BeforeAfter({ before, after, prompt }: { before: string; after: string; prompt: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const setFromClientX = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(98, Math.max(2, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <figure>
      <div
        ref={ref}
        className="plate relative aspect-square select-none overflow-hidden touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => e.buttons === 1 && setFromClientX(e.clientX)}
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
        <Image src={after} alt="Edited image with a galaxy background" fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before} alt="Original generated image" fill sizes="(min-width:1024px) 560px, 100vw" className="object-cover" />
        </div>
        <div className="absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border rule bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-wider">
            drag
          </span>
        </div>
      </div>
      <figcaption className="mt-3 flex justify-between gap-4 text-[13px] text-mute">
        <span>Original</span>
        <span className="text-right">Edited: &ldquo;{prompt}&rdquo;</span>
      </figcaption>
    </figure>
  );
}
