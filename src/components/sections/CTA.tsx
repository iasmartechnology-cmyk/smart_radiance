"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { COMPANY } from "@/lib/constants";

export function CTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 md:py-28">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-gold/20 bg-[linear-gradient(145deg,#2a2825_0%,#3a342c_48%,#4a3f2e_100%)] px-7 py-14 text-center shadow-[var(--shadow-lift)] sm:px-12 sm:py-16 md:px-16 md:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-gold/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-gold-light/15 blur-3xl"
            />

            {!reduceMotion ? (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-40"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 40%, rgba(208,176,106,0.25), transparent 35%), radial-gradient(circle at 80% 60%, rgba(184,145,74,0.18), transparent 40%)",
                  backgroundSize: "160% 160%",
                }}
              />
            ) : null}

            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold-light">
                Empecemos
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.03em] text-white text-balance">
                ¿Listo para una web que represente de verdad tu negocio?
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                Cuéntanos tu proyecto. Te respondemos con una propuesta clara y
                un presupuesto transparente.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  href={COMPANY.emailHref}
                  size="lg"
                  className="min-w-[200px]"
                >
                  Pedir presupuesto
                </Button>
                <Button
                  href={COMPANY.phoneHref}
                  variant="secondary"
                  size="lg"
                  className="min-w-[200px] border-white/20 bg-white/5 text-white hover:border-gold/50 hover:bg-white/10 hover:text-white"
                >
                  Llamar ahora
                </Button>
              </div>

              <p className="mt-8 text-sm text-white/60">
                {COMPANY.email} · {COMPANY.phone}
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
