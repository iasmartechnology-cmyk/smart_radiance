/** Clamp a number to the [min, max] range. */
export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

/** Linear interpolation between a and b by t. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Frame-rate independent damping. `lambda` controls stiffness; higher = snappier.
 * Based on the exponential-decay smoothing used in game/graphics loops.
 */
export const damp = (a: number, b: number, lambda: number, dt: number) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt));

/** Remap a value from one range to another. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const t = (value - inMin) / (inMax - inMin);
  return outMin + clamp(t) * (outMax - outMin);
};
