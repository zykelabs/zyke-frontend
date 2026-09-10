import Image from "next/image";
import { months } from "@/lib/content";

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
        <h1 className="display mt-8 max-w-[22ch] text-[2.75rem] sm:text-6xl lg:text-[5.5rem]">
          It learned a brand&rsquo;s voice, watched what was trending, and did the work.
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <p className="max-w-xl text-lg leading-relaxed text-ink2 lg:col-span-7">
            You gave Zyke a brand. It read the brand&rsquo;s website and social accounts, worked out how the brand
            talked, found what was trending that morning, and came back with finished posts and generated images. If an
            image was wrong you pointed at the part you wanted changed and typed a sentence. Three of us built it at IIT
            Kharagpur in 2024. This page is the record.
          </p>
          <div className="flex flex-col gap-3 text-[15px] lg:col-span-5 lg:items-end">
            <a href="#demo" className="link">
              Watch the four-minute demo
            </a>
            <a href="#gallery" className="link">
              See the work it came up with
            </a>
            <a href="#how" className="link">
              Read how it worked
            </a>
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
            Six posts Zyke came up with on its own, for four brands it had never been told anything about beyond a
            website address.
          </p>
        </div>
      </div>
    </section>
  );
}
