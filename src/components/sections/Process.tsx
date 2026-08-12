"use client";

import { useRef } from "react";
import Reveal from "@/components/animations/Reveal";
import HeadingReveal from "@/components/animations/HeadingReveal";
import { processSteps } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  // Desktop-only scrubbed rope line that fills as you climb the section —
  // the DOM echo of the camera gaining altitude behind it.
  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          bar.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: root.current,
              start: "top 70%",
              end: "bottom 80%",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [reduced], scope: root },
  );

  return (
    <section
      id="proceso"
      ref={root}
      aria-label="Proceso de trabajo"
      className="relative z-10 py-[var(--section-gap)] md:py-28"
    >
      <div className="shell grid gap-14 md:grid-cols-[minmax(0,22rem)_1fr] md:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="text-caption text-cobalt">La ruta</p>
          <HeadingReveal
            as="h2"
            onScroll
            lines={["Cuatro tramos", "hasta la cima."]}
            className="text-heading-lg mt-5 text-ivory"
          />
          <p className="text-body mt-6 max-w-[34ch] text-ash">
            Un método claro y medible, del campo base al crecimiento sostenido.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Rope */}
          <span
            aria-hidden="true"
            className="relative hidden w-px shrink-0 bg-obsidian md:block"
          >
            <span
              ref={bar}
              className="absolute inset-0 block origin-top scale-y-0 bg-cobalt"
            />
          </span>

          <ol className="flex-1">
            {processSteps.map((step) => (
              <Reveal as="li" key={step.index}>
                <div className="border-b border-obsidian py-9 last:border-0">
                  <div className="flex items-baseline gap-4">
                    <span className="text-caption text-slate">
                      {step.index}
                    </span>
                    <span className="text-caption text-cobalt">
                      {step.altitude}
                    </span>
                  </div>
                  <h3 className="text-heading-sm mt-3 text-ivory">
                    {step.title}
                  </h3>
                  <p className="text-body mt-3 max-w-[46ch] text-ash">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
