"use client";

import { useRef } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

const HEADLINE = ["Llevamos tu negocio", "a la cima."];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  // One coordinated entrance timeline for the whole hero.
  useGSAP(
    () => {
      if (reduced || !root.current) return;
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({
        delay: 0.35,
        defaults: { ease: "power4.out" },
      });
      tl.from(q("[data-eyebrow]"), { opacity: 0, y: 14, duration: 0.8 })
        .from(
          q("[data-line] > span"),
          { yPercent: 115, duration: 1.05, stagger: 0.1 },
          "-=0.45",
        )
        .from(q("[data-body]"), { opacity: 0, y: 20, duration: 0.9 }, "-=0.6")
        .from(
          q("[data-cta]"),
          { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 },
          "-=0.55",
        )
        .from(q("[data-cue]"), { opacity: 0, duration: 0.8 }, "-=0.3");
    },
    { dependencies: [reduced], scope: root },
  );

  return (
    <section
      id="inicio"
      ref={root}
      aria-label="Presentación"
      className="relative z-10 flex min-h-svh items-center justify-center"
    >
      {/* Mercury hero: a single centred content stack, ~640px wide */}
      <div className="shell flex flex-col items-center pt-28 pb-24 text-center">
        <p data-eyebrow className="text-caption text-ash">
          Agencia digital · Web &amp; SEO
        </p>

        <h1 className="text-display mt-6 max-w-[16ch] text-ivory">
          {HEADLINE.map((line, i) => (
            <span key={i} data-line className="reveal-line">
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <p data-body className="text-body-lg mt-6 max-w-[46ch] text-ash">
          Diseñamos, desarrollamos y posicionamos webs que hacen crecer
          negocios. Cada scroll es un paso más hacia la cima.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <span data-cta>
            <MagneticButton href="#contacto" variant="pill">
              Empezar proyecto
            </MagneticButton>
          </span>
          <span data-cta>
            <MagneticButton href="#servicios" variant="ghost">
              Ver servicios
            </MagneticButton>
          </span>
        </div>
      </div>

      <div
        data-cue
        aria-hidden="true"
        className="text-caption absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-ash"
      >
        <span>Comienza el ascenso</span>
        <span className="h-10 w-px bg-ash/40" />
      </div>
    </section>
  );
}
