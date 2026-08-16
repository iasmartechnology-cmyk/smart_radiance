"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, site } from "@/lib/site";
import { scrollToId } from "@/lib/smooth-scroll";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export default function Nav() {
  const [active, setActive] = useState<string>("#inicio");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Entrance animation.
  useGSAP(
    () => {
      if (reduced || !nav.current) return;
      gsap.from(nav.current, {
        y: -20,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
      });
    },
    { dependencies: [reduced], scope: nav },
  );

  // Frosted-glass fill once the hero is behind us.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy via IntersectionObserver — cheap and layout-independent.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter((el): el is Element => el !== null);
    if (sections.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(`#${entry.target.id}`, entry.intersectionRatio);
        }
        let best = "#inicio";
        let bestRatio = 0;
        for (const [href, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = href;
          }
        }
        if (bestRatio > 0) setActive(best);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-40% 0px -40% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Section anchors only exist on the homepage. From a service page the same
  // links have to become real navigations to "/#seccion", otherwise they
  // silently do nothing.
  const go = (href: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!isHome) return; // let the Link navigate
    e.preventDefault();
    scrollToId(href);
  };

  /** Anchor on the homepage, absolute path anywhere else. */
  const hrefFor = (hash: string) => (isHome ? hash : `/${hash}`);

  return (
    <>
      <nav
        ref={nav}
        aria-label="Principal"
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-onyx/70 backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="shell flex items-center justify-between py-4">
          <Link
            href={hrefFor("#inicio")}
            onClick={go("#inicio")}
            className="text-body font-[480] text-ivory"
          >
            {site.name}
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={hrefFor(link.href)}
                  onClick={go(link.href)}
                  aria-current={
                    isHome && active === link.href ? "true" : undefined
                  }
                  data-on={isHome && active === link.href}
                  className="text-body rounded-[var(--radius-nav)] px-5 py-2 text-ash transition-colors hover:text-ivory data-[on=true]:bg-obsidian data-[on=true]:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href={hrefFor("#contacto")}
              onClick={go("#contacto")}
              className="text-body hidden rounded-[var(--radius-pill)] bg-cobalt px-5 py-2.5 text-white transition-colors hover:bg-[#4356d8] md:inline-flex"
            >
              Empezar proyecto
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="text-body text-ivory md:hidden"
            >
              {open ? "Cerrar" : "Menú"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-onyx/95 backdrop-blur-md md:hidden"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={hrefFor(link.href)}
            onClick={go(link.href)}
            className="text-heading text-ivory"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={hrefFor("#contacto")}
          onClick={go("#contacto")}
          className="text-body mt-2 rounded-[var(--radius-pill)] bg-cobalt px-6 py-3 text-white"
        >
          Empezar proyecto
        </Link>
      </div>
    </>
  );
}
