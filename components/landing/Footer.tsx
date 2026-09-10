import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer id="contact" className="border-t rule">
      <div className="mx-auto max-w-page px-6 py-16 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="display text-4xl sm:text-5xl">
              If you are building something like this, <em>write to us.</em>
            </p>
            <a href={`mailto:${site.email}`} className="link mt-6 inline-block text-lg">
              {site.email}
            </a>
          </div>
          <dl className="grid grid-cols-2 gap-8 text-[14px] lg:col-span-5">
            <div>
              <dt className="label">Elsewhere</dt>
              <dd className="mt-3 flex flex-col gap-2">
                <a href={site.youtubeUrl} target="_blank" rel="noreferrer" className="link w-fit">
                  YouTube
                </a>
                <a href={site.linkedin} target="_blank" rel="noreferrer" className="link w-fit">
                  LinkedIn
                </a>
                <a href={site.github} target="_blank" rel="noreferrer" className="link w-fit">
                  GitHub
                </a>
              </dd>
            </div>
            <div>
              <dt className="label">Colophon</dt>
              <dd className="mt-3 text-ink2 leading-relaxed">
                Set in Instrument Serif and Geist. Built as a static page. Zomato appears in the demo as an example
                brand and is not affiliated with Zyke.
              </dd>
            </div>
          </dl>
        </div>
        <p className="mt-14 border-t rule pt-5 text-[12px] text-mute">
          © 2024–{new Date().getFullYear()} Zyke. Made in Kharagpur.
        </p>
      </div>
    </footer>
  );
}
