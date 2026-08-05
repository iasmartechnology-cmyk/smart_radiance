"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/constants/site";
import { fadeUp, staggerContainer } from "@/lib/motion";

const MEETING_HREF = `mailto:${SITE.email}?subject=Solicitud de reunión — ${SITE.name}`;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const blobBackY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const blobFrontY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative flex min-h-[90vh] items-center justify-center pb-section-gap pt-24 md:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.div
          style={{ y: blobBackY }}
          className="absolute -right-[10%] -top-[20%] h-[60vw] w-[60vw] rounded-full bg-primary-container/10 blur-[100px]"
        />
        <motion.div
          style={{ y: blobFrontY }}
          className="absolute -left-[20%] top-[40%] h-[50vw] w-[50vw] rounded-full bg-tertiary-container/20 blur-[120px]"
        />
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex max-w-2xl flex-col items-start gap-stack-lg"
          >
            <motion.h1
              variants={fadeUp}
              className="text-balance font-display text-display-lg-mobile text-on-surface md:text-display-lg"
            >
              Impulsamos el crecimiento de tu empresa mediante{" "}
              <span className="font-light italic text-primary">automatización inteligente.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="max-w-xl font-inter text-body-lg text-on-surface-variant">
              Diseñamos soluciones digitales que optimizan procesos, eliminan tareas repetitivas y
              ayudan a tu empresa a trabajar de forma más eficiente.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-4">
              <Button href={MEETING_HREF}>
                Solicitar una reunión
                <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
              </Button>
              <Button variant="secondary" href="#servicios">
                Ver servicios
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative flex h-[360px] w-full items-center justify-center sm:h-[500px] lg:h-[600px]"
          >
            <motion.div style={{ y: imageY, opacity: imageOpacity }} className="h-full w-full">
              <motion.div
                animate={{ y: [0, -16, 0], rotate: [0, 2, 0] }}
                transition={{
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }}
                className="relative h-full w-full"
              >
                <Image
                  src="/images/hero-illustration.jpg"
                  alt="Ilustración abstracta de transformación digital"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
