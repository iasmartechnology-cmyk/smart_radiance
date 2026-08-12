"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points, PointsMaterial } from "three";
import { scrollState } from "@/lib/scroll-store";
import { clamp } from "@/lib/utils";

type Props = { count: number; reduced: boolean };

/**
 * Blue-hour starfield. Fades out as the sun clears the ridge, so the sky
 * reads as a real dawn rather than a static backdrop.
 */
export default function Stars({ count, reduced }: Props) {
  const ref = useRef<Points>(null);
  const mat = useRef<PointsMaterial>(null);

  const positions = useMemo(() => {
    // Seeded PRNG — deterministic and pure (no Math.random during render).
    let seed = 0x2f6e2b1;
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 200 + rand() * 90;
      const theta = rand() * Math.PI * 2;
      // Upper hemisphere only — no stars under the terrain.
      const phi = Math.acos(rand() * 0.85);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 20;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!mat.current) return;
    const p = reduced ? 1 : scrollState.progress;
    // Gone by the time the sun is fully up.
    mat.current.opacity = 0.9 * (1 - clamp((p - 0.35) / 0.35));
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={1.1}
        color="#ededf3"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
