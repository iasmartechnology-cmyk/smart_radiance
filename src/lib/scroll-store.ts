/**
 * Tiny module-level store that bridges DOM scroll (driven by GSAP/Lenis)
 * and the WebGL render loop (react-three-fiber's useFrame).
 *
 * Keeping the 3D scene decoupled from React state avoids re-renders on scroll:
 * the DOM writes `progress`, the render loop reads it every frame.
 */
export const scrollState = {
  /** Normalized scroll progress across the whole document, 0 → 1. */
  progress: 0,
  /** Normalized pointer position, -1 → 1 on each axis (0,0 = centre). */
  pointerX: 0,
  pointerY: 0,
  /** Toggled off on touch / reduced-motion so the scene ignores the pointer. */
  pointerEnabled: true,
};

export type ScrollState = typeof scrollState;
