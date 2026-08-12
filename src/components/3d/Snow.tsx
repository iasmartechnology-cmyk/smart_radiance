"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";

type Props = { count: number };

const FIELD = 90; // cube of drifting particles that follows the camera

/**
 * Spindrift — fine snow blowing across the ascent. The field wraps around a
 * fixed volume so a small particle count reads as continuous weather, and the
 * whole system is one draw call.
 */
export default function Snow({ count }: Props) {
  const ref = useRef<Points>(null);

  const { positions, speeds } = useMemo(() => {
    let seed = 0x51ab19;
    const rand = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (rand() - 0.5) * FIELD;
      pos[i * 3 + 1] = rand() * FIELD;
      pos[i * 3 + 2] = (rand() - 0.5) * FIELD;
      spd[i] = 1.5 + rand() * 3;
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p) return;
    const dt = Math.min(delta, 0.05);
    const attr = p.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1;
      arr[iy] -= speeds[i] * dt;
      // Lateral drift so it blows rather than falls straight.
      arr[i * 3] += Math.sin(t * 0.5 + i) * dt * 0.6;
      if (arr[iy] < 0) arr[iy] = FIELD;
    }
    attr.needsUpdate = true;

    // Keep the volume centred on the camera so it never runs out.
    p.position.x = state.camera.position.x;
    p.position.z = state.camera.position.z;
    p.position.y = state.camera.position.y - FIELD / 2;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.28}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
