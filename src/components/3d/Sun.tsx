"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, type DirectionalLight, type Group, type Mesh, type MeshBasicMaterial } from "three";
import { scrollState } from "@/lib/scroll-store";
import { clamp, lerp } from "@/lib/utils";

type Props = { reduced: boolean };

const DAWN = new Color("#ffb765");
const NOON = new Color("#fff3d6");

/**
 * The sun. Below the horizon during the blue-hour ascent, it breaks over the
 * range in the final third and floods the landscape at the summit — the payoff
 * the whole scroll is building toward. Its emissive disc is what the bloom
 * pass blows out into glare.
 */
export default function Sun({ reduced }: Props) {
  const group = useRef<Group>(null);
  const light = useRef<DirectionalLight>(null);
  const disc = useRef<Mesh>(null);
  const halo = useRef<MeshBasicMaterial>(null);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    // Hold the summit lighting when motion is reduced.
    const p = reduced ? 1 : scrollState.progress;

    // Rise: hidden below the ridge line, then climbing into the sky.
    // Sits far beyond the range (z = -300) so it always reads as a distant
    // sun on the horizon rather than an object floating among the peaks.
    const rise = clamp((p - 0.45) / 0.55);
    const eased = rise * rise * (3 - 2 * rise);
    g.position.set(30, lerp(-60, 92, eased), -300);

    if (light.current) {
      light.current.position.copy(g.position);
      light.current.intensity = lerp(0.05, 3.1, eased);
      light.current.color.copy(DAWN).lerp(NOON, eased);
    }
    if (halo.current) halo.current.opacity = lerp(0, 0.5, eased);
  });

  return (
    <>
      <directionalLight ref={light} intensity={0.05} color="#ffb765" />
      <group ref={group}>
        {/* Core disc — drives the bloom glare */}
        <mesh ref={disc}>
          <sphereGeometry args={[18, 32, 32]} />
          <meshBasicMaterial color="#fff6e2" toneMapped={false} />
        </mesh>
        {/* Soft halo */}
        <mesh scale={2.6}>
          <sphereGeometry args={[18, 24, 24]} />
          <meshBasicMaterial
            ref={halo}
            color="#ffc989"
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}
