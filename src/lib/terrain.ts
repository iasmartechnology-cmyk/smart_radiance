import { ridgedFbm } from "./noise";
import { clamp } from "./utils";

/**
 * The mountain's height field — the single source of truth.
 *
 * Both the mesh geometry and the camera rig sample this exact function, so the
 * camera can always know where the ground is and keep a guaranteed clearance
 * above it. Without a shared field the two drift apart and the camera clips
 * through the rock.
 */

export const TERRAIN_SIZE = 260;

const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Height in plane-local coordinates (the space PlaneGeometry is built in).
 * A radial cone raises the dominant summit; ridged fBm scatters the
 * surrounding range; the relief fades to zero near the edges so the horizon
 * stays clean.
 */
export function heightAtPlane(px: number, py: number): number {
  const r = Math.hypot(px, py);
  const cone = Math.exp(-(r * r) / (2 * 30 * 30)) * 30;
  const edge = 1 - smoothstep(80, 125, r);
  const ridge = ridgedFbm(px * 0.013, py * 0.013, 5) * 22 * edge;
  const detail = ridgedFbm(px * 0.06, py * 0.06, 2) * 1.6 * edge;
  return cone + ridge + detail;
}

/**
 * Height at a world-space position.
 *
 * The terrain mesh is rotated -90° about X, which maps plane-local (x, y) to
 * world (x, height, -y) — so the world Z axis is the negated local Y.
 */
export function heightAtWorld(wx: number, wz: number): number {
  return heightAtPlane(wx, -wz);
}

/**
 * Highest ground within a radius of a world position, sampled in a ring.
 * Used for camera clearance: checking a single point lets a sharp crest slip
 * between samples and spear the camera.
 */
export function maxHeightAround(
  wx: number,
  wz: number,
  radius = 6,
  samples = 8,
): number {
  let max = heightAtWorld(wx, wz);
  for (let i = 0; i < samples; i++) {
    const a = (i / samples) * Math.PI * 2;
    const h = heightAtWorld(wx + Math.cos(a) * radius, wz + Math.sin(a) * radius);
    if (h > max) max = h;
  }
  return max;
}
