"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

interface ButtonProps {
  variant?: Variant;
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-display text-label-md transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary shadow-gold hover:bg-primary-container hover:text-on-primary-container",
  secondary:
    "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container",
};

const motionProps = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring" as const, stiffness: 400, damping: 25 },
};

export function Button({ variant = "primary", href, className, children, onClick }: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (href) {
    return (
      <motion.a href={href} className={classes} onClick={onClick} {...motionProps}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" className={classes} onClick={onClick} {...motionProps}>
      {children}
    </motion.button>
  );
}
