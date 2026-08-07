"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RadianceOrb } from "@/components/visual/RadianceOrb";
import { COMPANY } from "@/lib/constants";

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });
  const parallaxX = useTransform(springX, [-0.5, 0.5], [-18, 18]);
  const parallaxY = useTransform(springY, [-0.5, 0.5], [-12, 12]);

  const onMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (reduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative isolate min-h-[100dvh] overflow-hidden bg-atmosphere pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pb-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(42,40,37,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(42,40,37,0.035)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      <Container className="relative grid min-h-[calc(100dvh-7rem)] items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-16">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-display text-ink">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
            >
              Smart{" "}
              <span className="bg-[linear-gradient(120deg,#8f6e2f_0%,#b8914a_45%,#d0b06a_100%)] bg-clip-text text-transparent">
                Radiance
              </span>
            </motion.span>

            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 block text-[clamp(1.85rem,4.2vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.035em] text-balance"
            >
              Presencia digital que transmite confianza y convierte.
            </motion.span>
          </h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg"
          >
            Diseñamos y mejoramos webs con elegancia, claridad y foco en
            resultados. Desarrollo, SEO y optimización — sin ruido, con
            intención.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button href={COMPANY.emailHref} size="lg">
              Pedir presupuesto
            </Button>
            <Button href="#servicios" variant="secondary" size="lg">
              Ver servicios
            </Button>
          </motion.div>
        </div>

        <motion.div
          style={
            reduceMotion
              ? undefined
              : { x: parallaxX, y: parallaxY }
          }
          initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[540px] lg:max-w-none"
        >
          <div
            aria-hidden
            className="absolute inset-[10%] rounded-full bg-gold/15 blur-3xl"
          />
          <RadianceOrb />
        </motion.div>
      </Container>
    </section>
  );
}
