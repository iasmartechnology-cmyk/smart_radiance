"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { METHODOLOGY_STEPS } from "@/constants/methodology";
import { fadeUp, fadeUpSm, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StepItemProps {
  step: (typeof METHODOLOGY_STEPS)[number];
  stepNumber: number;
}

function StepItem({ step, stepNumber }: StepItemProps) {
  const isFirst = stepNumber === 1;

  return (
    <motion.li variants={fadeUp} className="relative">
      <span
        aria-hidden
        className={cn(
          "absolute -left-[41px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 bg-surface md:-left-[57px]",
          isFirst ? "border-primary" : "border-outline-variant",
        )}
      >
        <span className={cn("font-display text-label-md", isFirst ? "text-primary" : "text-on-surface-variant")}>
          {stepNumber}
        </span>
      </span>
      <h3 className="mb-3 font-display text-headline-sm text-on-surface">{step.title}</h3>
      <p className="font-inter text-body-md text-on-surface-variant">{step.description}</p>
    </motion.li>
  );
}

export function Methodology() {
  return (
    <section id="metodologia" className="w-full bg-surface py-section-gap">
      <Container>
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="lg:sticky lg:top-32"
          >
            <motion.div variants={fadeUpSm}>
              <SectionLabel>Metodología</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUpSm}
              className="mb-6 mt-4 font-display text-headline-md text-on-surface"
            >
              Cómo trabajamos
            </motion.h2>
            <motion.p variants={fadeUpSm} className="max-w-md font-inter text-body-lg text-on-surface-variant">
              Un proceso iterativo y transparente diseñado para minimizar el riesgo y maximizar el
              impacto desde el primer día.
            </motion.p>
          </motion.div>

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative space-y-16 border-l border-outline-variant/30 pl-8 md:pl-12"
          >
            {METHODOLOGY_STEPS.map((step, index) => (
              <StepItem key={step.title} step={step} stepNumber={index + 1} />
            ))}
          </motion.ol>
        </div>
      </Container>
    </section>
  );
}
