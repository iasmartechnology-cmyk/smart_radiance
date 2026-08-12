"use client";

import {
  useRef,
  type ComponentType,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/** Permissive tag type so the polymorphic `as` prop keeps clean JSX + refs. */
type AnyTag = ComponentType<
  HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
>;

type Props = {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
  /** Stagger direct children instead of animating the block as one. */
  stagger?: boolean;
  delay?: number;
  y?: number;
};

/**
 * Scroll-reveal wrapper. Content is visible by default (no JS / reduced-motion
 * safe); GSAP only adds the entrance. Uses `gsap.from` so nothing is left
 * hidden if the trigger never fires.
 */
export default function Reveal({
  children,
  as: Component = "div",
  className = "",
  stagger = false,
  delay = 0,
  y = 28,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const targets = stagger
        ? (Array.from(ref.current.children) as HTMLElement[])
        : ref.current;

      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.9,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.09 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  const Tag = Component as unknown as AnyTag;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
