import { cn } from "@/lib/utils";

// Editorial two-column section: a small numbered label in the left column,
// content in the right. Collapses to one column on small screens.
export function Section({
  id,
  n,
  label,
  title,
  lede,
  children,
  className,
}: {
  id: string;
  n: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("border-t rule", className)}>
      <div className="mx-auto max-w-page px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="label">
              {n} <span className="mx-1.5 text-rule">/</span> {label}
            </p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="display max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{title}</h2>
            {lede && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-ink2">{lede}</div>}
            <div className="mt-12">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
