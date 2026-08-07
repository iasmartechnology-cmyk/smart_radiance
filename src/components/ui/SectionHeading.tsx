import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-gold-deep sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.08] tracking-[-0.03em] text-ink text-balance">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
