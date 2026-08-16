"use client";

import { Canvas, useThree } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import { ACESFilmicToneMapping } from "three";
import Scene from "./Scene";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * The post-processing library is a sizeable dependency and only ever runs on
 * desktop, so it gets its own chunk instead of riding along in the main 3D
 * bundle that every phone downloads.
 */
const Effects = dynamic(() => import("./Effects"), { ssr: false });

/**
 * Drives rendering on demand at a capped rate instead of letting R3F render
 * every animation frame.
 *
 * This is the single biggest lever on total blocking time: a full-screen WebGL
 * background that redraws 60 times a second never lets the main thread go
 * idle, which is what turns into tens of seconds of "main thread work" in a
 * Lighthouse trace. The scene is a slow cinematic backdrop, so halving its
 * refresh rate is imperceptible while halving the work.
 *
 * It also stops entirely while the tab is hidden — there is nobody to render
 * for, and browsers still charge us for the frames.
 */
function RenderScheduler({ fps }: { fps: number }) {
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    let raf = 0;
    let last = 0;
    const interval = 1000 / fps;

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (time - last < interval) return;
      last = time;
      invalidate();
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [fps, invalidate]);

  return null;
}

/**
 * WebGL host. Quality knobs (DPR, refresh rate, terrain resolution, particle
 * counts, post-processing) all step down on mobile; under reduced-motion the
 * scene is never mounted at all — see SceneBackground.
 */
export default function SceneCanvas() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  // Resolution ceiling, fixed rather than adaptive. Every extra 0.1 multiplies
  // fill-rate across the whole viewport plus each post-processing pass.
  //
  // A runtime performance monitor is deliberately not used here: with the
  // refresh rate capped below the display's, it would read every frame as a
  // dropped one and keep lowering resolution for no reason, and each change
  // reallocates the renderer's buffers.
  const dpr = mobile ? 1 : 1.25;

  return (
    <Canvas
      // Rendering is scheduled explicitly below rather than every frame.
      frameloop="demand"
      dpr={[1, dpr]}
      camera={{ position: [0, 7, 122], fov: 45, near: 0.5, far: 900 }}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
      }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        <Scene reduced={reduced} mobile={mobile} />
        {!reduced && !mobile && <Effects />}
        <RenderScheduler fps={mobile ? 24 : 30} />
      </Suspense>
    </Canvas>
  );
}
