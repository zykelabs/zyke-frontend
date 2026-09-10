import { Github, Linkedin, Mail, Youtube } from "lucide-react";
import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer id="contact" className="border-t hairline">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-ink-950 font-bold">z</span>
              <span className="text-lg font-semibold tracking-tight">zyke</span>
            </div>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-300">
              Zyke was an AI marketing agent built at {site.builtAt} in {site.years}. The product is no longer running.
              If you are building something similar, or want to talk about what we learned, write to us.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-flex items-center gap-2 text-lg text-white underline-offset-4 hover:underline"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {site.email}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">On this page</h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  ["#demo", "Demo"],
                  ["#how", "How it worked"],
                  ["#features", "Features"],
                  ["#gallery", "Gallery"],
                  ["#stack", "Under the hood"],
                  ["#story", "Story"],
                ].map(([h, l]) => (
                  <li key={h}>
                    <a href={h} className="text-ink-300 hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">Elsewhere</h4>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a href={site.youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-300 hover:text-white">
                    <Youtube className="h-4 w-4" aria-hidden /> YouTube
                  </a>
                </li>
                <li>
                  <a href={site.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-300 hover:text-white">
                    <Linkedin className="h-4 w-4" aria-hidden /> LinkedIn
                  </a>
                </li>
                <li>
                  <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-ink-300 hover:text-white">
                    <Github className="h-4 w-4" aria-hidden /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t hairline pt-6 font-mono text-[11px] text-ink-500 sm:flex-row sm:justify-between">
          <p>© 2024–{new Date().getFullYear()} Zyke. Zomato is used in the demo as an example brand and is not affiliated with Zyke.</p>
          <p>Made in Kharagpur.</p>
        </div>
      </div>
    </footer>
  );
}
