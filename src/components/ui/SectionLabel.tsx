import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span className={cn("font-display text-label-md uppercase tracking-widest text-primary", className)}>
      {children}
    </span>
  );
}
