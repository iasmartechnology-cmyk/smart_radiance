"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { hasHardwareWebGL } from "@/lib/gpu";

/**
 * Fixed, full-viewport WebGL backdrop that sits behind all content.
 *
 * The heavy Three.js bundle is code-split and only requested on the client
 * after first paint, so it never blocks the hero's LCP. A blue-hour wash is
 * painted underneath as an instant, zero-JS fallback (and the final look on
 * browsers without WebGL).
 */
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function SceneBackground() {
  const [mounted, setMounted] = useState(false);
  // Set once the running scene proves too slow for this device; it is then
  // torn down for good and the CSS wash takes over.
  const [dropped, setDropped] = useState(false);
  const onSlow = useCallback(() => setDropped(true), []);

  // Defer WebGL until the visitor engages (or a grace period passes) so the
  // hero, hydration and first input are never competing with it.
  useEffect(() => {
    // Skip the scene altogether where it can't pay for itself: under
    // reduced-motion it would download the whole Three.js bundle just to paint
    // one frozen frame, and on Save-Data the user has asked us not to. The CSS
    // wash below is the intended fallback in both cases.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      deviceMemory?: number;
    };
    const saveData = Boolean(nav.connection?.saveData);
    // Slow networks and low-end hardware get the CSS wash: a multi-hundred-KB
    // WebGL bundle there costs far more in blocking time than it gives back.
    const slowNet = /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
    const lowEnd =
      (nav.deviceMemory !== undefined && nav.deviceMemory < 4) ||
      (navigator.hardwareConcurrency || 8) <= 2;
    if (reduced || saveData || slowNet || lowEnd) return;
    // No real GPU → WebGL would be rasterised on the CPU main thread.
    if (!hasHardwareWebGL()) return;

    let timer = 0;
    let done = false;
    const mount = () => {
      if (done) return;
      done = true;
      setMounted(true);
    };

    // Starting the scene costs one unavoidable ~250 ms task (Three.js
    // evaluation, shader compilation, baking the terrain). It is triggered by
    // the visitor's first gesture — a mouse move, scroll or touch — which on
    // desktop happens almost at once, so it never lands on top of the initial
    // load and hydration. Visitors who don't touch anything get it after a
    // grace period. The CSS wash covers the moment in between.
    const FALLBACK_MS = 8000;
    const schedule = () => {
      timer = window.setTimeout(mount, FALLBACK_MS);
    };
    const onInteract = () => mount();
    const interactOpts = { once: true, passive: true } as const;
    window.addEventListener("scroll", onInteract, interactOpts);
    window.addEventListener("pointermove", onInteract, interactOpts);
    window.addEventListener("touchstart", onInteract, interactOpts);

    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      window.removeEventListener("load", schedule);
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("pointermove", onInteract);
      window.removeEventListener("touchstart", onInteract);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{
        // Instant blue-hour wash — visible before/without WebGL.
        background:
          "linear-gradient(180deg, #12121b 0%, #1b1c28 45%, #171721 100%)",
      }}
    >
      {mounted && !dropped && <SceneCanvas onSlow={onSlow} />}

      {/*
        Scrim. As the sun clears the ridge the sky gets genuinely bright, which
        would otherwise wreck contrast for the ivory text layered on top. This
        keeps every section readable without dimming the view itself.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(23,23,33,0.55) 0%, rgba(23,23,33,0.30) 35%, rgba(23,23,33,0.55) 75%, rgba(23,23,33,0.80) 100%)",
        }}
      />
    </div>
  );
}
