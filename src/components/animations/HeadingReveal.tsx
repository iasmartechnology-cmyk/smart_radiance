"use client";

import {
  useRef,
  type ComponentType,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Permissive tag type so the polymorphic `as` prop keeps clean JSX + refs. */
type AnyTag = ComponentType<
  HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
>;
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

type Props = {
  /** Each string is rendered as its own masked line. */
  lines: string[];
  as?: ElementType;
  className?: string;
  /** Delay before the reveal, e.g. to follow a hero entrance. */
  delay?: number;
  /** Use a scroll trigger instead of playing immediately on mount. */
  onScroll?: boolean;
};

/**
 * Masked line-by-line heading reveal — the signature editorial entrance.
 * Renders real, readable text (SEO / no-JS safe); the mask + slide is layered
 * on top only when motion is allowed.
 */
export default function HeadingReveal({
  lines,
  as: Component = "h2",
  className = "",
  delay = 0,
  onScroll = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const inners = ref.current.querySelectorAll(".reveal-line > span");
      gsap.from(inners, {
        yPercent: 115,
        duration: 1,
        delay,
        ease: "power4.out",
        stagger: 0.12,
        scrollTrigger: onScroll
          ? { trigger: ref.current, start: "top 82%", once: true }
          : undefined,
      });
    },
    { dependencies: [reduced], scope: ref },
  );

  const Tag = Component as unknown as AnyTag;
  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-line">
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
