import type Lenis from "lenis";

/** Holds the active Lenis instance so UI (e.g. nav) can drive programmatic scroll. */
export const lenisRef: { current: Lenis | null } = { current: null };

/**
 * Smoothly scroll to an in-page anchor. Uses Lenis when active, otherwise
 * falls back to native smooth scrolling — so it works under reduced-motion too.
 */
export function scrollToId(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el as HTMLElement, { offset: 0, duration: 1.2 });
  } else {
    (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
