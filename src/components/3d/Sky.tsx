"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Color, type ShaderMaterial } from "three";
import { scrollState } from "@/lib/scroll-store";

type Props = { reduced: boolean };

// Blue hour → dawn. Three bands: zenith, horizon glow, and the haze below it.
const NIGHT = {
  top: new Color("#12121b"),
  horizon: new Color("#2b2f4d"),
  bottom: new Color("#171721"),
};
const DAWN = {
  top: new Color("#4d63d8"),
  horizon: new Color("#ffc98a"),
  bottom: new Color("#8a93c4"),
};

const vertexShader = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uBottom;
  varying vec3 vPos;

  void main() {
    float h = clamp(normalize(vPos).y * 0.5 + 0.5, 0.0, 1.0);
    vec3 c = mix(uHorizon, uTop, smoothstep(0.5, 0.92, h));
    c = mix(uBottom, c, smoothstep(0.28, 0.52, h));
    gl_FragColor = vec4(c, 1.0);
  }
`;

/**
 * Sky dome. A single gradient shader on a back-faced sphere — cheaper and
 * smoother than a cubemap, and the three colour bands can be interpolated per
 * frame so the sky genuinely changes as the climb progresses.
 */
export default function Sky({ reduced }: Props) {
  const mat = useRef<ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTop: { value: NIGHT.top.clone() },
      uHorizon: { value: NIGHT.horizon.clone() },
      uBottom: { value: NIGHT.bottom.clone() },
    }),
    [],
  );

  useFrame(() => {
    if (!mat.current) return;
    const p = reduced ? 1 : scrollState.progress;
    // Dawn arrives in the last half of the ascent.
    const t = Math.min(1, Math.max(0, (p - 0.4) / 0.6));
    const e = t * t * (3 - 2 * t);
    const u = mat.current.uniforms;
    (u.uTop.value as Color).copy(NIGHT.top).lerp(DAWN.top, e);
    (u.uHorizon.value as Color).copy(NIGHT.horizon).lerp(DAWN.horizon, e);
    (u.uBottom.value as Color).copy(NIGHT.bottom).lerp(DAWN.bottom, e);
  });

  return (
    <mesh scale={400} frustumCulled={false}>
      <sphereGeometry args={[1, 32, 24]} />
      <shaderMaterial
        ref={mat}
        side={BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}
