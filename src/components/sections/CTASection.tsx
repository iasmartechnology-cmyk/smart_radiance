"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/constants/site";
import { fadeUp, staggerContainer } from "@/lib/motion";

const MEETING_HREF = `mailto:${SITE.email}?subject=Solicitud de reunión — ${SITE.name}`;

export function CTASection() {
  return (
    <section className="w-full bg-surface-container-highest py-section-gap text-center">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto max-w-3xl"
        >
          <motion.h2
            variants={fadeUp}
            className="mb-8 text-balance font-display text-display-lg-mobile text-on-surface md:text-display-lg"
          >
            ¿Preparado para transformar tu empresa?
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-12 font-inter text-body-lg text-on-surface-variant">
            Descubre cómo podemos ayudarte a escalar operaciones, reducir costes y mejorar la
            experiencia de tus clientes con tecnología de vanguardia.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Button href={MEETING_HREF} className="px-10 py-5">
              Solicitar una reunión
              <Calendar className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
