"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-store";
import { damp } from "@/lib/utils";

/**
 * Scroll-driven backdrop: a processor that comes apart layer by layer —
 * heat spreader, thermal layer, dies, substrate, contacts — powers up, and
 * reassembles at the end of the page.
 *
 * It is rendered offline (scripts/render-cpu: a Three.js scene captured
 * frame by frame in headless Chrome) and scrubbed here as still frames on a
 * 2D canvas as the page scrolls — the technique Apple uses on its product
 * pages. Unlike the old WebGL scene it
 * needs no GPU, ships no 3D library and costs next to nothing per frame: a
 * redraw only happens when the frame index actually changes.
 *
 * On the homepage the backdrop opens as a reveal: it starts inside a rounded
 * window behind the hero headline, and as the hero scrolls away the window
 * grows to full screen while the camera pushes in. Other pages get the full
 * backdrop straight away.
 *
 * Layers, bottom to top: onyx wash → window (clip) → zoom → poster + canvas →
 * scrim.
 */
const SEQUENCE = {
  desktop: { path: "/sequence/desktop/", count: 150 },
  mobile: { path: "/sequence/mobile/", count: 100 },
} as const;

/** Window the reveal opens from — must match `.bg-window` in globals.css. */
const WINDOW = {
  mobile: "inset(30% 6% 22% 6% round 24px)",
  desktop: "inset(24% 22% 18% 22% round 28px)",
  open: "inset(0% 0% 0% 0% round 0px)",
} as const;

/** Parallel downloads — enough to fill the pipe without starving the page. */
const CONCURRENCY = 6;
/** Resolution ceiling; frames are 1280 px wide, more DPR buys nothing. */
const MAX_DPR = 1.5;

/** Single still used where the full sequence isn't worth loading. */
const POSTER = "/sequence/poster.webp";

const frameUrl = (path: string, i: number) =>
  `${path}${String(i).padStart(3, "0")}.webp`;

/**
 * Coarse-to-fine load order: every 8th frame first, then every 4th, 2nd and
 * finally the rest. Scrubbing works across the whole page after the first
 * handful of requests and simply gets smoother as the gaps fill in.
 */
function loadOrder(count: number): number[] {
  const seen = new Set<number>();
  const order: number[] = [];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(count - 1)) order.push(count - 1);
  return order;
}

export default function SequenceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const isHome = usePathname() === "/";

  // The reveal: one scrubbed timeline over the hero's own scroll distance.
  // Under reduced motion the CSS already shows the backdrop full-screen and
  // nothing is animated.
  useGSAP(
    () => {
      const hero = document.getElementById("inicio");
      if (!isHome || !hero || !windowRef.current || !zoomRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const mm = gsap.matchMedia();
      mm.add(
        { mobile: "(max-width: 767px)", desktop: "(min-width: 768px)" },
        (ctx) => {
          const from = ctx.conditions?.mobile ? WINDOW.mobile : WINDOW.desktop;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          tl.fromTo(
            windowRef.current,
            { clipPath: from },
            { clipPath: WINDOW.open },
            0,
          ).fromTo(zoomRef.current, { scale: 1.15 }, { scale: 1 }, 0);
        },
      );
      return () => mm.revert();
    },
    { dependencies: [isHome] },
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    // Where the sequence can't pay for itself only the poster is shown, as a
    // still: reduced motion (a scrubbing backdrop is exactly the motion they
    // opted out of) and Save-Data / 2G (a few MB of frames is not a fair
    // trade).
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slowNet = /(^|-)2g$/.test(conn?.effectiveType ?? "");
    const still = reduced || Boolean(conn?.saveData) || slowNet;

    // The set is picked once per visit: swapping sets on resize would throw
    // away every frame already downloaded.
    const { path, count } = still
      ? { path: "", count: 1 }
      : window.matchMedia("(max-width: 767px)").matches
        ? SEQUENCE.mobile
        : SEQUENCE.desktop;
    const urlFor = (i: number) => (still ? POSTER : frameUrl(path, i));

    const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);
    // Fractional frame position the scroll asks for (e.g. 40.3), and the
    // position currently painted. Painting the fraction — rather than
    // rounding to a whole frame — is what keeps slow scrolling fluid: with
    // ~100 frames over the whole page a whole-frame step lands only every
    // ~50 px, which reads as a stuttering slideshow.
    let pos = 0;
    let painted = -1;
    let smooth = scrollState.progress;
    let px = 0;
    let py = 0;
    let disposed = false;

    /** Nearest frame to `i` that has finished loading. */
    const nearestLoaded = (i: number) => {
      for (let d = 0; d < count; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };

    /** object-fit: cover blit at the given opacity. */
    const blit = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    /**
     * Paint the scroll position as a blend of the two frames either side of
     * it: frame `a` opaque, frame `a + 1` on top at the fractional weight.
     * Until both neighbours have loaded, the nearest loaded frame is shown.
     */
    const draw = () => {
      const a = Math.floor(pos);
      const t = pos - a;
      const lo = frames[a];
      const hi = frames[Math.min(a + 1, count - 1)];
      if (lo && hi) {
        blit(lo, 1);
        if (t > 0.01 && hi !== lo) blit(hi, t);
      } else {
        const i = nearestLoaded(Math.round(pos));
        if (i < 0) return;
        blit(frames[i]!, 1);
      }
      ctx.globalAlpha = 1;
      if (painted < 0) canvas.style.opacity = "1";
      painted = pos;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      draw(); // resizing clears the canvas
    };
    resize();
    window.addEventListener("resize", resize);

    // One ticker for the whole backdrop (GSAP's, already running for Lenis).
    // Scroll progress is eased like the old camera rig so flicks glide.
    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      smooth = damp(smooth, scrollState.progress, 6, dt);
      pos = Math.min(1, Math.max(0, smooth)) * (count - 1);
      // Repaint only while the position is actually moving.
      if (Math.abs(pos - painted) > 0.004) draw();

      // Subtle pointer parallax on desktop; the canvas is scaled up slightly
      // in CSS so the edges never show.
      if (scrollState.pointerEnabled) {
        const nx = damp(px, scrollState.pointerX, 2.5, dt);
        const ny = damp(py, scrollState.pointerY, 2.5, dt);
        if (Math.abs(nx - px) > 0.001 || Math.abs(ny - py) > 0.001) {
          px = nx;
          py = ny;
          canvas.style.transform = `translate3d(${(-px * 12).toFixed(1)}px, ${(-py * 8).toFixed(1)}px, 0) scale(1.04)`;
        }
      }
    };

    // Downloads start well after first paint (see the kick-off below), so
    // frames never compete with the HTML, fonts and scripts of the hero.
    // Everything — the poster included — is drawn on the canvas rather than
    // set as a CSS background: canvas paints are not LCP candidates, so the
    // backdrop can never displace the hero text as the page's LCP element
    // (a background image inside the animated window was being re-reported
    // as LCP seconds later on phones).
    const queue = loadOrder(count);
    const pump = () => {
      const i = queue.shift();
      if (i === undefined || disposed) return;
      const img = new Image();
      img.decoding = "async";
      img.src = urlFor(i);
      // decode() keeps the JPEG/WebP decode off the main thread, so drawing
      // it later is a plain blit.
      img
        .decode()
        .then(() => {
          if (disposed) return;
          frames[i] = img;
          // Repaint if this frame is one the current position needs.
          if (painted < 0 || Math.abs(i - pos) < 2) draw();
        })
        .catch(() => {})
        .finally(pump);
    };
    let started = false;
    const start = () => {
      if (disposed || started) return;
      started = true;
      gsap.ticker.add(tick);
      for (let k = 0; k < CONCURRENCY; k++) pump();
    };

    // Kick-off: the visitor's first gesture, or otherwise a short grace
    // period after load plus an idle slot. Starting on `load` alone let the
    // frame requests begin before the hero had painted on slow devices,
    // which drags the whole sequence into the LCP critical path.
    const GRACE_MS = 1500;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let timer = 0;
    let idleId = 0;
    const afterLoad = () => {
      timer = window.setTimeout(() => {
        if (w.requestIdleCallback) {
          idleId = w.requestIdleCallback(start, { timeout: 1000 });
        } else start();
      }, GRACE_MS);
    };
    const gesture = { once: true, passive: true } as const;
    const gestureEvents = ["scroll", "pointermove", "touchstart", "keydown"];
    gestureEvents.forEach((e) => window.addEventListener(e, start, gesture));
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });

    return () => {
      disposed = true;
      queue.length = 0;
      window.clearTimeout(timer);
      if (idleId) w.cancelIdleCallback?.(idleId);
      gestureEvents.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener("load", afterLoad);
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        // Onyx wash — what surrounds the window before the reveal opens.
        background:
          "linear-gradient(180deg, #12121b 0%, #1b1c28 45%, #171721 100%)",
      }}
    >
      {/* Window (clip) → zoom (push-in) → footage. Kept as separate layers
          so the clip, the zoom and the pointer parallax never fight over the
          same transform. */}
      <div
        ref={windowRef}
        className={`absolute inset-0 will-change-[clip-path] ${isHome ? "bg-window" : ""}`}
      >
        <div
          ref={zoomRef}
          className="bg-zoom absolute inset-0 will-change-transform"
          // A slightly lifted slate so the window reads as a shape at first
          // paint; the footage fades in over it once the first frame lands.
          style={{
            background:
              "linear-gradient(180deg, #1f2233 0%, #1a1c2a 60%, #171721 100%)",
          }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700"
            style={{ transform: "scale(1.04)" }}
          />
        </div>
      </div>

      {/*
        Scrim. Keeps ivory text readable over the footage — strongest at the
        bottom, where the golden sunrise is at its brightest.
      */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(23,23,33,0.55) 0%, rgba(23,23,33,0.35) 35%, rgba(23,23,33,0.55) 75%, rgba(23,23,33,0.80) 100%)",
        }}
      />
    </div>
  );
}
