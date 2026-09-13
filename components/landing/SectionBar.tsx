"use client";

import { useSections } from "./sections-context";

// A slim rule above the groups, with the open-all control.
export function SectionBar() {
  const { openAll, closeAll, anyOpen } = useSections();
  return (
    <div id="contents" className="scroll-mt-14 border-t rule">
      <div className="mx-auto flex max-w-page items-baseline justify-between px-6 pb-2 pt-10 lg:px-10">
        <p className="label">Five sections</p>
        <button onClick={anyOpen ? closeAll : openAll} className="link text-[13px] text-ink2 hover:text-ink">
          {anyOpen ? "Close everything" : "Open everything"}
        </button>
      </div>
    </div>
  );
}
