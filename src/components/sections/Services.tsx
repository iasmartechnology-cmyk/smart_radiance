"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { SERVICES } from "@/constants/services";
import { fadeUp, staggerContainer } from "@/lib/motion";

export function Services() {
  return (
    <section id="servicios" className="w-full bg-surface-container-low py-section-gap">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-24 flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp}>
            <SectionLabel>Nuestras Soluciones</SectionLabel>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-4 max-w-2xl text-balance font-display text-headline-md text-on-surface"
          >
            Ecosistema Digital Integral
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
