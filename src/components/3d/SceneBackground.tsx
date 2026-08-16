"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

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

  // Defer WebGL until the browser is idle so the hero text paints first, but
  // always mount within a hard timeout (idle callbacks are throttled in
  // background/non-composited tabs).
  useEffect(() => {
    // Skip the scene altogether where it can't pay for itself: under
    // reduced-motion it would download the whole Three.js bundle just to paint
    // one frozen frame, and on Save-Data the user has asked us not to. The CSS
    // wash below is the intended fallback in both cases.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData = Boolean(
      (
        navigator as Navigator & {
          connection?: { saveData?: boolean };
        }
      ).connection?.saveData,
    );
    if (reduced || saveData) return;

    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId = 0;
    const mount = () => setMounted(true);
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(mount);
    }
    const timer = window.setTimeout(mount, 700);
    return () => {
      window.clearTimeout(timer);
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
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
      {mounted && <SceneCanvas />}

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
