"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Variant = "pill" | "ghost";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  ariaLabel?: string;
  /** Open in a new tab with safe rel attributes. */
  external?: boolean;
};

const base =
  "relative inline-flex items-center justify-center gap-2 text-body select-none transition-colors duration-300 will-change-transform";

const variants: Record<Variant, string> = {
  // Cobalt is the system's only chromatic action — one per section, no more.
  pill: "rounded-[var(--radius-pill)] bg-cobalt text-white px-6 py-3 hover:bg-[#4356d8]",
  // Ivory hairline ghost — the border does the work, never a colour.
  ghost:
    "rounded-[var(--radius-nav)] border border-ivory/70 text-ivory px-5 py-3 hover:border-ivory hover:bg-ivory/5",
};

/**
 * Anchor CTA with a subtle magnetic pull toward the cursor. The pull and the
 * inner-label counter-motion are disabled under reduced-motion and never bind
 * on touch (no pointer to follow), keeping it fully functional as a plain link.
 */
export default function MagneticButton({
  href,
  children,
  variant = "pill",
  className = "",
  ariaLabel,
  external = false,
}: Props) {
  const root = useRef<HTMLAnchorElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    (_context, contextSafe) => {
      const el = root.current;
      const lbl = label.current;
      if (!el || !lbl || reduced || !contextSafe) return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const lxTo = gsap.quickTo(lbl, "x", { duration: 0.6, ease: "power3.out" });
      const lyTo = gsap.quickTo(lbl, "y", { duration: 0.6, ease: "power3.out" });

      const onMove = contextSafe((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        xTo(relX * 0.3);
        yTo(relY * 0.4);
        lxTo(relX * 0.12);
        lyTo(relY * 0.16);
      });

      const onLeave = contextSafe(() => {
        xTo(0);
        yTo(0);
        lxTo(0);
        lyTo(0);
      });

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [reduced], scope: root },
  );

  return (
    <a
      ref={root}
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <span ref={label} className="inline-flex items-center gap-2">
        {children}
      </span>
    </a>
  );
}
