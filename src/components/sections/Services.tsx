"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SERVICES } from "@/lib/constants";

export function Services() {
  return (
    <Section id="servicios">
      <Reveal>
        <SectionHeading
          eyebrow="Servicios"
          title="Tres formas de elevar tu presencia online"
          description="Nos centramos en lo esencial: construir, posicionar y mejorar. Sin dispersión."
        />
      </Reveal>

      <Stagger className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
        {SERVICES.map((service) => (
          <StaggerItem key={service.id}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="group relative h-full overflow-hidden rounded-[20px] border border-ink/8 bg-white/55 p-7 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] sm:p-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(184,145,74,0.18),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-deep">
                {service.number}
              </p>
              <h3 className="mt-5 font-display text-2xl font-medium tracking-[-0.03em] text-ink sm:text-[1.65rem]">
                {service.title}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-muted sm:text-base">
                {service.description}
              </p>
              <div className="mt-8 h-px w-12 bg-gold/50 transition-all duration-300 group-hover:w-20" />
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
