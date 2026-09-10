"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/content";
import { buttonClass } from "@/components/ui/button";

const links = [
  { href: "#demo", label: "Demo" },
  { href: "#how", label: "How it worked" },
  { href: "#features", label: "Features" },
  { href: "#gallery", label: "Gallery" },
  { href: "#stack", label: "Under the hood" },
  { href: "#story", label: "Story" },
];

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-ink-950/80 backdrop-blur-md border-b hairline" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="#top" className="flex items-center gap-2.5" aria-label="Zyke home">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink-950 font-bold tracking-tight">z</span>
          <span className="text-lg font-semibold tracking-tight">zyke</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-sm text-ink-300 transition-colors hover:text-white">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a href="#demo" className={buttonClass("solid", "md")}>
            <Play className="h-4 w-4" aria-hidden />
            Watch the demo
          </a>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-full text-ink-200 hover:bg-white/5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t hairline bg-ink-950/95 backdrop-blur-md md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-ink-200 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-3">
              <a href="#demo" onClick={() => setOpen(false)} className={buttonClass("solid", "md", "w-full")}>
                <Play className="h-4 w-4" aria-hidden />
                Watch the demo
              </a>
            </li>
            <li className="py-3 text-xs text-ink-400">
              <a href={site.youtubeUrl} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                Open on YouTube instead
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
