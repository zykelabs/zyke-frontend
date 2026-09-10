"use client";

import { useState } from "react";

const links = [
  ["#demo", "Demo"],
  ["#how", "How it worked"],
  ["#features", "Features"],
  ["#gallery", "The work"],
  ["#numbers", "Numbers"],
  ["#stack", "Under the hood"],
  ["#story", "Story"],
  ["#why", "Why"],
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b rule bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-6 lg:px-10">
        <a href="#top" className="font-serif text-2xl leading-none tracking-tight">
          zyke
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(([h, l]) => (
            <a key={h} href={h} className="text-[13px] text-ink2 transition-colors hover:text-ink">
              {l}
            </a>
          ))}
        </nav>
        <a href="mailto:founders@zyke.in" className="hidden text-[13px] link md:inline">
          founders@zyke.in
        </a>
        <button
          className="text-[13px] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="border-t rule bg-paper md:hidden">
          <ul className="mx-auto max-w-page px-6 py-2">
            {links.map(([h, l]) => (
              <li key={h}>
                <a href={h} onClick={() => setOpen(false)} className="block py-3 text-base">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
