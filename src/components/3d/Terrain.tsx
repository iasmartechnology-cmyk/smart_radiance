"use client";

import { useEffect, useMemo } from "react";
import { BufferAttribute, Color, PlaneGeometry } from "three";
import { TERRAIN_SIZE, heightAtPlane } from "@/lib/terrain";
import { clamp } from "@/lib/utils";

type Props = { mobile: boolean };

const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * The alpine range. Relief is baked into the geometry once (CPU) instead of
 * displaced in a vertex shader every frame — the terrain never changes, so
 * this costs nothing per frame and leaves the GPU free for lighting + bloom.
 *
 * A radial cone raises a dominant summit at the centre (the peak the journey
 * climbs to) while ridged fBm scatters a surrounding range out to the horizon.
 */
export default function Terrain({ mobile }: Props) {
  const segments = mobile ? 120 : 220;

  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      segments,
      segments,
    );
    const pos = geo.attributes.position;
    const count = pos.count;
    const colors = new Float32Array(count * 3);

    const rock = new Color("#232331");
    const rockLit = new Color("#3a3a4d");
    const snow = new Color("#ededf3");
    const tmp = new Color();

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Shared height field — the camera rig samples this same function.
      const h = heightAtPlane(x, y);
      pos.setZ(i, h);

      // Snow line: rock below, snow on the high crests.
      const snowT = smoothstep(17, 30, h);
      const litT = smoothstep(2, 20, h);
      tmp.copy(rock).lerp(rockLit, litT).lerp(snow, snowT);
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }

    geo.setAttribute("color", new BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [segments]);

  // Custom geometry isn't auto-disposed by the renderer — release it manually.
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <meshStandardMaterial
        vertexColors
        flatShading
        roughness={0.92}
        metalness={0.02}
      />
    </mesh>
  );
}
