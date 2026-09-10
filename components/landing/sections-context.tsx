"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  reveal: (id: string) => void;
  openAll: () => void;
  closeAll: () => void;
  anyOpen: boolean;
};

const SectionsCtx = createContext<Ctx | null>(null);

export function useSections() {
  const c = useContext(SectionsCtx);
  if (!c) throw new Error("useSections must be used inside SectionsProvider");
  return c;
}

// Every section starts closed, so the page opens as a contents list. Any link to
// a section id opens it on the way there, including links inside the prose and
// the browser's own back and forward.
export function SectionsProvider({ children, ids }: { children: React.ReactNode; ids: string[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const scrollTo = (id: string) => {
    // Wait two frames so the newly rendered content is measured before scrolling.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })),
    );
  };

  const reveal = useCallback((id: string) => {
    setOpen((o) => (o[id] ? o : { ...o, [id]: true }));
    scrollTo(id);
  }, []);

  const toggle = useCallback((id: string) => {
    setOpen((o) => ({ ...o, [id]: !o[id] }));
  }, []);

  const openAll = useCallback(() => {
    setOpen(Object.fromEntries(ids.map((i) => [i, true])));
  }, [ids]);

  const closeAll = useCallback(() => setOpen({}), []);

  useEffect(() => {
    const fromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) reveal(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);

    // Catch every in-page anchor, wherever it lives, and open its section first.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      if (id) reveal(id);
    };
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("click", onClick);
    };
  }, [reveal]);

  const value = useMemo<Ctx>(
    () => ({
      isOpen: (id) => !!open[id],
      toggle,
      reveal,
      openAll,
      closeAll,
      anyOpen: Object.values(open).some(Boolean),
    }),
    [open, toggle, reveal, openAll, closeAll],
  );

  return <SectionsCtx.Provider value={value}>{children}</SectionsCtx.Provider>;
}
