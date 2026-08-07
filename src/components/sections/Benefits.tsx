"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { BENEFITS } from "@/lib/constants";

export function Benefits() {
  return (
    <Section id="beneficios">
      <Reveal>
        <SectionHeading
          eyebrow="Beneficios"
          title="Lo que ganas cuando tu web trabaja de verdad"
          description="No se trata solo de verse bien. Se trata de generar confianza, tráfico y oportunidades."
          align="center"
          className="mx-auto"
        />
      </Reveal>

      <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {BENEFITS.map((benefit, index) => (
          <StaggerItem key={benefit.title}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-[18px] border border-ink/8 bg-gradient-to-b from-white/70 to-cream-soft/80 p-6 sm:p-7"
            >
              <span className="font-mono text-[11px] text-gold-deep">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl font-medium tracking-[-0.02em] text-ink">
                {benefit.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                {benefit.description}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
