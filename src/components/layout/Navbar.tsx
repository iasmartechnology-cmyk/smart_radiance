"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "border-b border-ink/8 bg-cream/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-[4.5rem]">
        <Link
          href="#inicio"
          aria-label="Smart Radiance — Ir al inicio"
          className="group relative z-10 font-display text-lg font-semibold tracking-[-0.03em] text-ink sm:text-xl"
          onClick={() => setOpen(false)}
        >
          Smart{" "}
          <span className="text-gold transition-colors group-hover:text-gold-deep">
            Radiance
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button href={COMPANY.emailHref} size="md">
            Pedir presupuesto
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-cream lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="flex w-4 flex-col gap-1.5">
            <span
              className={cn(
                "h-[1.5px] w-full bg-ink transition-transform duration-300",
                open && "translate-y-[3.5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "h-[1.5px] w-full bg-ink transition-transform duration-300",
                open && "-translate-y-[3.5px] -rotate-45",
              )}
            />
          </span>
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            ref={menuRef}
            aria-label="Menú móvil"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-t border-ink/8 bg-cream/95 backdrop-blur-xl lg:hidden"
          >
            <Container className="flex flex-col gap-2 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 font-display text-xl text-ink transition-colors hover:bg-cream-deep"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 px-1">
                <Button
                  href={COMPANY.emailHref}
                  size="lg"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Pedir presupuesto
                </Button>
              </div>
            </Container>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
