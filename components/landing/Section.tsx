import { cn } from "@/lib/utils";

export function Section({
  id,
  eyebrow,
  title,
  children,
  className,
  wide = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <section id={id} className={cn("relative py-20 sm:py-28", className)}>
      <div className={cn("mx-auto px-5 sm:px-8", wide ? "max-w-7xl" : "max-w-6xl")}>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="text-balance max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
