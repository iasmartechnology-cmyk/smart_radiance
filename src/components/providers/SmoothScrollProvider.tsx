"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-store";
import { lenisRef } from "@/lib/smooth-scroll";

/**
 * Owns the global scroll experience:
 *  - Lenis smooth-scroll (skipped under prefers-reduced-motion / touch coarse)
 *  - GSAP ScrollTrigger sync + a single normalized progress source
 *  - pointer tracking for subtle 3D parallax
 *
 * Everything is torn down on unmount so no listeners or triggers leak.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let lenis: Lenis | null = null;
    const onLenisScroll = () => ScrollTrigger.update();
    const tickerFn = (time: number) => lenis?.raf(time * 1000);

    if (!reduced) {
      lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
        // Smoothing touch scroll fights the browser on mobile — keep it native.
        syncTouch: false,
      });
      lenis.on("scroll", onLenisScroll);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
    }

    // Single source of truth for normalized document scroll progress.
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    // Pointer parallax (desktop pointers only).
    scrollState.pointerEnabled = !reduced && !coarse;
    const onPointerMove = (e: PointerEvent) => {
      scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (scrollState.pointerEnabled) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // Recalculate positions once fonts/images settle.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      progressTrigger.kill();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("load", refresh);
      if (lenis) {
        gsap.ticker.remove(tickerFn);
        lenis.off("scroll", onLenisScroll);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}
