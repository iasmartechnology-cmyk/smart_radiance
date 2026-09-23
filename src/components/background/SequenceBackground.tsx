"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-store";
import { damp } from "@/lib/utils";

/**
 * Photographic, scroll-driven backdrop.
 *
 * Real drone footage (a flight up a misty snow valley towards the peaks,
 * fading into a golden sunrise above the clouds at the summit) is pre-cut into still frames by
 * scripts/build-sequence.sh and scrubbed on a 2D canvas as the page scrolls —
 * the technique Apple uses on its product pages. Unlike the old WebGL scene it
 * needs no GPU, ships no 3D library and costs next to nothing per frame: a
 * redraw only happens when the frame index actually changes.
 *
 * On the homepage the footage opens as a reveal: it starts inside a rounded
 * window behind the hero headline, and as the hero scrolls away the window
 * grows to full screen while the camera pushes in. Other pages get the full
 * backdrop straight away.
 *
 * Layers, bottom to top: onyx wash → window (clip) → zoom → poster + canvas →
 * scrim.
 */
const SEQUENCE = {
  desktop: { path: "/sequence/desktop/", count: 112 },
  mobile: { path: "/sequence/mobile/", count: 80 },
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
          ).fromTo(zoomRef.current, { scale: 1.25 }, { scale: 1 }, 0);
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

    // Where the sequence can't pay for itself the poster stays as a still:
    // reduced motion (a scrubbing backdrop is exactly the motion they opted
    // out of) and Save-Data / 2G (a few MB of frames is not a fair trade).
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slowNet = /(^|-)2g$/.test(conn?.effectiveType ?? "");
    if (reduced || conn?.saveData || slowNet) return;

    // The set is picked once per visit: swapping sets on resize would throw
    // away every frame already downloaded.
    const { path, count } = window.matchMedia("(max-width: 767px)").matches
      ? SEQUENCE.mobile
      : SEQUENCE.desktop;

    const frames: (HTMLImageElement | null)[] = new Array(count).fill(null);
    let drawn = -1; // index of the frame currently on the canvas
    let target = 0; // index the scroll position asks for
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

    const draw = (force = false) => {
      const i = nearestLoaded(target);
      if (i < 0 || (i === drawn && !force)) return;
      const img = frames[i]!;
      const cw = canvas.width;
      const ch = canvas.height;
      // object-fit: cover
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      if (drawn < 0) canvas.style.opacity = "1";
      drawn = i;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.imageSmoothingQuality = "high";
      draw(true); // resizing clears the canvas
    };
    resize();
    window.addEventListener("resize", resize);

    // One ticker for the whole backdrop (GSAP's, already running for Lenis).
    // Scroll progress is eased like the old camera rig so flicks glide.
    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      smooth = damp(smooth, scrollState.progress, 6, dt);
      target = Math.round(Math.min(1, Math.max(0, smooth)) * (count - 1));
      if (target !== drawn) draw();

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

    // Downloads start once the page itself has loaded, so frames never
    // compete with the HTML, fonts and scripts that make up first paint.
    const queue = loadOrder(count);
    const pump = () => {
      const i = queue.shift();
      if (i === undefined || disposed) return;
      const img = new Image();
      img.decoding = "async";
      img.src = frameUrl(path, i);
      // decode() keeps the JPEG/WebP decode off the main thread, so drawing
      // it later is a plain blit.
      img
        .decode()
        .then(() => {
          if (disposed) return;
          frames[i] = img;
          // Redraw if this frame is a better match than what's on screen.
          if (
            drawn < 0 ||
            Math.abs(i - target) < Math.abs(drawn - target)
          ) {
            draw();
          }
        })
        .catch(() => {})
        .finally(pump);
    };
    const start = () => {
      if (disposed) return;
      gsap.ticker.add(tick);
      for (let k = 0; k < CONCURRENCY; k++) pump();
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      disposed = true;
      queue.length = 0;
      window.removeEventListener("load", start);
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
          style={{
            backgroundColor: "#12121b",
            backgroundImage: "url(/sequence/poster.webp)",
            backgroundSize: "cover",
            backgroundPosition: "center",
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
