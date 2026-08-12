"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor } from "@react-three/drei";
import { Suspense, useState } from "react";
import { ACESFilmicToneMapping } from "three";
import Scene from "./Scene";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

/**
 * WebGL host. Quality knobs (DPR, terrain resolution, particle counts,
 * post-processing, frameloop) all step down on mobile and collapse to a single
 * static frame under reduced-motion, so the ascent never taxes weak devices.
 */
export default function SceneCanvas() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  // Upper DPR bound, walked down automatically if the GPU can't keep up.
  const [dpr, setDpr] = useState(mobile ? 1.2 : 1.6);

  return (
    <Canvas
      // A single rendered frame when motion is reduced — no render loop.
      frameloop={reduced ? "demand" : "always"}
      dpr={[1, dpr]}
      camera={{ position: [0, 7, 122], fov: 45, near: 0.5, far: 900 }}
      gl={{
        antialias: !mobile,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: ACESFilmicToneMapping,
      }}
      style={{ pointerEvents: "none" }}
    >
      <Suspense fallback={null}>
        {/*
          Watches the real frame rate and drops resolution before the motion
          starts to stutter — a slightly softer image reads far better than a
          sharp one that judders during the climb.
        */}
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(0.85, d - 0.3))}
          onIncline={() => setDpr(mobile ? 1.2 : 1.6)}
        >
          <Scene reduced={reduced} mobile={mobile} />
        </PerformanceMonitor>
        <AdaptiveDpr pixelated={false} />
      </Suspense>
    </Canvas>
  );
}
