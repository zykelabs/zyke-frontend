import { cn } from "@/lib/utils";

// A sub-heading inside a group. Small kicker, short serif line, then content.
export function Block({
  label,
  title,
  lede,
  children,
  className,
}: {
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t rule pt-12", className)}>
      <p className="label">{label}</p>
      <h3 className="display mt-3 max-w-3xl text-2xl sm:text-3xl">{title}</h3>
      {lede && <div className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink2">{lede}</div>}
      <div className="mt-12">{children}</div>
    </div>
  );
}
