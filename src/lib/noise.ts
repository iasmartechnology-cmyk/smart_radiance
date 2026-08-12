/**
 * Deterministic value noise + ridged fBm used to generate the mountain relief.
 *
 * Seeded (no Math.random) so the terrain is identical on every render and
 * between server and client, and the generation stays a pure function.
 */

/** mulberry32 — small, fast, seedable PRNG. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SIZE = 256;
const MASK = SIZE - 1;

/** Permutation + gradient tables, built once from a fixed seed. */
const perm = new Uint8Array(SIZE * 2);
const grads = new Float32Array(SIZE * 2);

(() => {
  const rand = mulberry32(1337);
  const p = new Uint8Array(SIZE);
  for (let i = 0; i < SIZE; i++) p[i] = i;
  // Fisher–Yates shuffle
  for (let i = SIZE - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < SIZE * 2; i++) perm[i] = p[i & MASK];
  for (let i = 0; i < SIZE; i++) {
    const angle = rand() * Math.PI * 2;
    grads[i * 2] = Math.cos(angle);
    grads[i * 2 + 1] = Math.sin(angle);
  }
})();

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function gradDot(hash: number, x: number, y: number) {
  const i = (hash & MASK) * 2;
  return grads[i] * x + grads[i + 1] * y;
}

/** 2D gradient noise in roughly [-1, 1]. */
export function noise2D(x: number, y: number): number {
  const xi = Math.floor(x) & MASK;
  const yi = Math.floor(y) & MASK;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = fade(xf);
  const v = fade(yf);

  const aa = perm[perm[xi] + yi];
  const ab = perm[perm[xi] + yi + 1];
  const ba = perm[perm[xi + 1] + yi];
  const bb = perm[perm[xi + 1] + yi + 1];

  const x1 = lerp(gradDot(aa, xf, yf), gradDot(ba, xf - 1, yf), u);
  const x2 = lerp(gradDot(ab, xf, yf - 1), gradDot(bb, xf - 1, yf - 1), u);
  return lerp(x1, x2, v);
}

/**
 * Ridged multifractal — inverting and squaring the noise creates the sharp
 * crests and V-shaped valleys that read as an alpine range rather than hills.
 */
export function ridgedFbm(x: number, y: number, octaves = 5): number {
  let sum = 0;
  let freq = 1;
  let amp = 0.5;
  let weight = 1;

  for (let i = 0; i < octaves; i++) {
    let n = 1 - Math.abs(noise2D(x * freq, y * freq));
    n *= n;
    n *= weight;
    weight = Math.min(1, Math.max(0, n * 2));
    sum += n * amp;
    freq *= 2.05;
    amp *= 0.5;
  }
  return sum;
}
