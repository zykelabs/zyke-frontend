"use client";

import { useEffect, useState } from "react";
import { sections, site } from "@/lib/content";
import { useSections } from "./sections-context";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { reveal } = useSections();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-6 lg:px-10">
        <a href="#top" className="font-serif text-2xl leading-none tracking-tight">
          zyke
        </a>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink2 hover:text-ink"
          >
            {open ? "Close" : "Index"}
          </button>
          <a href={`mailto:${site.email}`} className="hidden text-[13px] link sm:inline">
            {site.email}
          </a>
        </div>
      </div>

      {/* One index for every screen size, rather than a separate mobile menu. */}
      {open && (
        <nav className="border-t rule bg-paper">
          {/* Multi-column so the numbers run down each column, not across. */}
          <ol className="mx-auto max-w-page px-6 py-2 lg:columns-2 lg:gap-12 lg:px-10">
            {sections.map((s) => (
              <li key={s.id} className="break-inside-avoid border-b rule">
                <button
                  onClick={() => {
                    setOpen(false);
                    reveal(s.id);
                  }}
                  className="flex w-full items-baseline gap-4 py-3 text-left"
                >
                  <span className="w-6 shrink-0 font-mono text-xs text-mute">{s.n}</span>
                  <span className="text-[15px]">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="mx-auto max-w-page px-6 pb-4 pt-2 lg:px-10">
            <a href={`mailto:${site.email}`} className="link text-[13px] sm:hidden">
              {site.email}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
