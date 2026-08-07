import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  alt?: boolean;
};

export function Section({
  id,
  children,
  className,
  containerClassName,
  alt = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-28 py-20 sm:py-24 md:py-28 lg:py-32",
        alt && "bg-section-alt",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
