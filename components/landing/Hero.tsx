import Image from "next/image";
import { gallery } from "@/lib/content";

export function Hero() {
  return (
    <section id="top">
      <div className="mx-auto max-w-page px-6 pb-16 pt-20 lg:px-10 lg:pb-24 lg:pt-32">
        <p className="label">Zyke, 2024. An AI marketing agent, now an archive.</p>
        <h1 className="display mt-8 max-w-[22ch] text-[2.75rem] sm:text-6xl lg:text-[5.5rem]">
          It learned a brand&rsquo;s voice, followed what was trending, and did the work.
        </h1>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <p className="max-w-xl text-lg leading-relaxed text-ink2 lg:col-span-7">
            Zyke turned a brand and a live trend into finished social posts with generated images, then let you fix
            any image by pointing at the part you wanted changed. It was built at IIT Kharagpur in 2024 and ran for a
            year. This page is the record of what it was and how it worked.
          </p>
          <div className="flex flex-col gap-3 text-[15px] lg:col-span-5 lg:items-end">
            <a href="#demo" className="link">
              Watch the four-minute demo
            </a>
            <a href="#how" className="link">
              Read how it worked
            </a>
            <a href="#gallery" className="link">
              See what it made
            </a>
          </div>
        </div>
      </div>

      {/* A plain strip of the demo's output. No tilt, no decoration. */}
      <div className="border-t rule">
        <div className="mx-auto max-w-page px-6 py-6 lg:px-10">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
            {[gallery[2], gallery[3], gallery[9], gallery[1], gallery[12], gallery[0]].map((g) => (
              <figure key={g.src} className="plate">
                <Image src={g.src} alt={g.caption} width={512} height={512} className="aspect-square w-full object-cover" priority />
              </figure>
            ))}
          </div>
          <p className="mt-3 text-[13px] text-mute">
            Six of the thirteen images Zyke generated in the demo, for Zomato, from one trend about a rocket landing.
          </p>
        </div>
      </div>
    </section>
  );
}
