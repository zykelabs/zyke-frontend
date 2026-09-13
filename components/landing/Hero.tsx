import Image from "next/image";
import { months, site } from "@/lib/content";

// Six of the best pieces it made, unlabelled, as the first thing you see.
const all = months.flatMap((m) => m.pieces);
const strip = [
  "/gallery/nov-delhi-landmarks.jpeg",
  "/gallery/nov-smart-routing.jpeg",
  "/gallery/oct-bira-america.jpeg",
  "/gallery/nov-lebron-confetti.jpeg",
  "/gallery/nov-cooking-better-india.jpeg",
  "/gallery/oct-brewing-perfect-code.jpeg",
].map((src) => all.find((p) => p.src === src)!);

export function Hero() {
  return (
    <section id="top">
      <div className="mx-auto max-w-page px-6 pb-16 pt-20 lg:px-10 lg:pb-20 lg:pt-32">
        <p className="label">Zyke, 2024. An AI marketing agent, now an archive.</p>
        <h1 className="display mt-8 max-w-[16ch] text-[3rem] sm:text-7xl lg:text-[6.5rem]">
          It learned the brand. It did the work.
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <p className="max-w-xl text-lg leading-relaxed text-ink2 lg:col-span-7">
Give it a brand. It reads the site, finds what is trending, and comes back with finished posts.
            Point at anything wrong and type the fix.
          </p>
          <div className="flex flex-col gap-3 text-[15px] lg:col-span-5 lg:items-end">
            <a href="#demo" className="link">
              Watch the four-minute demo
            </a>
            <a href="#gallery" className="link">
              See the work it came up with
            </a>
            <a href="#stack" className="link">
              Read how it was built
            </a>
            <a href="#contents" className="link">
              Or start from the contents
            </a>
            <p className="mt-2 text-[13px] leading-relaxed text-mute lg:text-right">
              The code is here:{" "}
              <a href={site.githubFrontend} target="_blank" rel="noreferrer" className="link text-ink2">
                frontend
              </a>{" "}
              and{" "}
              <a href={site.githubBackend} target="_blank" rel="noreferrer" className="link text-ink2">
                backend
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="border-t rule">
        <div className="mx-auto max-w-page px-6 py-6 lg:px-10">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
            {strip.map((g) => (
              <figure key={g.src} className="plate">
                <Image
                  src={g.src}
                  alt={g.caption}
                  width={g.w}
                  height={g.h}
                  sizes="(max-width: 640px) 33vw, 17vw"
                  className="aspect-square w-full object-cover"
                  priority
                />
              </figure>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-mute">
            Six posts it came up with on its own, for four brands it knew only from a website address.
          </p>
        </div>
      </div>
    </section>
  );
}
