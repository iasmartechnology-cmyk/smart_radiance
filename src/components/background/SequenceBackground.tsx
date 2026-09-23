"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollState } from "@/lib/scroll-store";
import { damp } from "@/lib/utils";
import { SEQUENCE_FILES } from "./sequence-files";

/**
 * Scroll-driven backdrop: a processor that comes apart layer by layer —
 * heat spreader, thermal layer, dies, substrate, contacts — powers up, and
 * reassembles at the end of the page.
 *
 * It is rendered offline (scripts/render-cpu: a Three.js scene captured
 * frame by frame in headless Chrome) and shipped as a short MP4 whose
 * playhead follows the scroll position — the technique Apple uses on its
 * product pages.
 *
 * Why a video and not a stack of still images: a real browser only keeps a
 * limited amount of decoded image data around. Hundreds of 720p frames (over
 * 1 GB decoded) get evicted and re-decoded on the main thread right as they
 * are drawn, which is what made slow scrolling stutter. A video is decoded by
 * the GPU's media engine, off the main thread, and holds a few frames at a
 * time. It is encoded with a keyframe every 3 frames, so any seek decodes at
 * most 3 frames.
 *
 * Frames are copied onto a canvas rather than showing the <video> itself:
 * canvas paints are not LCP candidates, so the backdrop can never displace
 * the hero text as the page's LCP element.
 *
 * On the homepage the backdrop opens as a reveal: it starts inside a rounded
 * window behind the hero headline, and as the hero scrolls away the window
 * grows to full screen while the camera pushes in. Other pages get the full
 * backdrop straight away.
 *
 * Layers, bottom to top: onyx wash → window (clip) → zoom → canvas → scrim.
 */

/** Window the reveal opens from — must match `.bg-window` in globals.css. */
const WINDOW = {
  mobile: "inset(30% 6% 22% 6% round 24px)",
  desktop: "inset(24% 22% 18% 22% round 28px)",
  open: "inset(0% 0% 0% 0% round 0px)",
} as const;

/**
 * Backing-store ceiling. The video is 1280 px wide, so a bigger canvas buys
 * no detail — it only multiplies the pixels copied and composited on every
 * scroll frame. The browser upscales the canvas to the screen on the GPU.
 */
const MAX_CANVAS_WIDTH = 1600;

/** Seek only when the target moves by at least half a video frame (30 fps). */
const MIN_SEEK = 0.5 / 30;

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

    // Where the video can't pay for itself only the poster is shown, as a
    // still: reduced motion (a scrubbing backdrop is exactly the motion they
    // opted out of) and Save-Data / 2G (a few MB of video is not a fair
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

    // The cut is picked once per visit: swapping on resize would throw away
    // a video that has already downloaded.
    const src = window.matchMedia("(max-width: 767px)").matches
      ? SEQUENCE_FILES.mobile
      : SEQUENCE_FILES.desktop;

    let source: HTMLVideoElement | HTMLImageElement | null = null;
    let video: HTMLVideoElement | null = null;
    let objectUrl = "";
    let smooth = scrollState.progress;
    let shownTime = -1; // playhead position currently on the canvas
    let seeking = false;
    let px = 0;
    let py = 0;
    let disposed = false;

    /** object-fit: cover copy of the current source onto the canvas. */
    const draw = () => {
      if (!source) return;
      const sw =
        source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
      const sh =
        source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
      if (!sw || !sh) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / sw, ch / sh);
      const w = sw * scale;
      const h = sh * scale;
      ctx.drawImage(source, (cw - w) / 2, (ch - h) / 2, w, h);
      canvas.style.opacity = "1";
    };

    const resize = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        MAX_CANVAS_WIDTH / window.innerWidth,
      );
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      draw(); // resizing clears the canvas
    };
    resize();
    window.addEventListener("resize", resize);

    // One seek in flight at a time: each `seeked` paints the decoded frame
    // and the next tick asks for wherever the scroll has got to since.
    // Queuing seeks instead would make the video fall behind the scroll.
    const onSeeked = () => {
      seeking = false;
      if (!video) return;
      shownTime = video.currentTime;
      draw();
    };

    // One ticker for the whole backdrop (GSAP's, already running for Lenis).
    // Scroll progress is eased so flicks and trackpad jitter glide.
    const tick = (_time: number, deltaMs: number) => {
      const dt = Math.min(deltaMs / 1000, 0.05);
      smooth = damp(smooth, scrollState.progress, 6, dt);

      if (video && !seeking && video.duration) {
        // Stop a hair short of the end: seeking to `duration` exactly can
        // land past the last frame and show nothing in some browsers.
        const end = video.duration - 1 / 30;
        const target = Math.min(1, Math.max(0, smooth)) * end;
        if (Math.abs(target - shownTime) >= MIN_SEEK) {
          seeking = true;
          video.currentTime = target;
        }
      }

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

    const loadStill = () => {
      const img = new Image();
      img.decoding = "async";
      img.src = SEQUENCE_FILES.poster;
      img
        .decode()
        .then(() => {
          if (disposed) return;
          source = img;
          draw();
        })
        .catch(() => {});
    };

    // The whole file is fetched up front and played from memory, so a seek
    // never waits on a network range request mid-scroll.
    const loadVideo = async () => {
      try {
        const res = await fetch(src);
        if (!res.ok) throw new Error(String(res.status));
        const blob = await res.blob();
        if (disposed) return;
        objectUrl = URL.createObjectURL(blob);
        const v = document.createElement("video");
        v.muted = true;
        v.playsInline = true;
        v.preload = "auto";
        v.addEventListener("seeked", onSeeked);
        v.src = objectUrl;
        await new Promise<void>((resolve, reject) => {
          v.addEventListener("loadeddata", () => resolve(), { once: true });
          v.addEventListener("error", () => reject(v.error), { once: true });
        });
        if (disposed) return;
        video = v;
        source = v;
        gsap.ticker.add(tick);
      } catch {
        // No video (unsupported codec, network error): keep the still.
        if (!disposed) loadStill();
      }
    };

    let started = false;
    const start = () => {
      if (disposed || started) return;
      started = true;
      if (still) loadStill();
      else void loadVideo();
    };

    // Kick-off: the visitor's first gesture, or otherwise a short grace
    // period after load plus an idle slot, so the download never lands in
    // the critical path of the hero.
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
      window.clearTimeout(timer);
      if (idleId) w.cancelIdleCallback?.(idleId);
      gestureEvents.forEach((e) => window.removeEventListener(e, start));
      window.removeEventListener("load", afterLoad);
      window.removeEventListener("resize", resize);
      gsap.ticker.remove(tick);
      if (video) {
        video.removeEventListener("seeked", onSeeked);
        video.removeAttribute("src");
        video.load();
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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

      {/* Scrim. Keeps ivory text readable over the footage. */}
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
