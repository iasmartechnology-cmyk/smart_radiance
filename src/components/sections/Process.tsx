"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROCESS_STEPS } from "@/lib/constants";

export function Process() {
  return (
    <Section id="proceso" alt>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Proceso"
            title="Un camino claro, del briefing al lanzamiento"
            description="Metodología sencilla y transparente. Sabes en qué punto estás y qué viene después."
          />
        </Reveal>

        <Stagger className="relative space-y-0">
          <div
            aria-hidden
            className="absolute top-5 bottom-5 left-[19px] w-px bg-[linear-gradient(to_bottom,transparent,rgba(184,145,74,0.45),transparent)] sm:left-[23px]"
          />

          {PROCESS_STEPS.map((step) => (
            <StaggerItem key={step.number}>
              <div className="relative flex gap-5 py-5 sm:gap-6 sm:py-6">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-cream-soft font-mono text-[11px] font-medium text-gold-deep shadow-[0_0_0_6px_rgba(247,244,239,0.9)] sm:h-12 sm:w-12 sm:text-xs">
                  {step.number}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-muted sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
